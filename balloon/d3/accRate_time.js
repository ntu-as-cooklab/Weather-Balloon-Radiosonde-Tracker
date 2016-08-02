function draw_accRate_time(){
    var margin = {top: 20, right: 50, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 400 - margin.top - margin.bottom;

    var x = d3.scale.linear()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);
    
    var x_grid = d3.svg.axis()
                    .scale(x)
                    .orient("bottom")
                    .tickSize(-height)
                    .tickFormat("") ;

                var y_grid = d3.svg.axis()
                    .scale(y)
                    .orient("left") 
                    .tickSize(-width)
                    .tickFormat("") ;

   var color = d3.scale.ordinal()
            .range(['rgb(255, 0, 0)','rgb(51, 204, 51','rgb(0, 153, 255)','rgb(255, 255, 0)','rgb(204, 0, 153)','rgb(51, 51, 0)','rgb(255, 0, 102)','rgb(200, 200, 200)','rgb(0, 51, 102)','rgb(255, 153, 255)']);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");
    $("#accRate_time").empty();
    var svg = d3.select("#accRate_time").append("svg")
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

    d3.tsv("data/accRate_time_data.tsv", function(error, data) {
      if (error) throw error;

      data.forEach(function(d) {
        d.rate = +d.rate;
        d.time = +d.time;
      });

      x.domain(d3.extent(data, function(d) { return d.time; }));
      y.domain(d3.extent(data, function(d) { return d.rate; }));

      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text("Sepal Width (cm)");

      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text("Sepal Length (cm)")

      svg.selectAll(".dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", function(d) { return x(d.time); })
          .attr("cy", function(d) { return y(d.rate); })
          .style("fill", function(d) { return color(d.name); });

      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; })
          .style("fill", color);

    });
}