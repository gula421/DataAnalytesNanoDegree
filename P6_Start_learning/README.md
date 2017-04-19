## Abstract
More and more people are taking online courses now. The goal is to motivate you to start learning with online courses by showing some data to give you some guideline of taking courses. 

This data visualization shows how many people taking online courses in different countries and their activities. You can also see the age and background distribution of the students and the courses they took. By clicking the bin of your age, you can explore the background of people with your age and see what kind of courses they took. 


## Initial design decisions:
- chart type: world map, histogram and bar plots.
- visual encodings: 
  - Sizes of circles reflects the number of registered students and activities.
  - Different color distinguishes the selected fields.  
  - Animation first shows the global trend in course taking activities and then interactions are available for further exploration.
- layout/hierarchy: World map on the top of the page and then showing the distribution of age, background (highest degree obtained) and enrolled courses.
- legends: Hover the mouse on each circle, land and bin to see the actual number of each field.    

## reference:R
* https://bl.ocks.org/
* http://cagrimmett.com/til/2016/04/26/responsive-d3-bar-chart.html
* https://www.toptal.com/d3-js/towards-reusable-d3-js-charts
* http://alignedleft.com/tutorials/d3/
* http://www.frankcleary.com/making-an-interactive-histogram-in-d3-js/
