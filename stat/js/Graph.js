var ReactGraph = React.createClass({
  render: function() {
      return (
          <div id="graph"></div>
      )
  }
})

var Graph = function(config) {
    config = config || {};

    var defaults = {
        points: 50,
        resolution: 2, // minutes per point
        transform: "total",
        data: [],
        width: 730,
        height: 250
    }

    for (prop in config) {
        this[prop] = config[prop];
    }
    for (prop in defaults) {
        if (config[prop] == undefined) {
            this[prop] = defaults[prop];
        }
    }

    //this.container = config.container;
    this.element = document.createElement("div");
    this.element.style.display = "none";
    this.container.appendChild(this.element);
}

Graph.prototype = {};

Graph.prototype.create = function(cb) {
    var me = this;
    this.fetch(function(){ 
        me.make()
        cb();
    });
}
Graph.prototype.hide = function() {
    console.log("HIDE", this.type)
    this.element.style.display = "none";
}
Graph.prototype.show = function() {
    console.log("SHOW", this.type)
    this.element.style.display = "inline";
}
Graph.prototype.clear = function() {
    var g = this.element;
    while (g.lastChild) {
        g.removeChild(g.lastChild);
    } 
}
Graph.prototype.fetch = function(cb) {
    var me = this;
    var query = "*.*." + this.uuid + "." + this.type

    if (this.transform == "derivative") {
      query = "perSecond(" + query + ")"
    }

    fetch(this.points, this.resolution, query, function(err, data) {
      me.data = data;
      cb && cb()
    }) 
}
Graph.prototype.make = function() {
      var me = this;
      var data = this.data
      var graphDom = this.element;
        
      var yAxisWidth = 50,
          margin = {top: 10, right: 20, bottom: 30, left: yAxisWidth},
          width = this.width - margin.left - margin.right,
          height = this.height - margin.top - margin.bottom;

      getX = get("x"); 
      getY = get("y"); 

      var yMax = d3.max(data, getY) || 0;
      var yMean = d3.mean(data, getY) || 0;
      var xMax = d3.max(data, getX);
      var xMin = d3.min(data, getX);
      
      var x = d3.scale.linear()
          .range([0, width])
          .domain(d3.extent(data, getX));

      var y = d3.scale.linear()
          .range([height, 0])
          .domain([0, yMax * 1.2]);

      var line = d3.svg.line()
          //.interpolate("basis")
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });

      var area = d3.svg.area()
          //.interpolate("basis")
        .x(function(d) { return x(d.x); })
        .y0(height)
        .y1(function(d) { return y(d.y); });

      var svg = d3.select(graphDom).append("svg")
            .attr("width", me.width)
            .attr("height", me.height)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("path")
        .datum([
            { x: xMin, y: yMean },
            { x: xMax, y: yMean }
        ])
        .style("stroke-dasharray", ("3, 3"))
        .attr("class", "mean line")
        .attr("d", line)

      svg.append("path")
        .datum(data)
        .attr("class", "rx area")
        .attr("d", area)

      svg.append("path")
        .datum(data)
        .attr("class", "rx line")
        .attr("d", line)

      var yAxis = d3.svg.axis()
          .tickFormat(d3.format(".0%"))
          .tickValues([yMean, yMax])
          .scale(y)
          .orient("left");

//       var xAxis = d3.svg.axis()
//           .tickFormat(function(d, i) {
//               if (i == 0)
//                   return secondsToString(d)
//               return "now"
//           })
//           .tickValues([xMax - (0.8 * (xMax - xMin)), xMax])
//           .scale(x)
//           .orient("bottom");

//       svg.append("g")
//         .attr("class", "x axis")
//         .attr("transform", "translate(0," + ( height ) + ")")
//         .call(xAxis)

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)

      svg.append("text")
        .attr("class", "x axis")
        .attr("style", "text-anchor:middle")
        .attr("transform", "translate(" + (0.5 * width) + "," + (height + margin.top + 15) +  ")")
        .text(secondsToString(data[0].x))
}
