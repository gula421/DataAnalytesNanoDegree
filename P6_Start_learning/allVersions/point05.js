function plot_points(){
            debugger;
            var max_circle_size = 20;
            var min_circle_size = 0;
            var data = [];
            var fillColor = 'steelblue';
            var fieldName = 'registered'; 
            var width = 1400;
            var height = 600;
            var projection = d3.geo.mercator()
                               .scale(140)
                               .translate([width / 2.2, height / 1.5])

            function chart(selection){
                selection.each(function(){  

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


                    svg.append('g')
                       .attr("class", "bubble")
                       .selectAll("circle")
                       .data(coords)
                       .enter()
                       .append("circle")
                       .attr('cx', function(d) { return d.loc[0]; })
                       .attr('cy', function(d) { return d.loc[1]; })
                       .attr('r', function(d) {
                            return radius(d.rad);
                       });



                });
            } // end of chart


            chart.fillColor = function(value) {
                if (!arguments.length) return fillColor;
                fillColor = value;
                return chart;
            };

            chart.data = function(value) {
                if(!arguments.length) return data;
                data = value;
                return chart;
            };

            chart.max_circle_size = function(value) {
                if(!arguments.length) return max_circle_size;
                max_circle_size = value;
                return chart;
            };

            chart.min_circle_size = function(value) {
                if(!arguments.length) return min_circle_size;
                min_circle_size = value;
                return chart;
            };

            chart.fieldName = function(value) {
                if(!arguments.length) return fieldName;
                fieldName = value;
                return chart;
            };

            chart.width = function(value) {
                if(!arguments.length) return width;
                width = value;
                return chart;
            };

            chart.height = function(value) {
                if(!arguments.length) return height;
                height = value;
                return chart;
            };

            chart.projection = function(value) {
                if(!arguments.length) return projection;
                projection = value;
                return chart;
            };

            return chart;

}; // end of plot_points 