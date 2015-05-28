var GraphNetworkMixin = {
  componentDidMount:componentDidMount,
  shouldComponentUpdate: shouldComponentUpdate,
  clear: clear,
  update: function(cb) {
    var me = this;
    var series = [ this.state.upper, this.state.lower ];

    var queries = series.map(function(s) { 
      if (s.transform == "derivative") {
        return "perSecond(" + s.query + ")"
      }
      return s.query;
    });

    fetch(me.props.points, queries[0], function(err, data) {
      series[0].data = data;
      fetch(me.props.points, queries[1], function(err, data) {
        series[1].data = data;
        cb.call(me);
      }) 
    }) 
  },
  redraw: function() {
      var me = this;
      var data = me.state.lower.data;
      //var data = me.state.upper.data;
      var rxData = me.state.upper.data;
      var txData = me.state.lower.data;
        
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

      var max = d3.max([ d3.max(rxData, getY)
                       , d3.max(txData, getY) ]);
      
      var graphDom = me.getDOMNode();

      var x = d3.time.scale()
          .range([0, width])
          .domain(d3.extent(data, getX));

      var y = d3.scale.linear()
          .range([height, 0])
          .domain([-max, max]);

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
            .attr("width", me.props.width)
            .attr("height", me.props.height)
          .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

      var yAxis = d3.svg.axis()
          .tickFormat(function(d, i){ 
            if (i == 2) {
              return bytesToString(d); 
            }
            return "";
          })
          .ticks(3)
          .scale(y)
          .orient("left");

      svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
  },
}
var GraphNetwork = React.createClass({
  mixins : [GraphRender, GraphNetworkMixin],
  getInitialState: function() {
    return {
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
    }
  }
})
