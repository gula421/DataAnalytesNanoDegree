function hist(csvdata,idname) {
    var binsize = 1;

    var minbin = Math.floor(d3.min(csvdata, function(d){   
    // debugger;
    return d;
    }));//36;
    var maxbin = Math.ceil(d3.max(csvdata, function(d){
    // debugger;
    return d;
    }));//60;
    var numbins = (maxbin - minbin) / binsize;

    var binmargin = .2; 
    var margin = {top: 10, right: 30, bottom: 50, left: 60};
    var width = 800 - margin.left - margin.right;
    var height = 400 - margin.top - margin.bottom;

    // Set the limits of the x axis
    var xmin = minbin - 1
    var xmax = maxbin + 1

    histdata = new Array(numbins);
    for (var i = 0; i < numbins; i++) {
        histdata[i] = { numfill: 0, agefill: 0};
    }

    // Fill histdata with y-axis values and meta data
    csvdata.forEach(function(d) {
        var bin = Math.floor((d - minbin) / binsize);
        if ((bin.toString() != "NaN") && (bin < histdata.length)) {
            histdata[bin].numfill += 1;
            histdata[bin].agefill = d;
        }
    });

    // This scale is for determining the widths of the histogram bars
    // Must start at 0 or else x(binsize a.k.a dx) will be negative
    var x = d3.scale.linear()
      .domain([0, (xmax - xmin)])
      .range([0, width]);

    // Scale for the placement of the bars
    var x2 = d3.scale.linear()
      .domain([xmin, xmax])
      .range([0, width]);
    
    var y = d3.scale.linear()
      .domain([0, d3.max(histdata, function(d) { 
                        return d.numfill; 
                        })])
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x2)
      .orient("bottom");
    var yAxis = d3.svg.axis()
      .scale(y)
      .ticks(8)
      .orient("left");

    
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .direction('e')
      .offset([0, 20])
      .html(function(d) {
        return '<table id="tiptable">' + "Age:"+d.agefill+", Count:"+d.numfill + "</table>";
    });

    // put the graph in the div with id as "idname"
    var svg = d3.select("#"+idname).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + 
                        margin.top + ")");

    svg.call(tip);

    // set up the bars
    var bar = svg.selectAll(".bar")
      .data(histdata)
      .enter().append("g")
      .attr("class", "bar")
      .attr("transform", function(d, i) { return "translate(" + 
           x2(i * binsize + minbin) + "," + y(d.numfill) + ")"; })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    // add rectangles of correct size at correct location
    bar.append("rect")
      .attr("x", x(binmargin))
      .attr("width", x(binsize - 2 * binmargin))
      .attr("height", function(d) { return height - y(d.numfill); });

    // add the x axis and x-label
    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
    svg.append("text")
      .attr("class", "xlabel")
      .attr("text-anchor", "middle")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom/2)
      .text("Age");

    // add the y axis and y-label
    svg.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis);
    svg.append("text")
      .attr("class", "ylabel")
      .attr("y", 0 - margin.left) // x and y switched due to rotation
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("transform", "rotate(-90)")
      .style("text-anchor", "middle")
      .text("Counts");
}