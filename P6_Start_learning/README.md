## Summary
More and more people are taking online courses now. The goal is to motivate you to start learning with online courses by showing some data to give you some guideline of taking courses. 

This data visualization shows how many people taking online courses in different countries and their activities. You can also see the age and background distribution of the students and the courses they took. By clicking the bin of your age, you can explore the background of people with your age and see what kind of courses they took. 

## Data sources:
[edX.org Academic Year 2012-2013](https://public.tableau.com/s/sites/default/files/media/EdX_2013%20Academic%20Year%20Courses.csv)
The data were processed using python (EDA.ipynb) to
- remove invalid entries (null values)
- remove "Other" regions (e.g., Other South Asia)
- match the country names between EdX data and json map data
- find the center of mass for the largest land in a country as the center of the plotted circle on the map.

The processed data can be found using the link:
- [age_job_course.csv](https://www.dropbox.com/s/4na1gh45q3yk98h/age_job_course.csv?dl=0)
- [country_activity.csv](https://www.dropbox.com/s/nhswgzwb0w0h5vg/country_activity.csv?dl=0)
- [country_age_job_course.csv](https://www.dropbox.com/s/6twn5mnjzcyul1i/country_age_job_course.csv?dl=0)
- [world_countries.json](https://www.dropbox.com/s/icp8o2hh7ppgtln/world_countries.json?dl=0)


## Initial design decisions:
- chart type: world map, histogram and bar plots.
- visual encodings: 
  - Sizes of circles reflects the number of registered students and activities.
  - Different color distinguishes the selected fields.  
  - Animation first shows the global trend in course taking activities and then interactions are available for further exploration.
- layout/hierarchy: World map on the top of the page and then showing the distribution of age, background (highest degree obtained) and enrolled courses.
- legends: Hover the mouse on each circle, land and bin to see the actual number of each field.    

## Feedback 
1. (based on index01.html)
The concept of "Reusable plot" can be easier to adjust the plot, for example, change the plotted data set or the bin size of the histogram.

- Modification (in index02.html)  
	- Program the code using the concept of [reusable plot](https://bost.ocks.org/mike/chart/). The size of the plot, data, bin size can be easily changed.


2. (based on index03.html)
The xlabel is allright for degree but is too long for courses. Y-axis should be added to be clear that it's count. 

- Modification (in index04.html):
	- Use short version of the course name in the xlabel. The long version of the course name can be seen from hovering the mouse on the bin. The long and short names are the same for the bar plot showing degree. 
	- Y-axis was also added.


3. (based on index06.html)
A list of buttons allows people to look at the display again after the animation would be helpful. Although the sizes of circles show the relative values across all countries, it would be nicer to also see the values (so tip can be helpful).

- Modification (in index07.html): 
	- The buttons showing different displayed fields in the animation were added. 
     
 
4. (based on index08.html):
When one age is selected it's difficult to see the actual number of small bars. Actually, the red bars are not correctly linked to the blue bars. It's difficult to tell because you cannot read the actual numbers when the value is too small in the red bars. However, when you go through the elements you can clearly see that different bins are grouped together. The responses of degree and enrolled courses to the age selection are quite slow. The heading of "Number of played videos / Number of registered in the country" can be shortened.  

- Modification (in index09.html): 
  - I modified the tip so that now only one box emerging to show both global data and selected filtered data. In this case, the actual data can still be shown without selecting the very small (unseen) red bars.
  - The red bars indeed linked to the wrong blue bars because the red bars don't always have every category due to its much smaller number of samples. I fixed this by specifically assigned the missing category in the red bars as 0 and make sure red and blue bars are properly grouped. 
  - The slow response was due to repeatedly loading of the large number of data (>400,000 entries). I modified the code to make sure redundant loading is not longer there and the hence enhanced the speed.
  - The heading is shortened according to the suggestion. 

5. (based on index08.html):
Changes of the dots on the world map to represent different statistics are not easy to notice. The emergence of the four banners on the top left seems like slow loading of the page...

- Modification: (in index09.html)
	- Different colors were applied to different displayed fields to make the animation easier to notice. 
	- A sentence "Review the fields again" now shows up together with the four banners to make the function of the four banners clearer.

6. (based on index08.html):
There is no indication of where there is a hyperlink or can be clicked on. If the page is intended to advertise some kind of learning platform (not indicated on the page though), a sentence like "Find out what courses people of your age are taking!" would be more catchy. In this regard the education background doesn't seem so relevant.

- Modification: (in index09.html)
	- The cursors for interavtive regions are now changed to pointers to highlight its interactive function. 
	- The sentence is also changed according to the suggestion. 
	- However I still keep the bar plotof education background. I think knowing the education background of people of my age brings different motivation. For example, if I see most people of my age taking these courses are better educated than I am, I can definitely feel the importance of further education such as online courses. 

7. (based on index08.html)
There seems to be weak connections between the map and the lower 3 plots. 

- Modification (in index10.html):
  -	I added an interaction allowing people to see the distribution of degree, enrolled courses and ages in different countries. By selecting the age bin, you can explore more about the distribution for people with different ages.
  - I also added a heading to make the the interaction for further exploration clear.


## Reference:
* https://bl.ocks.org/
* http://cagrimmett.com/til/2016/04/26/responsive-d3-bar-chart.html
* https://www.toptal.com/d3-js/towards-reusable-d3-js-charts
* http://alignedleft.com/tutorials/d3/
* http://www.frankcleary.com/making-an-interactive-histogram-in-d3-js/
* http://jsfiddle.net/cyril123/gtbhz7nL/
* http://stackoverflow.com/questions/26234636/d3-js-prepend-similar-to-jquery-prepend

