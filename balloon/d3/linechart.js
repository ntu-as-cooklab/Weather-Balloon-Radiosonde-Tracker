/*
var res = {
        data: data, // [[array][array]] array=[x, y]
        filename: fname, //string array
        xAxisName: 'xxxxx',
        yAxisName: 'yyyyy',
        xMax: 0,
        yMax: 0,
        xMin: 1000,
        yMin: 1000,
        target: 'graph', // #ID
        W: 800,
        H: 400,
        xTickVal: [],
        yTickVal: []
    }
*/
function linechart(res){
    var data = res.data;
    var filename = res.filename;
    var xAxisName = res.xAxisName;
    var yAxisName = res.yAxisName;
    var xMax = res.xMax;
    var yMax = res.yMax;
    var xMin = res.xMin;
    var yMin = res.yMin;
    var target = res.target;
    var W = res.W, H = res.H;
    var xTickVal = res.xTickVal;
    var yTickVal = res.yTickVal;

    for(var i in data){
        var _data = d3.zip.apply( null, data[i])
        var _x = d3.max(_data[0]);
        var _y = d3.max(_data[1]);
        xMax = (xMax > _x) ? xMax: _x;
        yMax = (yMax > _y) ? yMax: _y;
        _x = d3.min(_data[0]);
        _y = d3.min(_data[1]);
        xMin = (xMin < _x) ? xMin: _x;
        yMin = (yMin < _y) ? yMin: _y;
    }

    var bandPos = [-1, -1];
    var pos;

    var color = d3.scale.ordinal()
            .range(['rgb(255, 0, 0)','rgb(51, 204, 51','rgb(0, 153, 255)','rgb(255, 255, 0)',
            'rgb(204, 0, 153)','rgb(51, 51, 0)','rgb(255, 0, 102)','rgb(200, 200, 200)','rgb(0, 51, 102)',
            'rgb(255, 153, 255)']);

    var margin = {
      top: 40,
      right: 40,
      bottom: 50,
      left: 60
    }
    var width = W - margin.left - margin.right;
    var height = H - margin.top - margin.bottom;
    var zoomArea = {
      x1: xMin,
      y1: yMin,
      x2: xMax,
      y2: yMax
    };
    var drag = d3.behavior.drag();

    var x = d3.scale.linear()
      .range([0, width]).domain([xMin, xMax]);

    var y = d3.scale.linear()
      .range([height, 0]).domain([yMin, yMax]);

    var xAxis = d3.svg.axis() // origin axis
        .scale(x)
        .orient("bottom")
        .tickValues(xTickVal);

    var _xAxis = d3.svg.axis() // zoom axis
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis() // orgin axis
        .scale(y)
        .orient("left")
        .tickValues(yTickVal);

    var _yAxis = d3.svg.axis() // zoom axis
        .scale(y)
        .orient("left");

    var x_grid = d3.svg.axis() // origin grid
        .scale(x)
        .orient("bottom")
        .tickValues(xTickVal)
        .tickSize(-height)
        .tickFormat("") ;

    var _x_grid = d3.svg.axis() // zoom grid
        .scale(x)
        .orient("bottom")
        .tickSize(-height)
        .tickFormat("") ;

    var y_grid = d3.svg.axis() // origin axis
        .scale(y)
        .orient("left")
        .tickValues(yTickVal)
        .tickSize(-width)
        .tickFormat("") ;

    var _y_grid = d3.svg.axis() // zoom axis
        .scale(y)
        .orient("left")
        .tickSize(-width)
        .tickFormat("") ;

    var svg = d3.select("#"+target).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x grid")
        .attr("transform", "translate(0," + height + ")")
        .call(x_grid) ;

    svg.append("g")
        .attr("class", "y grid")
        .call(y_grid) ;

    var line = d3.svg.line()
      .interpolate("basis")
      .x(function(d) {
        return x(d[0]);
      })
      .y(function(d) {
        return y(d[1]);
      });

    var band = svg.append("rect")
      .attr("width", 0)
      .attr("height", 0)
      .attr("x", 0)
      .attr("y", 0)
      .attr("class", "band"+target);

    svg.append("g")
        .attr("class", "x axis")
        .call(xAxis)
        .attr("transform", "translate(0," + height + ")")
        .append("text")
       .attr("class", "label")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(xAxisName);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
      .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text(yAxisName);

    svg.append("clipPath")
      .attr("id", "clip_"+target)
      .append("rect")
      .attr("width", width)
      .attr("height", height);

    for (idx in data) {
      svg.append("path")
        .datum(data[idx])
        .attr("class", "line line" + idx)
        .attr("clip-path", "url(#clip_"+target+")")
        .style("stroke", color(idx))
        .attr("d", line);
    }

    var zoomOverlay = svg.append("rect")
      .attr("width", width - 10)
      .attr("height", height)
      .attr("class", "zoomOverlay")
      .call(drag);

    var zoomout = svg.append("g");

    zoomout.append("rect")
      .attr("class", "zoomOut")
      .attr("width", 75)
      .attr("height", 40)
      .attr("x", -12)
      .attr("y", height + (margin.bottom - 20))
      .on("click", function() {
        zoomOut();
      });

    zoomout.append("text")
      .attr("class", "zoomOutText")
      .attr("width", 75)
      .attr("height", 30)
      .attr("x", -10)
      .attr("y", height + (margin.bottom - 5))
      .text("Zoom Out");

    zoom();

    drag.on("dragend", function() {
      var pos = d3.mouse(this);
      var x1 = x.invert(bandPos[0]);
      var x2 = x.invert(pos[0]);

      if (x1 < x2) {
        zoomArea.x1 = x1;
        zoomArea.x2 = x2;
      } else {
        zoomArea.x1 = x2;
        zoomArea.x2 = x1;
      }

      var y1 = y.invert(pos[1]);
      var y2 = y.invert(bandPos[1]);

      if (x1 < x2) {
        zoomArea.y1 = y1;
        zoomArea.y2 = y2;
      } else {
        zoomArea.y1 = y2;
        zoomArea.y2 = y1;
      }

      bandPos = [-1, -1];

      d3.select(".band"+target).transition()
        .attr("width", 0)
        .attr("height", 0)
        .attr("x", bandPos[0])
        .attr("y", bandPos[1]);

      zoom();
    });

    drag.on("drag", function() {

      var pos = d3.mouse(this);

      if (pos[0] < bandPos[0]) {
        d3.select(".band"+target).
        attr("transform", "translate(" + (pos[0]) + "," + bandPos[1] + ")");
      }
      if (pos[1] < bandPos[1]) {
        d3.select(".band"+target).
        attr("transform", "translate(" + (pos[0]) + "," + pos[1] + ")");
      }
      if (pos[1] < bandPos[1] && pos[0] > bandPos[0]) {
        d3.select(".band"+target).
        attr("transform", "translate(" + (bandPos[0]) + "," + pos[1] + ")");
      }

      //set new position of band when user initializes drag
      if (bandPos[0] == -1) {
        bandPos = pos;
        d3.select(".band"+target).attr("transform", "translate(" + bandPos[0] + "," + bandPos[1] + ")");
      }

      d3.select(".band"+target).transition().duration(1)
        .attr("width", Math.abs(bandPos[0] - pos[0]))
        .attr("height", Math.abs(bandPos[1] - pos[1]));
    });

    function zoom() {
      //recalculate domains
      if (zoomArea.x1 > zoomArea.x2) {
        x.domain([zoomArea.x2, zoomArea.x1]);
      } else {
        x.domain([zoomArea.x1, zoomArea.x2]);
      }

      if (zoomArea.y1 > zoomArea.y2) {
        y.domain([zoomArea.y2, zoomArea.y1]);
      } else {
        y.domain([zoomArea.y1, zoomArea.y2]);
      }

      //update axis and redraw lines
      var t = svg.transition().duration(750);
      t.select(".x.axis").call(_xAxis);
      t.select(".y.axis").call(_yAxis);
      t.select(".x.grid").call(_x_grid);
      t.select(".y.grid").call(_y_grid);
      t.selectAll(".line").attr("d", line);
    }

    var zoomOut = function() {
      x.domain([xMin, xMax]);
      y.domain([yMin, yMax]);

      var t = svg.transition().duration(750);
      t.select(".x.axis").call(xAxis);
      t.select(".y.axis").call(yAxis);
      t.select(".x.grid").call(x_grid);
      t.select(".y.grid").call(y_grid);
      t.selectAll(".line").attr("d", line);
    }

    var legend = svg.append("g")
        .attr("class", "legend")
        .attr('transform', 'translate(0,10)') ;

    legend.selectAll('rect')
      .data(filename)
      .enter()
      .append("rect")
	  .attr("x", width - 20)
      .attr("y", function(d, i){ return i *  20;})
	  .attr("width", 10)
	  .attr("height", 10)
	  .style("fill", function(_, i) {return color(i);});

    legend.selectAll('text')
      .data(filename)
      .enter()
      .append("text")
	  .attr("x", width - 25)
      .style("text-anchor", "end")
      .attr("y", function(d, i){ return i *  20 + 9;})
	  .text(function(d,i) {
        return d;
      });
}
