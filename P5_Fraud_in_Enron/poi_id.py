#!/usr/bin/python

import sys
import pickle
sys.path.append("../tools/")

from feature_format import featureFormat, targetFeatureSplit
from tester import dump_classifier_and_data
import pandas as pd
import numpy as np


### Task 1: Select what features you'll use.
### features_list is a list of strings, each of which is a feature name.
### The first feature must be "poi".
features_list = ['poi', 'exercised_stock_options', 'total_stock_value', 
'to_poi', 'bonus', 'salary', 'restricted_stock'] 

### Load the dictionary containing the dataset
with open("final_project_dataset.pkl", "r") as data_file:
    data_dict = pickle.load(data_file)

# convert data to dataframe for easier handle
dataT = [data_dict[data_dict.keys()[x]] for x in range(0,len(data_dict))]
df = pd.DataFrame(dataT, index = data_dict.keys())
df = df.replace('NaN',np.nan)
# Remove features with less than half valid entries
df = df.loc[:,df.isnull().sum(axis=0)<=len(df)/2.]
# drop email_address
df = df.drop('email_address', axis=1)
### Task 2: Remove outliers
## remove outlier, the max value
rm_id = list(df["expenses"]).index(max(df["expenses"]))
rm_name = df.index[rm_id]
df.iloc[rm_id, :]
df = df.drop(df.index[rm_id])
### Task 3: Create new feature(s)
df['to_poi'] = df['from_this_person_to_poi']/df['from_messages'].astype(float)
df['from_poi'] = df['from_poi_to_this_person']/df['to_messages'].astype(float)
# set those "to_messages" or "to_messages" equals 0 (would be nan) to 0:
df['to_poi'] = df['to_poi'].fillna(0.)
df['from_poi'] = df['from_poi'].fillna(0.)
# remove old features
df = df.drop(['from_this_person_to_poi','from_poi_to_this_person','to_messages','from_messages'], axis=1)
df[['to_poi','from_poi']].describe()
# replace na with median
df = df.fillna(df.median())

# process the data to array for sklearn feature selection
target = df.poi.as_matrix()
features = df.drop('poi', axis=1).as_matrix()
# scale features
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
scaled_features = scaler.fit_transform(features)

# interested_list: features ordered by scores
from sklearn.feature_selection import SelectKBest
def select_features(df, features, target):
    ## only use select KBest
    ## The first version considered both results from KBest and DecisionTree, 
    ## but the result from decision tree changes everytime.
#     ## This also change the whole prediction and make it irreproducible.  
    
    nf = len(features[1])
    # SelectKBest
    sel = SelectKBest(k = nf)
    sel.fit(features, target)
    score_kBest = sel.scores_.reshape(nf, 1)
    # sort the score
    pd_score = pd.DataFrame(score_kBest)
    score_list = list(pd_score.reset_index().sort_values(0, ascending=False)['index'])
    df_feature = list(df.drop('poi', axis=1).columns)
    
    # convert the socre to a list of interested fetaures (sorted from highest to lowest scores)
    interested_list = [df_feature[x] for x in score_list]
    
    return interested_list, pd_score

interested_list, pd_score = select_features(df, scaled_features, target)

### Store to my_dataset for easy export below.
# convert back to the format Udacity used
my_dataset = df.transpose().to_dict()







### Extract features and labels from dataset for local testing
data = featureFormat(my_dataset, features_list, sort_keys = True)
labels, features = targetFeatureSplit(data)

### Task 4: Try a varity of classifiers
### Please name your classifier clf for easy export below.
### Note that if you want to do PCA or other multi-stage operations,
### you'll need to use Pipelines. For more info:
### http://scikit-learn.org/stable/modules/pipeline.html

# Provided to give you a starting point. Try a variety of classifiers.

# This happens to be the classifier I choose in the end
from sklearn.naive_bayes import GaussianNB
clf = GaussianNB()

### Task 5: Tune your classifier to achieve better than .3 precision and recall 
### using our testing script. Check the tester.py script in the final project
### folder for details on the evaluation method, especially the test_classifier
### function. Because of the small size of the dataset, the script uses
### stratified shuffle split cross validation. For more info: 
### http://scikit-learn.org/stable/modules/generated/sklearn.cross_validation.StratifiedShuffleSplit.html

# Example starting point. Try investigating other evaluation techniques!
from sklearn.cross_validation import train_test_split
features_train, features_test, labels_train, labels_test = \
    train_test_split(features, labels, test_size=0.3, random_state=42)

### Task 6: Dump your classifier, dataset, and features_list so anyone can
### check your results. You do not need to change anything below, but make sure
### that the version of poi_id.py that you submit can be run on its own and
### generates the necessary .pkl files for validating your results.

dump_classifier_and_data(clf, my_dataset, features_list)