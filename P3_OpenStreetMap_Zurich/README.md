# Explore Zurich with OpenStreetMap

* **File:** OpenStreetMap.ipynb 
* **Project goal:** Parse and clean large data (.xml) and then use SQL to store, query and aggregate data for the analysis.
 
* **Data source:** https://mapzen.com/data/metro-extracts/metro/zurich_switzerland/

* **Programming:** python, SQL 

#### Summary: 
This analysis explored the "public transportation", "street", "amenity", "restaurant", "bank", "supermarket" in Zurich. 

The most seen street type is "Strasse" and the three most common amenities are bench, restaurant and drinking water. Even though Zurich is in the German-speaking part of Switzerland, Italian cuisine is most common. Regional and Asian restaurants are the second and thrid most common crusines. PostFinance, the bank service provided by the post office has the most branches in the city. The two largest supermarket companies like to open close to each other. Two supermarkets from the same company but target to different customers also open close to each other to provide more choices to all types of customers.

#### Other files:
* clean_format.py and is_in.py: all functions used for data processing.
* main.py: main program for running all data processing.