function barChart() {
    // accesible options to the caller
    var width_svg = 900;
    var height_svg = 200;
    var barPadding = 5;
    var fillColor = 'steelblue';
    var data = [];
    var margin = {top:10, right:10, left:70, bottom:200};
     
    function chart(selection){
        selection.each(function () {

            var width = width_svg - margin.left - margin.right;
            var height = height_svg - margin.top - margin.bottom;
            var barSpacing = width / data.length;
            var barWidth = barSpacing - barPadding;
            var maxValue = d3.max(data, function(d){return d.Count});
            var heightScale = 0.9 * height / maxValue; // max value = 0.9 height

            // add a svg to put the bar plot
            var svg = d3.select(this).append('svg')
                         .attr('height', height_svg)
                         .attr('width', width_svg)
                         .append('g')
                         .attr("class", "graph")
                         .attr("transform","translate (" + margin.left + " ," + margin.top + " )");
             
            // scale the axis
            var xscale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1, 0.3);
            var yscale = d3.scale.linear().range([height, 0]);
            var xAxis = d3.svg.axis().scale(xscale).orient("bottom");
            var yAxis = d3.svg.axis().scale(yscale).orient("left");
            xscale.domain(data.map(function(d){return d.Short; }));
            yscale.domain([0, d3.max(data, function(d){return d.Count;})]);

            // response of tip
            var tip = d3.tip()
                          .attr('class', 'd3-tip')
                          .direction('e')
                          .offset([0, 20])
                          .html(function(d) {
                            return '<table id="tiptable">' + d.Long+ ", Count:"+d.Count + "</table>";
                        });
            svg.call(tip);

            // add the bar plots
            svg.selectAll('.bar')
                .data(data)
                .enter() 
                .append('g')
                .attr('class', 'bar_group')
                .append('rect')
                .attr('class','bar_bin')
                .attr("x", function(d) {return xscale(d.Short);})
                .attr("width", xscale.rangeBand())
                .attr("y", function(d) { return yscale(d.Count); })
                .attr("height", function(d) { return height - yscale(d.Count); })
                .style("fill", fillColor)
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

            // y-label
            svg.append("text")
              .attr("class", "axislabel")
              .attr("y", -margin.left) // x and y switched due to rotation
              .attr("x", -(height / 2))
              .attr("dy", "1em")
              .attr("transform", "rotate(-90)")
              .style("text-anchor", "middle")
              .text("Count");


            //// function to add bar on top of global data
            AddBarPlot = function(data, data2, barID){

                // data: global data (the unchanged bar plot)
                // data2: selcted data (the bar plot changed according to the selected fields)
                // barID: ID of the div encapsulates the entire bar plot

                // reset global scale to be agreed with the right data (data)
                var xscale = d3.scale.ordinal().rangeRoundBands([0, width], 0.1, 0.3);
                var yscale = d3.scale.linear().range([height, 0]);
                var xAxis = d3.svg.axis().scale(xscale).orient("bottom");
                var yAxis = d3.svg.axis().scale(yscale).orient("left");
                var xlist = [];
                var ylist = [];
                for (var i = 0; i < data[0].length; i++) {
                  xlist.push(data[0][i].Short);
                  ylist.push(data[0][i].Count);
                }
                xscale.domain(xlist);
                yscale.domain([0, d3.max(ylist)]);

                // add bar using new data (data2)
                var update = d3.select('#'+barID).selectAll('.bar_group').data(data2);

                update
                    .append('rect')
                    .attr('class','ageDegree_bin')
                    .attr("x", function(d) {return xscale(d.Short);})
                    .attr("width", xscale.rangeBand())
                    .attr("y", function(d) { return yscale(d.Count); })
                    .attr("height", function(d) { return height - yscale(d.Count); })
                    .style("fill", 'red')
                    .on('mouseover', tip.show)
                    .on('mouseout', tip.hide); 
            } // end of AddBarPlot     
         });//end of selection
    }// end of chart
     
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
            };

            chart.addBar = function(data1, data2, barID) {
                debugger;
                AddBarPlot(data1, data2, barID)
                return chart;
            };
     
            return chart;
} // end of the whole function: barChart 
