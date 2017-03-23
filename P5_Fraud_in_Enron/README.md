# Detect Person of Interest in the Fraud in Enron Scandal

* **File:** Enron.ipynb
* **Project goal:** Use machine learning to identify the cirtical features determining the person involved in the Enron Scandal (person of interested) based on the email data and financial records.
 
* **Data source:** final_project_dataset.pkl

* **Programming:** Python 

#### Summary: 
The final feature list with the best performance of prediction is 'exercised_stock_options', 'total_stock_value', 'to_poi', 'bonus', 'salary', 'restricted_stock'. The most critical features for identifying people involved in the fraud is the financial data. Actually these three factors ('bonus', 'exercised_stock_options', 'expenses') already enough to reach the best performance. The additional consideration of emails that showing the interactions with poi only slightly improve the performance.

#### Other files:
* final_project_dataset.pkl: original data
* my_dataset.pkl: the processed dataset for machine learning
* my_classifier.pkl: the final selected classifier with chosen parameters 
* my_feature_list.pkl: the final selected feature lists for machine learning
* poi_id.py: main program for running machine learning
* feature_format.py: function used for Udacity to evaluate the result.
* tester.py: function used for Udacity to evaluate the result.

#### Project Reviewer Comment:
>Dear student,
your submission is quite unique, the analysis is really thorough and cared for, the feature selection process is possibly the best I've ever seen so far....


