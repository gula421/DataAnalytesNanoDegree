#!/usr/bin/env python
# -*- coding: utf-8 -*-
import xml.etree.cElementTree as ET
from collections import defaultdict
from bs4 import BeautifulSoup
import re
import requests
import csv
import wikipedia

filename = 'sample_10.osm' 
# filename = '../data/zurich_switzerland.osm'


############# functions

def print_first_sentence(word):
	try:
		b = wikipedia.page(word)
	except:
		b =''
		# try:
		# 	b = wikipedia.page(word+'Aargau')
		# except:
		# 	b = wikipedia.page(word+'Zürich')
#         try:
#             b = wikipedia.search(word+'Aargau')
#             print b
#             b = wikipedia.page(b[0])
#         except:
#             b = wikipedia.search(word+'Zürich')
#             print b
#             b = wikipedia.page(b[0])

	sentence=''
	c=0
	if b:
		for q in b.content:
			if c<1:
				if q!='\n':
					sentence+=q
				else:
					c+=1
			else:
				break
	return sentence

def fix_problem_is_in(word):
	'''
	input a word and then will look for wikipedia and find canton as a output

	'''

	sen = print_first_sentence(word)
	canton = re.compile(r'canton of (\S+)[\s\.\,].*')
	kanton = re.findall(canton, sen)
	if len(kanton) == 0:
		kanton = ''
	else:
		kanton = re.findall(r'[^\s\.\,]+',kanton[0])[0]
	return kanton

def get_district(id_kanton):
	'''
	input the id of the canton (with the developer's tool) from wikipage
	then will output a list of all the districts (German is Bezirk) in that canton (German is Kanton)
	'''
	wikipage = 'https://de.wikipedia.org/wiki/Bezirk_(Schweiz)'
	s = requests.Session()
	r = s.get(wikipage)
	soup = BeautifulSoup(r.text, "html.parser")
	district_list = []
	for h3 in soup.find_all('h3'):
		if h3.find(id=id_kanton):
			for sib in h3.next_siblings:
				if sib.name =='table':
					for tr in sib.find_all('tr'):
						i = 0
						for td in tr.find_all('td'):
							i += 1
							if i%2 != 0:
								if td.a:
									district_list.append(td.a.text)
									return district_list


## Steps:
# (1) remove CH, Schweiz, Europe
# (2) add key: Kanton
# -search for AG or ZH or Aargau or Zurich 
# -search for Bezirk or any word in Bezirk
# if find bezirk -> fill kanton
# if no Bezirk and not other words left -> Bezirk=[], -> kanton=[]
# if no Bezirk and some other words left -> put into problem_list

def get_kantonBezirk(a):

	'''
	input the value from the key "is_in"
	(it's a string about places in Zürich or Aargau, Switzerland)
	then will output a list: [canton_name, district_name, place_name]
	the canton_name and district_name are defined according to the information on wikipedia,
	everything else in the description will be assigned as place_name.
	The unknown field will output as an empty value. 

	'''
	### allbz can be generated with the following code ###
	### but to avoid it's called for every tag,        ###
	### below I just paste the reulst as a known value ###
	# ZH=get_district('Kanton_Z.C3.BCrich')
	# AG=get_district('Kanton_Aargau')
	# allbz = '|'.join(ZH+AG)
	ZH = 'Affoltern,Andelfingen,B\xc3\xbclach,Dielsdorf,Dietikon,Hinwil,Horgen,Meilen,Pf\xc3\xa4ffikon,Uster,Winterthur,Z\xc3\xbcrich'
	AG = 'Aarau,Baden,Bremgarten,Brugg,Kulm,Laufenburg,Lenzburg,Muri,Rheinfelden,Zofingen,Zurzach'
	allbz = 'Affoltern,Andelfingen,B\xc3\xbclach,Dielsdorf,Dietikon,Hinwil,Horgen,Meilen,Pf\xc3\xa4ffikon,Uster,Winterthur,Z\xc3\xbcrich|Aarau|Baden|Bremgarten|Brugg|Kulm|Laufenburg|Lenzburg|Muri|Rheinfelden|Zofingen|Zurzach'
	
	######################################################
	ch = re.compile(r'Schweiz|Europe|CH|[Kk]anton|Switzerland')
	re_kanton = re.compile(r'Aargau|AG|Zürich|ZH')
	# re_aargau = re.compile(r'Aargau|AG|Zürich')
	# re_zurich = re.compile(r'Zürich')
	re_bezirk = re.compile(r'[Bb]ezirk')
	re_getBezirk = re.compile(r'[Bb]ezirk\s(\S+)\,')
	re_all_bezirk = re.compile(allbz)

	## first remove text related to switzerland
	a = re.sub(ch,'',a).strip(',')

	## find kanton
	if re.findall(re_kanton,a):
		if len(re.findall(re_kanton,a)[0])==2:
			kanton = 'Aargau'        
		else: 
			kanton = re.findall(re_kanton,a)[0]
			a = re.sub(re_kanton,'',a)
	else:
		kanton = ""

	## find bezirk
	if re.findall(re_getBezirk,a):
		bezirk = re.findall(re_getBezirk,a)[0]
	elif re.findall(re_all_bezirk,a):
		bezirk = re.findall(re_all_bezirk,a)[0]
	else:
		bezirk = ""

	a = re.sub(re_getBezirk,'',a)
	a = re.sub(re_bezirk,'',a)
	a = re.sub(re_all_bezirk,'',a).encode('utf-8') 
	a = ' '.join(filter(None,map(str.strip,a.split(','))))

# get kanton by bezirk
	if ((len(kanton)==0)&(len(bezirk)>0)):

		if bezirk.encode('utf-8') in ZH:
			kanton = 'Zürich'
		elif bezirk in AG:
			kanton = 'Aargau'
	elif ((len(kanton)==0)&(len(bezirk)==0)):
		kanton = fix_problem_is_in(a)
		a = re.sub(re_kanton,'',a).strip()

    ## find other
	if len(a)>0:
		other = a
	else:
		other = ""

	return [kanton,bezirk,other]


def get_problem_list():
	ZH=get_district('Kanton_Z.C3.BCrich')
	AG=get_district('Kanton_Aargau')
	allbz = '|'.join(ZH+AG)

	problem_list = set()
	f = open(filename,'r')
	for _,elem in ET.iterparse(f):
		for tags in elem.findall('./tag'):
			if tags.attrib['k']=='is_in':
				KB_values = get_kantonBezirk(tags.attrib['v'])
				if KB_values[2]:
					problem_list.add(KB_values[2])
	return problem_list


# ## main functions
if __name__ == '__main__':
	with open('p_list.csv','w') as w:
		writer = csv.writer(w,delimiter=',')
		writer.writerow(p_list)

	# for problem in get_problem_list():
	# 	print problem

