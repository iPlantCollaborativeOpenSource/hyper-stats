var NetworkGraph = function(el) {
    Graph.call(this, el, {
      upper : {
        query: "*.*.*b.rx",
        data: [],
        transform: "derivative",
      },
      lower : {
        query: "*.*.*b.tx",
        data: [],
        transform: "derivative",
      }
    });
};

NetworkGraph.prototype = Object.create(Graph.prototype);
NetworkGraph.prototype.constructor = NetworkGraph;

NetworkGraph.prototype.fetch = function(cb) {
    var me = this;
    var series = [ this.upper, this.lower ];

    var queries = series.map(function(s) { 
      if (s.transform == "derivative") {
        return "perSecond(" + s.query + ")"
      }
      return s.query;
    });

    fetch(me.points, me.resolution, queries[0], function(err, data) {
      series[0].data = data;
      fetch(me.points, me.resolution, queries[1], function(err, data) {
        series[1].data = data;
        cb.call(me);
      }) 
    }) 
}

NetworkGraph.prototype.make = function() {
      var me = this;
      var graphDom = me.element;
      var data = me.lower.data;
      var rxData = me.upper.data;
      var txData = me.lower.data;
        
      var yAxisWidth = 50,
          margin = {top: 10, right: 20, bottom: 30, left: yAxisWidth},
          width = this.width - margin.left - margin.right,
          height = this.height - margin.top - margin.bottom;

      var getX = get("x"); 
      var getY = get("y"); 

      var yMax = d3.max([ d3.max(rxData, getY)
                        , d3.max(txData, getY)
                       , 1.2 * 1024]);
      var yMeanUpper = d3.max([ d3.mean(rxData, getY)
                       , d3.mean(rxData, getY)]);
      var yMeanLower = d3.max([ d3.mean(txData, getY)
                       , d3.mean(txData, getY)]);


      var xMax = d3.max(data, getX);
      var xMin = d3.min(data, getX);

      var x = d3.scale.linear()
          .range([0, width])
          .domain(d3.extent(data, getX));

      var y = d3.scale.linear()
          .range([height, 0])
          .domain([-yMax, yMax]);

      var line = d3.svg.line()
          //.interpolate("basis")
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });

      var area = d3.svg.area()
          //.interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y0(height/2)
        .y1(function(d) { return y(d.y); });

      var lineReflect = d3.svg.line()
          //.interpolate("basis")
          .x(function(d) { return x(d.x); })
          .y(function(d) { return - y(d.y); });

      var areaReflect = d3.svg.area()
          //.interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y0(height/2)//
        .y1(function(d) { return -y(d.y) + height; })

      var svg = d3.select(graphDom).append("svg")
            .attr("width", me.width)
            .attr("height", me.height)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("path")
        .datum([
            { x: xMin, y: yMeanUpper },
            { x: xMax, y: yMeanUpper }
        ])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "mean line")
        .attr("d", line)

      svg.append("path")
        .datum([
            { x: xMin, y: -yMeanLower },
            { x: xMax, y: -yMeanLower }
        ])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "mean line")
        .attr("d", line)

      svg.append("path")
        .datum(rxData)
        .attr("class", "rx area")
        .attr("d", area);

      svg.append("path")
        .datum(rxData)
        .attr("class", "rx line")
        .attr("d", line);

      svg.append("path")
        .datum(txData)
        .attr("class", "tx area")
        .attr("d", areaReflect);

      svg.append("path")
        .datum(txData)
        .attr("class", "tx line")
        .attr("d", lineReflect)
        .attr("transform", "translate(0," + height + ")")

     
      var yTick = Math.max(1024, 0.6 * yMax)
      var yAxis = d3.svg.axis()
          .tickFormat(function(d){ 
              return bytesToString(Math.abs(d)); 
          })
          .tickValues([ -yTick, yTick, yMeanUpper, -yMeanLower])
          .scale(y)
          .orient("left");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      // var xAxis = d3.svg.axis()
      //     .tickFormat(secondsToString)
      //     .tickValues([x.ticks(4)[0]])
      //     .scale(x)
      //     .orient("bottom");

      svg.append("text")
        .attr("class", "x axis")
        .attr("style", "text-anchor:middle")
        .attr("transform", "translate(" + (0.5 * width) + "," + (height + margin.top + 15) +  ")")
        .text(secondsToString(data[0].x))


}
