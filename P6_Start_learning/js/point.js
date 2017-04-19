function plot_points(){
    // accesible options to the caller
    var max_circle_size = 10;
    var min_circle_size = 2;
    var data = [];
    var fillColor = 'steelblue';
    var fieldName = 'registered'; 
    var width = 1400;
    var height = 600;
    var fieldRelate = {
              'registered': 'registered people',
              'ndays_act':'active days', 
              'nplay_video':'played videos', 
              'nforum_posts':'posts on forum'
            };        

    function chart(selection){
        selection.each(function(){  
            // format for showing numbers
            var formatCount = d3.format(".2f");

            var projection = d3.geo.mercator()
                               .scale(140)
                               .translate([width / 2.2, height / 1.5])

            //// add circles 
            // scale the size of circles
            var radius = d3.scale.sqrt()
                           .domain([0, d3.max(data, function(d){
                            return d[fieldName];})])
                           .range([min_circle_size, max_circle_size]);

            //decide the location         
            var svg = d3.select(this);
            // tip response
            var tip = d3.tip()
                          .attr('class', 'd3-tip')
                          .direction('e')
                          .offset([0, 20])
                          .html(function(d) {
                            debugger;
                            return '<table id="tiptable">' +d.country_name+', '+ d.rad+ "</table>";
                        });
            svg.call(tip);

            // plot the circle at the right position on the projected map
            var coords = data.map(function(d) {
                    var rad_value = +d[fieldName];
                    if (fieldName !== 'registered'){
                      rad_value = formatCount(+d[fieldName])};
                    return {
                      'loc': projection([+d.lon, +d.lat]),
                      'rad': rad_value,
                      'country_name': d.Country
                    };
                    });
            
            var circles = svg.append('g')
                             .attr("class", "bubble")
                             .selectAll("circle")
                             .data(coords)
                             .enter()
                             .append("circle")
                             .attr('class','point')
                             .attr('cx', function(d) { return d.loc[0]; })
                             .attr('cy', function(d) { return d.loc[1]; })
                             .attr('r', function(d) {return radius(d.rad);})
                             .on('mouseover', tip.show)
                             .on('mouseout', tip.hide);

                          
       //// update functions
           updateFillColor = function() {
              svg.selectAll('.point').style('fill', fillColor);
            };

           updatePlot = function(){
                  // update the data displayed
                  coords = data.map(function(d) {
                    rad_value = +d[fieldName];
                    if (fieldName !== 'registered'){
                      rad_value = formatCount(+d[fieldName])};

                    return {
                      'loc': projection([+d.lon, +d.lat]),
                      'rad': rad_value,
                      'country_name': d.Country
                    };
                    });

                  // update the circle radius
                  radius = d3.scale.sqrt()
                           .domain([0, d3.max(data, function(d){
                            // debugger;
                            return d[fieldName];})])
                           .range([min_circle_size, max_circle_size]);

                  // heading displayed
                  if (fieldName !== 'registered') {
                    d3.select(".remark")
                    .text("Number of "+ fieldRelate[fieldName]+' / Number of registered in the country');
                  } else {
                    d3.select(".remark")
                    .text("Number of "+ fieldRelate[fieldName]);
                  };

                  
                  // plot the updated circles 
                  var update = svg.selectAll('.point').data(coords);
                  update
                    .transition()
                    .duration(1000)
                    .attr('cx', function(d) { return d.loc[0]; })
                    .attr('cy', function(d) { return d.loc[1]; })
                    .attr('r', function(d) {return radius(d.rad);});
                    
            };// end of updatePlot
          }); //end of selection
      } // end of chart

            chart.fillColor = function(value) {
                if (!arguments.length) return fillColor;
                fillColor = value;
                if (typeof updateFillColor === 'function') updateFillColor();
                return chart;
            };

            chart.fieldRelate = function(value) {
                if (!arguments.length) return fieldRelate;
                fieldRelate = value;
                if (typeof updatePlot === 'function') updatePlot();
                return chart;
            };

            chart.data = function(value) {
                if(!arguments.length) return data;
                data = value;
                if (typeof updatePlot === 'function') updatePlot();
                return chart;
            };

            chart.max_circle_size = function(value) {
                if(!arguments.length) return max_circle_size;
                max_circle_size = value;
                if (typeof updatePlot === 'function') updatePlot();
                return chart;
            };

            chart.min_circle_size = function(value) {
                if(!arguments.length) return min_circle_size;
                min_circle_size = value;
                if (typeof updatePlot === 'function') updatePlot();
                return chart;
            };

            chart.fieldName = function(value) {
                if(!arguments.length) return fieldName;
                fieldName = value;
                if (typeof updatePlot === 'function') updatePlot();
                return chart;
            };

            chart.width = function(value) {
                if(!arguments.length) return width;
                width = value;
                if (typeof updatePlot === 'function') updatePlot();
                return chart;
            };

            chart.height = function(value) {
                if(!arguments.length) return height;
                height = value;
                if (typeof updateHeight === 'function') updateHeight();
                return chart;
            };
            return chart;
}; // end of plot_points 