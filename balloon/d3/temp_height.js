function draw_temp_height(){
    var data = temp_height_data;

    var xy_chart = d3_xy_chart()
        .width(800)
        .height(800)
        .ylabel("meter(s)")
        .xlabel("deg C") ;
    $("#temp_height").empty();
    var svg = d3.select("#temp_height").append("svg")
        .datum(data)
        .call(xy_chart) ;

    function d3_xy_chart() {
        var width,  height, xlabel, ylabel;
        
        function chart(selection) {
            selection.each(function(datasets) {
                //
                // Create the plot. 
                //
                var margin = {top: 20, right: 50, bottom: 30, left: 50}, 
                    innerwidth = width - margin.left - margin.right,
                    innerheight = height - margin.top - margin.bottom ;
                
                var x_scale = d3.scale.linear()
                    .range([0, innerwidth])
                    .domain([ d3.min(datasets, function(d) { return d3.min(d.x); }), 
                              d3.max(datasets, function(d) { return d3.max(d.x); }) ]) ;
                
                var y_scale = d3.scale.linear()
                    .range([innerheight, 0])
                    .domain([ d3.min(datasets, function(d) { return d3.min(d.y); }),
                              d3.max(datasets, function(d) { return d3.max(d.y); }) ]) ;

                var color = d3.scale.ordinal()
            .range(['rgb(255, 0, 0)','rgb(51, 204, 51','rgb(0, 153, 255)','rgb(255, 255, 0)','rgb(204, 0, 153)','rgb(51, 51, 0)','rgb(255, 0, 102)','rgb(200, 200, 200)','rgb(0, 51, 102)','rgb(255, 153, 255)']);


                var x_axis = d3.svg.axis()
                    .scale(x_scale)
                    .orient("bottom") ;

                var y_axis = d3.svg.axis()
                    .scale(y_scale)
                    .orient("left") ;

                var x_grid = d3.svg.axis()
                    .scale(x_scale)
                    .orient("bottom")
                    .tickSize(-innerheight)
                    .tickFormat("") ;

                var y_grid = d3.svg.axis()
                    .scale(y_scale)
                    .orient("left") 
                    .tickSize(-innerwidth)
                    .tickFormat("") ;

                var draw_line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) { return x_scale(d[0]); })
                    .y(function(d) { return y_scale(d[1]); }) ;

                var svg = d3.select(this)
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")") ;
                
                svg.append("g")
                    .attr("class", "x grid")
                    .attr("transform", "translate(0," + innerheight + ")")
                    .call(x_grid) ;

                svg.append("g")
                    .attr("class", "y grid")
                    .call(y_grid) ;

                svg.append("g")
                    .attr("class", "x axis")
                    .attr("transform", "translate(0," + innerheight + ")") 
                    .call(x_axis)
                    .append("text")
                    .attr("dy", "-.71em")
                    .attr("x", innerwidth)
                    .style("text-anchor", "end")
                    .text(xlabel) ;
                
                svg.append("g")
                    .attr("class", "y axis")
                    .call(y_axis)
                    .append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 6)
                    .attr("dy", "0.71em")
                    .style("text-anchor", "end")
                    .text(ylabel) ;

                var data_lines = svg.selectAll(".d3_xy_chart_line")
                    .data(datasets.map(function(d) {return d3.zip(d.x, d.y);}))
                    .enter().append("g")
                    .attr("class", "d3_xy_chart_line") ;
                
                data_lines.append("path")
                    .attr("class", "line")
                    .attr("d", function(d) {return draw_line(d); })
                    .attr("stroke", function(_, i) {return color(i);}) ;
                
                data_lines.append("text")
                    .datum(function(d, i) { return {name: datasets[i].label, final: [innerwidth-67, 10+15*i] };}) //legend
                    .attr("transform", function(d) { 
                          return ( "translate(" + d.final[0] + "," + 
                                   d.final[1] + ")" ) ; })
                    .attr("x", -100)
                    .attr("dy", "0.5em")
                    .attr("fill", function(_, i) { return color(i); })
                    .text(function(d) { return d.name; }) ;
            }) ;
        }

        chart.width = function(value) {
            if (!arguments.length) return width;
            width = value;
            return chart;
        };

        chart.height = function(value) {
            if (!arguments.length) return height;
            height = value;
            return chart;
        };

        chart.xlabel = function(value) {
            if(!arguments.length) return xlabel ;
            xlabel = value ;
            return chart ;
        } ;

        chart.ylabel = function(value) {
            if(!arguments.length) return ylabel ;
            ylabel = value ;
            return chart ;
        } ;

        return chart;
    }
}