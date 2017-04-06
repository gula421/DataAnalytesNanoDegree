function barChart() {
     
        // All options that should be accessible to caller
    var width_svg = 900;
    var height_svg = 200;
    var barPadding = 5;
    var fillColor = 'steelblue';
    var data = [];
    var margin = {top:10, right:10, left:60, bottom:200};
    // var hoverColor = 'red';
     
    function chart(selection){
        selection.each(function () {
            
            var data_value = Object.values(data);
            // debugger;
            var data_key = Object.keys(data);
            var width = width_svg - margin.left - margin.right;
            var height = height_svg - margin.top - margin.bottom;
            var barSpacing = width / data_value.length;
            var barWidth = barSpacing - barPadding;
            var maxValue = d3.max(data_value);
            var heightScale = 0.9 * height / maxValue; // max value = 0.9 height


            var svg = d3.select(this).append('svg')
                         .attr('height', height_svg)
                         .attr('width', width_svg)
                         .append('g')
                         .attr("class", "graph")
                         .attr("transform","translate (" + margin.left + " ," + margin.top + " )");
             
            // axis
            var xscale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1, 0.3);
            var yscale = d3.scale.linear().range([height, 0]);
            var xAxis = d3.svg.axis().scale(xscale).orient("bottom");
            var yAxis = d3.svg.axis().scale(yscale).orient("left");
            xscale.domain(data_key);
            // debugger;
            yscale.domain([0, d3.max(data_value)]);
// debugger;
            var tip = d3.tip()
                          .attr('class', 'd3-tip')
                          .direction('e')
                          .offset([0, 20])
                          .html(function(d, i) {
                            return '<table id="tiptable">' + data_key[i]+ ", Count:"+data_value[i] + "</table>";
                        });
            svg.call(tip);

            svg.selectAll('.bar')
                .data(data_value)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr("x", function(d, i) {return xscale(data_key[i]);})
                .attr("width", xscale.rangeBand())
                .attr("y", function(d) { return yscale(d); })
                .attr("height", function(d) { return height - yscale(d); })         
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide);

            // append x-axis
            svg.append('g')
               .attr("class", "axis")
               .attr("transform", "translate( 0 , " + height + " )")
               .call(xAxis)
               .selectAll("text")
               .attr("y", 0)
               .attr("x", 9)
               .attr("dy", ".25em")
               .attr("transform", "rotate(90)")
               .style("text-anchor", "start");


            // append y-axis
            svg.append('g')
               .attr("class", "axis")
               .call(yAxis);
               
         });
    }
     
            chart.width_svg = function(value) {
                if (!arguments.length) return width_svg;
                width_svg = value;
                return chart;
            };
     
            chart.height_svg = function(value) {
                if (!arguments.length) return height_svg;
                height_svg = value;
                return chart;
            };
     
            chart.barPadding = function(value) {
                if (!arguments.length) return barPadding;
                barPadding = value;
                return chart;
            };
     
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

            chart.margin = function(value) {
                if(!arguments.length) return margin;
                margin = value;
                return chart;
            }
     
            return chart;
} 
