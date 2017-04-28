function barChart() {
    // accesible options to the caller
    var width_svg = 900;
    var height_svg = 200;
    var barPadding = 5;
    var fillColor = 'steelblue';
    var data = [];
    var margin = {top:10, right:10, left:70, bottom:200};
    // var addColor = '#f2760c';//'#e88937';
     
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
                         .attr('class','wholeBar')
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
               .attr("y", 10)
               .attr("x", -5)
               .attr("dy", ".25em")
               .attr("transform", "rotate(26)")
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
            AddBarPlot = function(data, data2, barID, addColor){
                // data: global data (the unchanged bar plot)
                // data2: selcted data (the bar plot changed according to the selected fields)
                // barID: ID of the div encapsulates the entire bar plot

                oldData = data[0];
                // process new data 
                // to make sure it has all fields as old data in the data array 
                // make Count = 0 if the field doesn't exist
                var newData = [];
                var allKeys = Object.keys(oldData[0]);
                var allFieldsInData2 = [];
                for (var f = 0; f < data2.length; f++){
                  allFieldsInData2.push(data2[f].Long)
                };

                for (var i = 0; i < oldData.length; i++){
                  // first copy the fields from the oldData
                  tempObject = {
                    'Long': oldData[i].Long,
                    'Short': oldData[i].Short, 
                    'Count': 0
                  };

                var ID_data2 = allFieldsInData2.indexOf(oldData[i].Long);
                  if ( ID_data2 !== -1){
                      tempObject.Count = data2[ID_data2].Count;
                    }; 
                  newData.push(tempObject);
                }
               
                // remove the tip from the original bins 
                d3.select('#'+barID)
                       .selectAll(".bar_bin")
                       .remove();

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
       

                // replot the global data
                var oldBar = d3.select('#'+barID).selectAll('.bar_group');
                // new tip
                var tip = d3.tip()
                          .attr('class', 'd3-tip')
                          .direction('e')
                          .offset([0, 20])
                          .html(function(d, i) {
                            return '<div id="tiptable">' + 
                            "<p>" + newData[i].Long+ "</p>"+
                            "<p>"+ newData[i].Count + 
                            " out of " +oldData[i].Count + "</p>"+ "</div>";
                            // return '<table id="tiptable">' + "<tr><td>" + data2[i].Long+ "</td><td>"+ data2[i].Count +" out of " +data[0][i].Count + "</td></tr>"+ "</table>";
                        });
                oldBar.call(tip);

                oldBar
                      .data(oldData)
                      .append('rect')
                      .attr('class','bar_bin')
                      .attr("x", function(d) {return xscale(d.Short);})
                      .attr("width", xscale.rangeBand())
                      .attr("y", function(d) { return yscale(d.Count); })
                      .attr("height", function(d) { return height - yscale(d.Count); })
                      .style("fill", fillColor)
                      .on('mouseover', tip.show)
                      .on('mouseout', tip.hide);
                
  
                // add bar using new data (data2)
                var update = d3.select('#'+barID)
                               .selectAll('.bar_group')
                               .data(newData);

                update
                    .append('rect')
                    .attr('class','ageDegree_bin')
                    .attr("x", function(d) {return xscale(d.Short);})
                    .attr("width", xscale.rangeBand())
                    .attr("y", function(d) { return yscale(d.Count); })
                    .attr("height", function(d) { return height - yscale(d.Count); })
                    .style("fill", addColor)
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

            chart.addBar = function(data1, data2, barID, addColor) {
                AddBarPlot(data1, data2, barID, addColor)
                return chart;
            };
     
            // chart.addColor = function(value) {
            //     if(!arguments.length) return addColor;
            //     addColor = value;
            //     return chart;
            // };

            return chart;
} // end of the whole function: barChart 
