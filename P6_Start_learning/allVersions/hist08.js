function hist() {
    // accesible options to the caller
    var binsize = 1;
    var data = [];
    var width_svg = 800;
    var height_svg = 400;
    var margin = {top:10, right:10, left:60, bottom:40};
    var fillColor = 'steelblue';
    var binSpacing = 0.8; // (unit: binWidth) 
                          // The size of binSpacing = 1 means no spacing. 

    function chart(selection){
      selection.each(function () {

        var minbin = Math.floor(d3.min(data, function(d){ return d;}));
        var maxbin = Math.ceil(d3.max(data, function(d){return d;}));
        var numbins = Math.floor((maxbin - minbin) / binsize);

        var width = width_svg - margin.left - margin.right;
        var height = height_svg - margin.top - margin.bottom;
        var binwidth = width/numbins;

        // create array to store bins of the histogram 
        histdata = new Array(numbins);
        for (var i = 0; i < numbins; i++) {
            histdata[i] = { "count": 0, "x_value": 0};
        }
        // calculate data in each bin of the histogram
        data.forEach(function(d) {
            var bin = Math.floor((d - minbin) / binsize);
            if ((bin.toString() != "NaN") && (bin < histdata.length)) {
                histdata[bin].count += 1;
                histdata[bin].x_value = minbin+binsize*bin;
            }
        });       

        // axis
        var x = d3.scale.linear()
                  .domain([minbin, maxbin])
                  .range([0, width]);
    
        var y = d3.scale.linear()
                  .domain([0, d3.max(histdata, function(d) { 
                                    return d.count; 
                                    })])
                  .range([height, 0]);

        var xAxis = d3.svg.axis()
                          .scale(x)
                          .orient("bottom");
        var yAxis = d3.svg.axis()
                          .scale(y)
                          .ticks(8)
                          .orient("left");
        // tip response
        var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .direction('e')
                    .offset([0, 20])
                    .html(function(d) {
                      if (binsize == 1) {
                        var age_out = d.x_value;
                      } else {
                        var age_out = d.x_value + " - " + ((d.x_value)+binsize);
                      }       
                      return '<table id="tiptable">' + "Age: "+ 
                      age_out + 
                      ", Count: "+d.count + "</table>";
                  });

        // put the graph in an svg
        var svg = d3.select(this).append('svg')
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("class", "graph")
                    .attr("transform", "translate(" + margin.left + "," + 
                                      margin.top + ")");

        svg.call(tip);

        // set up the bars
        var bar = svg.selectAll(".bar")
          .data(histdata)
          .enter().append("g")
          .attr("class", "bar")
          .append("rect")
          .attr('class', 'bin')
          .attr("x", function(d){return x(d.x_value)})
          .attr("width", binSpacing*(x(histdata[1].x_value)-x(histdata[0].x_value)))
          .attr("y", function(d){return  y(d.count);})
          .attr("height", function(d) { return height - y(d.count); })
          .style("fill", fillColor)        
          .on('mouseover', tip.show)
          .on('mouseout', tip.hide);

        // add x axis
        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0,"+height+")")
          .call(xAxis)
          .selectAll("text")
          .attr("y", -5)
          .attr("x", 0)
          .attr("dy", "2em")
          .style("text-anchor", "middle");
        // add x-label
        svg.append("text")
          .attr("class", "axislabel")
          .attr("text-anchor", "middle")
          .attr("x", width / 2)
          .attr("y", height +0.8*margin.bottom)
          .text("Age");

        // add y axis 
        svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0,0)")
          .call(yAxis);
        // add y-label
        svg.append("text")
          .attr("class", "axislabel")
          .attr("y", - margin.left) // x and y switched due to rotation
          .attr("x", - (height / 2))
          .attr("dy", "1em")
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "middle")
          .text("Count");

      });
    }

    chart.binsize = function(value) {
          if (!arguments.length) return binsize;
          binsize = value;
          return chart;
    };  

    chart.data = function(value) {
          if (!arguments.length) return data;
          data = value;
          return chart;
    };    

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

    chart.fillColor = function(value) {
          if (!arguments.length) return fillColor;
          fillColor = value;
          return chart;
    };

    chart.margin = function(value) {
          if (!arguments.length) return margin;
          margin = value;
          return chart;
    };

    chart.binSpacing = function(value) {
          if (!arguments.length) return binSpacing;
          binSpacing = value;
          return chart;
    };

    return chart;
}