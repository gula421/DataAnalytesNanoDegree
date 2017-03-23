#!/usr/bin/env python
# -*- coding: utf-8 -*-
import pandas as pd
import re
import xml.etree.cElementTree as ET
from collections import defaultdict
from bs4 import BeautifulSoup
import requests
import csv
from is_in import print_first_sentence, fix_problem_is_in, get_kantonBezirk  
import datetime

def get_tag(tag_elem,upper_layer_id):
#      {'id': id of the top level,
#      'key': value of 'k' in the tag element. 
#             If there is colon in the value, 
#             then words before the first colon will be 'type'
#             and words after the first colon will be 'key'.
#      'type': either addressed as in the key or shown as "regular".
#      'value': value of 'v' in the tag element.
#     }

	outlist = []
	for tag_element in tag_elem:
	 	ori_key = tag_element.attrib['k']
		ori_value = tag_element.attrib['v']

		upper_layer_id = upper_layer_id
		addr_list = ['addr:city','addr:state']
		bus_list = ['line','lines','route_ref','busline']
		re_unit = re.compile(r'width|distance|height|depth|min_age')
		opening_hours = ["kitchen_hours", "opening_hours", "opening_hours:reading_room", "opening_hours_1", "service_times","collection times"]
		date_list = ["survey:date", "time", "start_date", "end_date", "temporary:date_on"]
		
		out_key, out_type = get_key_type(ori_key)

		taglist = {}

		# find canton and district names for each location
		if ori_key == 'is_in':		
			out_type = ori_key
			out_key =["canton","district","local_name"]
			cleaned_value = get_kantonBezirk(ori_value)
			taglist = concat_taglist(upper_layer_id,out_key,cleaned_value,out_type)	
		# replace abbreviation with full name
		elif ori_key in addr_list :
			cleaned_value = modify_addr(ori_value, out_key)
		# use consistence phone style
		elif re.findall(r'[Pp]hone|[Ff]ax|[Mm]obile',ori_key):
			cleaned_value = clean_phone(ori_value)
		# remove version from created_by
		elif ori_key == 'created_by':
			cleaned_value = ori_value.strip().split(' ')[0]
		# make consistent bus line list  
		elif ori_key in bus_list:
			re_split = re.compile(r'[N0-9]+')
			cleaned_value = ','.join(re.findall(re_split,ori_value))
			out_type = 'bus'
			out_key = 'line'
		# move unit from value to key
		elif re.findall(re_unit,ori_key):
			cleaned_value = re.findall(r'[0-9.]+',ori_value)
			if cleaned_value:
				cleaned_value = cleaned_value[0]
			else:
				cleaned_value = ''
			if ori_key == 'distance':
				out_key = ori_key+'(km)'
			elif ori_key == 'min_age':
				out_key = ori_key+'(yr)'
				if cleaned_value == '3':
					cleaned_value = 3/12. # convert from month to year
			else:
				out_key = ori_key+'(m)'
		# separate language from wikipedia 
		elif ori_key == 'wikipedia':
			out_type = ori_key
			out_key = re.findall('(\w+):(.+)',ori_value)[0][0]
			cleaned_value = re.findall('(\w+):(.+)',ori_value)[0][1]
		# make consistent highway labels
		elif ori_key == 'destination:ref':			
			cleaned_value = clean_autobahn(ori_value)
		# make consistent opening hour labels
		elif ori_key in opening_hours:
			cleaned_value = clean_opening_hours(ori_value)
		# make consistent date labels
		elif ori_key == "xmas:day_date":
			cleaned_value = ' to '.join(map(lambda x: pd.to_datetime(x).strftime('%Y-%m-%d'),ori_value.split('-')))
		elif ori_key in date_list:
			cleaned_value = clean_date(ori_value)
		# take the value in the tag directly
		else:
			cleaned_value = ori_value

		if len(taglist) == 0:
			taglist['key'] = out_key
			taglist['type'] = out_type
			taglist['value'] = cleaned_value
			taglist['id'] = upper_layer_id
			outlist.append(taglist)
		else:
			outlist += taglist

	return outlist

def clean_date(a):
	a = re.findall(r'[\d\.\-]+',a)[0]
	if re.findall(r'\.',a):
		a = pd.to_datetime(a).strftime('%Y-%m-%d')
	elif re.findall('/',a):
		a = pd.to_datetime(a).strftime('%Y-%m')

	return a

def clean_opening_hours(a):
	a = re.sub(r' PH -1 day:|[pPsS][hH]',';PH ',a)
	a = re.sub(r'24/7','Mo-Su 00:00-23:59',a)
	a = re.sub(r'Mon[day|tag]*|Mo\.','Mo',a)
	a = re.sub(r'Tue[sday]*|Dienstag|Di[\.]*|Tu\.','Tu',a)
	a = re.sub(r'Wed[nesday]*|Mittwoch|Mi[\.]*','We',a)
	a = re.sub(r'Thu[rsday]*|Donnerstag|Do[\.]*','Th',a)
	a = re.sub(r'Fri[day]*|Freitag|Fr[\.]*','Fr',a)
	a = re.sub(r'Sat[urday]*|Samstag|Sa[\.]*','Sa',a)
	a = re.sub(r'Sun[day]*|Sonntag|Su[\.]*','Su',a)
	a = re.sub(r'[Gg]eschlossen|OFF|Off','off;',a)
	a = re.sub(r'[\s]*[/][\s]*',',',a) 
	a = re.sub(r'[\s]*[\-\+]|bis[\s]','-',a) 
	a = re.sub(r'\sUhr[\.]*',':00',a)
	a = re.sub(r'(\d+)\.(\d+)\s*-\s*(\d+).(\d+)',r'\1:\2-\3:\4',a)
	re_weekday = re.compile(r'([^\s\]\d\:][A-Za-z\-\.\:\,\s]+)\s*(\d+[\d\:\-\+\s\,]+|off)') ###
	q = re.findall(re_weekday,a)
	g = lambda (x,y): ' '.join([''.join(re.findall(r'[A-Za-z][A-Za-z\-\:\,]+',x)),''.join(re.findall(r'[\d\-\:\,]+|off',y))])
	g = ';'.join(map(g,q))
	return g




def clean_autobahn(a):
	if a == unicode('Zürich-Wollishofen','utf-8'):
		a='A3'
	elif len(re.findall(r'A',a))==0:
		a='A'+a
	a = ''.join(a.split(' '))
	a = re.findall(r'[A0-9]+',a)[0]
	return a


def clean_phone(a):
	'''
	input any format of phone number as a string,
	output would be regional_code and standard_formed_phone_number
	regional_code with the format: 044
	standard_formed_phone_number: +414433333  
	If input is not a valid phone number, then output would be empty
	If input are more than two phones, then only output the first one  
	'''

	a = ''.join(''.join(a.split(' ')).split('-'))
	a = re.sub(r'\([+410]+\)','',a)
	re_phone = re.compile(r'[\+\(\)0-9]+')
	a = re.findall(re_phone,a)
 
	if a:
		if len(a[0])<5:
			a = ''.join(a)
		else:
			a = a[0]   
		a = re.sub(r'\+41','',a)
		a = re.sub(r'\+','',a)
		a = re.sub(r'^0','',a)
		phone_number = '+41'+ a
	else:
		phone_number = ''

	return phone_number


def modify_addr(ori_value, key_list):
	re_city = re.compile(r'ZH|AG|CH|\(\w+\)|/|,')
	if key_list =='state':
		sub_value = 'Zurich'
	else:
		sub_value = ''  	
	out_value = re.sub(re_city,sub_value,ori_value).strip()
	return out_value


def get_key_type(ori_key):
	colon_tag = re.compile(r'(\w+):(.+)')
	outlist = {}
	find_colon = re.findall(colon_tag,ori_key)
	if find_colon:
		out_key = find_colon[0][1]
		out_type = find_colon[0][0]
	else:
		out_key = ori_key
		out_type = "regular"
	return out_key, out_type 


def concat_taglist(upper_layer_id,key_list,cleaned_value,out_type):
	'''
	input the upper_layer_id, key, cleaned_value, type of the tag 
	
	'''

	all_taglist = []

	for i in range(len(cleaned_value)):
		one_taglist = {}
		one_taglist['id'] = upper_layer_id
		one_taglist['key'] = key_list[i]
		one_taglist['value'] = cleaned_value[i]
		one_taglist['type'] = out_type
		all_taglist.append(one_taglist)

	return all_taglist


