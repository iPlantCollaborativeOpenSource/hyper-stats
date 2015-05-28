var shouldComponentUpdate = function() {
  var me = this;

  this.update(function() { 
    me.clear();
    me.redraw();
  })

  return false; 
}
var clear = function() {
  var graph = this.getDOMNode();

  while (graph.lastChild) {
   graph.removeChild(graph.lastChild);
  } 
}
var componentDidMount = function() {
  this.update(this.redraw)
}

var GraphMixin = {
  componentDidMount:componentDidMount,
  shouldComponentUpdate: shouldComponentUpdate,
  clear: clear,
  update: function(cb) {
    var me = this;
    var query = this.state.query;

    if (this.state.transform == "derivative") {
      query = "perSecond(" + query + ")"
    }

    fetch(this.props.points, query, function(err, data) {
      me.state.data = data;
      cb();
    }) 
  },
  redraw: function() {
      var me = this;
      var data = me.state.data
        
      var yAxisWidth = 50,
          margin = {top: 10, right: 0, bottom: 10, left: yAxisWidth},
          width = this.props.width - margin.left - margin.right,
          height = this.props.height - margin.top - margin.bottom;

      var get = function(name) { 
        return function(obj) {
          return obj[name];
        }
      }

      getX = get("x"); 
      getY = get("y"); 

      var max = d3.max(data, getY) * 1.2
      
      var graphDom = me.getDOMNode();

      var x = d3.time.scale()
          .range([0, width])
          .domain(d3.extent(data,getX));

      var y = d3.scale.linear()
          .range([height, 0])
          .domain([0, max]);

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
            .attr("width", me.props.width)
            .attr("height", me.props.height)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.append("path")
        .datum(data)
        .attr("class", "rx area")
        .attr("d", area)

      svg.append("path")
        .datum(data)
        .attr("class", "rx line")
        .attr("d", line)

      // var svg = d3.select(yAxisDom).append("svg")
      //     .attr("width", yAxisWidth)
      //     .attr("height", me.props.height)

      var yAxis = d3.svg.axis()
          .tickFormat(function(d){ 
            if (d == 0) {
              return "";
            }
            return 100 * Math.abs(d) + "%"; 
          })
          .ticks(2)
          .scale(y)
          .orient("left");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
  },
};

var GraphRender = {
  render: function() {
    return ( 
        <div id="graph"></div>
    )
  }
}
