function plot_points(){
            // debugger;
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
            
            var projection = d3.geo.mercator()
                               .scale(140)
                               .translate([width / 2.2, height / 1.5])

                    // add circles
                    // decide the size of circles
            var radius = d3.scale.sqrt()
                           .domain([0, d3.max(data, function(d){
                            // debugger;
                            return d[fieldName];})])
                           .range([min_circle_size, max_circle_size]);

                    //decide the location

                    
            var svg = d3.select(this);

            var coords = data.map(function(d) {
                    return {
                      'loc': projection([+d.lon, +d.lat]),
                      'rad': +d[fieldName]
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
                             .attr('r', function(d) {return radius(d.rad);});
                            

       // update functions
            

            updateFillColor = function() {
              svg.selectAll('.point').style('fill', fillColor);
                // svg.transition().duration(1000).style('fill', fillColor);
            };


            updatePlot = function(){
              // debugger;
                  coords = data.map(function(d) {
                      return {
                        'loc': projection([+d.lon, +d.lat]),
                        'rad': +d[fieldName]
                      };
                  });

                  radius = d3.scale.sqrt()
                           .domain([0, d3.max(data, function(d){
                            // debugger;
                            return d[fieldName];})])
                           .range([min_circle_size, max_circle_size]);

                  debugger;

                  d3.select(".remark")
                    .text("Number of "+ fieldRelate[fieldName]);

                  var update = svg.selectAll('.point').data(coords);
                  // update.exit().remove();
                  update
                    .transition()
                    .duration(1000)
                    .attr('cx', function(d) { return d.loc[0]; })
                    .attr('cy', function(d) { return d.loc[1]; })
                    .attr('r', function(d) {return radius(d.rad);});

            };// end of update

            

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