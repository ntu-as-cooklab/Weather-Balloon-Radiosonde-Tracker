function draw_skewT( fsn ){
    var m = [30, 40, 20, 35],
        w = 700 - m[1] - m[3],
        h = 700 - m[0] - m[2];
    var tan = Math.tan(55*(Math.PI/180)),
        basep = 1050,
        topp = 100,
        plines = [1000,850,700,500,300,200,100]
        pticks = [950,900,800,750,650,600,550,450,400,350,250,150];
        barbsize = 25;
    // Scales and axes. Note the inverted domain for the y-scale: bigger is up!
    var x = d3.scale.linear().range([0, w]).domain([-45,50]),
        y = d3.scale.log().range([0, h]).domain([topp, basep])
        r = d3.scale.linear().range([0,150]).domain([0,100]),
        y2 = d3.scale.linear(),
        xAxis = d3.svg.axis().scale(x).tickSize(0,0).ticks(10).orient("bottom"),
        yAxis = d3.svg.axis().scale(y).tickSize(0,0).tickValues(plines)
                  .tickFormat(d3.format(".0d")).orient("left")
        yAxis2 = d3.svg.axis().scale(y).tickSize(5,0).tickValues(pticks).orient("right"); // just for ticks
        //yAxis2 = d3.svg.axis().scale(y2).orient("right").tickSize(3,0).tickFormat(d3.format(".0d"));
    // various path generators
    var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d,i) { return x(d.temp) + (y(basep)-y(d.press))/tan; })
        //.x(function(d,i) { return x(d.temp); })
        .y(function(d,i) { return y(d.press); });

    var line2 = d3.svg.line()
        .interpolate("linear")
        .x(function(d,i) { return x(d.dwpt) + (y(basep)-y(d.press))/tan; })
        .y(function(d,i) { return y(d.press); });

    var hodoline = d3.svg.line.radial()
        .radius(function(d) { return r(d.wspd); })
        .angle(function(d) { return (d.wdir+180)*(Math.PI/180); });

    // bisector function for tooltips
    var bisectTemp = d3.bisector(function(d) { return d.press; }).left;
    // create svg container for sounding
    $("div#mainbox").empty();
    var svg = d3.select("div#mainbox").append("svg")
          .attr("width", w + m[1] + m[3])
          .attr("height", h + m[0] + m[2])
        .append("g")
          .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

      svg.append("text") // title
          .attr("x", (w/ 2))
          .attr("y", 0 - (m[0] / 2))
          .attr("text-anchor", "middle")
          .style("font-size", "18px")
          .style("text-decoration", "underline")
          .text(fsn);

    // create svg container for hodograph
    drawBackground();
    var skewtgroup = svg.append("g").attr("class", "skewt"); // put skewt lines in this group
    var barbgroup  = svg.append("g").attr("class", "windbarb"); // put barbs in this group
    d3.xhr('data/skewT/'+fsn).get(function (err, response) {
          var alldata = parseData(response);
          var i = 0;
    	  parsedCSV = alldata[i].filter(function(d) { return (d.temp > -1000 && d.dwpt > -1000); });
    	  barbs = parsedCSV.filter(function(d) { return (d.wdir >= 0 && d.wspd >= 0 && d.press >= topp); });
    	  hodobarbs = barbs.filter(function(d) { return (d.press >= 175); });
    	  parsedCSVreversed = parsedCSV.reverse(); // bisector needs ascending array

    	  drawLines(i);
          drawBarbs();
          drawToolTips();

    });

    function parseData(response) {
        var dirtyCSV = response.responseText.split('MEMBER').slice(1);
        var parsedCSV = dirtyCSV.map(function(data) {
            var cleanCSV = data.split('\n').slice(1).join('\n');
            var parsedCSV = d3.csv.parse(cleanCSV);
            var sfchgt = parsedCSV[0].hght;
            parsedCSV.forEach(function(d) {
    				d.press = +d.press;
    				d.temp = +d.temp;
    				d.dwpt = +d.dwpt;
    				d.hght = +d.hght;
    				d.wdir = +d.wdir;
    				d.wspd = +d.wspd;
    				d.hghtagl = +d.hght - sfchgt;

    				var rounded = Math.round(d.wspd/5) * 5;
    				d.flags        = Math.floor(rounded/50);
    				d.pennants     = Math.floor((rounded - d.flags*50)/10);
    				d.halfpennants = Math.floor((rounded - d.flags*50 - d.pennants*10)/5 );
    				d.barbsum = d.flags + d.pennants + d.halfpennants;
    	    });
    	    return parsedCSV
    	});

    	return parsedCSV
    }
    function drawLines(mem) {
        k = 0;
        // Draw temperature
    	skewtgroup.append("path")
            //.attr("transform", "translate(0," + h + ") skewX(-30) translate(0,-" + h + ")")
              .attr("class", function(d) { return  "temp sounding member rollover"+k })
              .attr("clip-path", "url(#clipper)")
              .attr("d", line(parsedCSV));

        // Draw dew point temperature
        skewtgroup.append("path")
              //.attr("transform", "translate(0," + h + ") skewX(-30) translate(0,-" + h + ")")
              .attr("class", function(d) { return "dwpt sounding member rollover"+k })
              .attr("clip-path", "url(#clipper)")
              .attr("d", line2(parsedCSV));

    }

    function drawBarbs() {
    	// Draw wind barb stems
      	barbgroup.selectAll("barbs")
        	.data(barbs)
       	.enter().append("line")
         	.attr("x1", 0)
         	.attr("x2", 0)
         	.attr("y1", 0)
         	.attr("y2", barbsize)
         	.attr("transform", function(d,i) { return "translate("+w+","+y(d.press)+") rotate("+(d.wdir+180)+")"; });

        // Draw wind barb flags and pennants for each stem
    	barbs.forEach(function(d) {
    	    var px = barbsize;
    	    // Draw flags on each barb
    	    for (i=0; i<d.flags; i++) {
         		 barbgroup.append("polyline")
         		 	.attr("points", "0,"+px+" -10,"+(px)+" 0,"+(px-4))
         		 	.attr("transform", "translate("+w+","+y(d.press)+") rotate("+(d.wdir+180)+")")
         		    .attr("class", "flag");
         		 px -= 7;
         		}

    	    // Draw pennants on each barb
    	    for (i=0; i<d.pennants; i++) {
        	    barbgroup.append("line")
         		    .attr("x1", 0)
         		    .attr("x2", -10)
         		    .attr("y1", px)
         		    .attr("y2", px+4)
         		    .attr("transform", "translate("+w+","+y(d.press)+") rotate("+(d.wdir+180)+")");
         		 px -= 3;
         		}

         	// Draw half-pennants on each barb
            for (i=0; i<d.halfpennants; i++) {
        	    barbgroup.append("line")
         		    .attr("x1", 0)
         		    .attr("x2", -5)
         		    .attr("y1", px)
         		    .attr("y2", px+2)
         		    .attr("transform", "translate("+w+","+y(d.press)+") rotate("+(d.wdir+180)+")");
         		px -= 3;
         		}
        });
    }
    function drawToolTips() {
      // Draw T/Td tooltips
      var focus = svg.append("g").attr("class", "focus tmpc").style("display", "none");
      focus.append("circle").attr("r", 4);
      focus.append("text").attr("x", 9).attr("dy", ".35em");

      var focus2 = svg.append("g").attr("class", "focus dwpc").style("display", "none");
      focus2.append("circle").attr("r", 4);
      focus2.append("text").attr("x", -9).attr("text-anchor", "end").attr("dy", ".35em");

      var focus3 = svg.append("g").attr("class", "focus").style("display", "none");
      focus3.append("text").attr("x", 0).attr("text-anchor", "start").attr("dy", ".35em");
      svg.append("rect")
          .attr("class", "overlay")
          .attr("width", w)
          .attr("height", h)
          .on("mouseover", function() { focus.style("display", null); focus2.style("display", null); focus3.style("display", null);})
          .on("mouseout", function() { focus.style("display", "none"); focus2.style("display", "none"); focus3.style("display", "none");})
          .on("mousemove", mousemove);

      function mousemove() {
          var y0 = y.invert(d3.mouse(this)[1]); // get y value of mouse pointer in pressure space
    	  var i = bisectTemp(parsedCSVreversed, y0, 1, parsedCSVreversed.length-1);
          var d0 = parsedCSVreversed[i - 1];
          var d1 = parsedCSVreversed[i];
          var d = y0 - d0.press > d1.press - y0 ? d1 : d0;
          focus.attr("transform", "translate(" + (x(d.temp) + (y(basep)-y(d.press))/tan)+ "," + y(d.press) + ")");
          focus2.attr("transform", "translate(" + (x(d.dwpt) + (y(basep)-y(d.press))/tan)+ "," + y(d.press) + ")");
          focus3.attr("transform", "translate(0," + y(d.press) + ")");
          focus.select("text").text(Math.round(d.temp)+"°C");
          focus2.select("text").text(Math.round(d.dwpt)+"°C");
          focus3.select("text").text("--"+(Math.round(d.hghtagl/100)/10)+"km");
      }
    }
    function drawBackground() {

    var svghodo = d3.select("div#hodobox svg g").append("g").attr("class", "hodobg");
    var svg = d3.select("div#mainbox svg g").append("g").attr("class", "skewtbg");

    var dryline = d3.svg.line()
        .interpolate("linear")
        .x(function(d,i) { return x( ( 273.15 + d ) / Math.pow( (1000/pp[i]), 0.286) -273.15) + (y(basep)-y(pp[i]))/tan;})
        .y(function(d,i) { return y(pp[i])} );

    // Add clipping path
      svg.append("clipPath")
        .attr("id", "clipper")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", w)
        .attr("height", h);

    // Skewed temperature lines
      svg.selectAll("gline")
        .data(d3.range(-100,45,10))
       .enter().append("line")
         .attr("x1", function(d) { return x(d)-0.5 + (y(basep)-y(100))/tan; })
         //.attr("x1", function(d) { return x(d)-0.5; })
         .attr("x2", function(d) { return x(d)-0.5; })
         .attr("y1", 0)
         .attr("y2", h)
         .attr("class", function(d) { if (d == 0) { return "tempzero"; } else { return "gridline"}})
         .attr("clip-path", "url(#clipper)");
         //.attr("transform", "translate(0," + h + ") skewX(-30)");

    // Logarithmic pressure lines
     	svg.selectAll("gline2")
        	.data(plines)
       	.enter().append("line")
         	.attr("x1", 0)
         	.attr("x2", w)
         	.attr("y1", function(d) { return y(d); })
         	.attr("y2", function(d) { return y(d); })
         	.attr("class", "gridline");

    // create array to plot dry adiabats
    var pp = d3.range(topp,basep+1,10);
    var dryad = d3.range(-30,240,20);
    var all = [];
    for (i=0; i<dryad.length; i++) {
        var z = [];
        for (j=0; j<pp.length; j++) { z.push(dryad[i]); }
        all.push(z);
    }

    // Draw dry adiabats
    svg.selectAll(".dryline")
        .data(all)
    .enter().append("path")
        .attr("class", "gridline")
        .attr("clip-path", "url(#clipper)")
        .attr("d", dryline);

    // Line along right edge of plot
      svg.append("line")
         .attr("x1", w-0.5)
         .attr("x2", w-0.5)
         .attr("y1", 0)
         .attr("y2", h)
          .style("stroke", "#aaa")
         .attr("stroke-width", "0.75px");

        // draw hodograph background
       svghodo.selectAll(".circles")
           .data(d3.range(10,100,10))
        .enter().append("circle")
           .attr("cx", 150)
           .attr("cy", 150)
           .attr("r", function(d) { return r(d); })
           .attr("class", "gridline");

           	// Add axes
        svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + (h-0.5) + ")")
        .call(xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", w)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text('Temperature');

        svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(0,0)")
        .call(yAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text('Log Pressure');

        svg.append("g").attr("class", "y axis ticks").attr("transform", "translate(0,0)").call(yAxis2);
    }
}
