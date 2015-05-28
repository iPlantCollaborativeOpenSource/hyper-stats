var Graph = React.createClass({
  render: function() {

    switch (this.props.type) {
      case "cpu":
          return (
                <GraphCPU data={ this.props.data }/>
          )

       case "mem":
          return (
                <GraphMemory data={ this.props.data }/>
          )

       case "net":
          return (
                <GraphNetwork data={ this.props.data }/>
          )
    }
  }
});

var GraphMixin = {
  shouldComponentUpdate: function() {
    this.update()
    return false; 
  },
  update: function(cb) {
    var that = this;
    var query = this.state.query;

    if (this.state.transform == "derivative") {
      query = "perSecond(" + query + ")"
    }

    fetch(SIZE, query, function(err, data) {
      if (cb) { 
        cb.call(that, data);
        return
      }
      that.state.graph.series[0].data = data;
      that.state.graph.render();
    }) 
    // var mm = minMax(this.props.data)
    // var min = mm.min;
    // var max = mm.max;

    // var logScale = d3.scale.log().domain([min/4, max]);
    // var linearScale = d3.scale.linear().domain([min, max]).range(logScale.range());

  }
};
var GraphRender = {
  render: function() {
    return ( 
        <div>
          <div id="y-axis"></div>
          <div id="graph"></div>
        </div>
    )
  }
}

var GraphOnMount = {
  componentDidMount: function(cb) {
    var graph = new Rickshaw.Graph( {
        element: this.getDOMNode().querySelector("#graph"),
        width: this.state.width || 680, 
        height: this.state.height || 250, 
        renderer: this.state.render || "line", 
        min: this.state.min || 0,
        series: [ { 
          color: this.state.color || 'steelblue', 
          data: []
        } ]  
    })
    var yaxis = this.getDOMNode().querySelector('#y-axis');
    
    if (yaxis.children.length) { 
        yaxis.removeChild(yaxis.querySelector('svg'));
    }

    new Rickshaw.Graph.Axis.Y( {
        graph: graph,
        orientation: 'left',
        width: 50,
        height: 250, 
        tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
        element: yaxis
    } );

    this.setState({ graph: graph  }, cb || this.update);
  }
}

var GraphCPU = React.createClass({
  mixins : [GraphMixin, GraphRender, GraphOnMount],
  getInitialState: function() {
    return { 
        graph: null,
        query: "*.*.*b.pcpu",
        min: "auto",
        data: [],
        transform: "derivative"
    };
  }, 
});

var GraphMemory = React.createClass({
  mixins : [GraphMixin, GraphRender, GraphOnMount],
  getInitialState: function() {
    return { 
        graph: null,
        query: "*.*.*b.pmem",
        renderer: "line",
        data: [],
        transform: "total"
    };
  }, 
});


var GraphNetworkMixin = {
  shouldComponentUpdate: function() {
    console.log("WOO")
    return false; 
  },
  componentDidMount: function() {
    var me = this;
    console.log("WOOa")
    GraphMixin.update.call(me, function(data) {
      var graphDom = me.getDOMNode().querySelector("#graph"),
          yAxisDom = me.getDOMNode().querySelector("#y-axis")

      var margin = {top: 0, right: 0, bottom: 0, left: 50},
          width = this.state.width - margin.left - margin.right,
          height = this.state.height - margin.top - margin.bottom;

      var x = d3.time.scale()
          .range([0, me.state.width]);

      var y = d3.scale.linear()
          .range([me.state.height, 0]);

      x.domain(d3.extent(data, function(d) { return d.x; }));
      y.domain([0, 2000])//minMax(data)[1]]);

      var line = d3.svg.line()
          .interpolate("basis")
          .x(function(d) { return x(d.x); })
          .y(function(d) { return y(d.y); });

      var svg = d3.select(graphDom).append("svg")
          .attr("width", me.state.width)
          .attr("height", me.state.height)

      if (this.state.inverse) {
          svg.attr("transform", "rotate(180) translate(" + -this.state.width + ", " + (- this.state.height - 0) + ")")
      } else {
          svg.attr("transform", "translate(0, 0)")
      }

      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

      var yAxisWidth = 50
      var svg = d3.select(yAxisDom).append("svg")
          .attr("width", yAxisWidth)
          .attr("height", me.state.height)

      if (this.state.inverse) {
          y.range([0, me.state.height])
      }
      var yAxis = d3.svg.axis()
          .ticks(4)
          .scale(y)
          .orient("left");

      svg.append("g")
        .attr("transform", "translate(" + yAxisWidth + ",0)")
        .attr("class", "y axis")
        .call(yAxis)

          
      // GraphOnMount.componentDidMount.call(me, function() {
      //   me.update(function() {
      //     var series = me.state.graph.series[0];
      //     console.log("woot", series.data)

      //     var mm = minMax(series.data);
      //     console.log("max: " + mm.max, "min: " + mm.min)
      //     //series.scale = d3.scale.linear().range([mm.max, mm.min]).nice();
      //     series.scale = d3.scale.linear().range([250, 0])//
      //     me.state.graph.render();
      //     graph = me.state.graph
      //   })
      // })
    })
  }
}


var GraphRx = React.createClass({
  mixins : [GraphRender, GraphNetworkMixin],
  getInitialState: function() {
    return { 
        graph: null,
        query: "*.*.*b.rx",
        data: [],
        transform: "derivative",
        height: 133,
        width: 680
    };
  },
})

var GraphTx = React.createClass({
  mixins : [GraphRender, GraphNetworkMixin],
  getInitialState: function() {
    return { 
        graph: null,
        query: "*.*.*b.tx",
        data: [],
        transform: "derivative",
        height: 133,
        inverse: true,
        width: 680
    };
  },
})
function minMax(data) {
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    for (i = 0; i < data.length; i++) {
        min = Math.min(min, data[i].y);
        max = Math.max(max, data[i].y);
    }
    return [ min, max ];
}


// var App = React.createClass({
//   getInitialState: function() {
//     return {
//        query:"stats.*.*b.pcpu",
//        transform:"derivative",
//        data:[]
//     };
//   },
//   componentDidMount: function() {
//     this.onInput({ target: { value: this.state.query }});
//   },
//   validate: function(query) {
//     return /stats\.(.*)\.(.*)\.(pcpu|pmem|mmem|state|tx|rx)$/.test(query)
//   },
//   onSelect : function(e) {
//     this.setState({ transform : e.target.value }, this.onUpdate)
//   },
//   onInput : function(e) {
//     if (this.validate(e.target.value)) {
//       this.setState({ query : e.target.value }, this.onUpdate);
//     }
//   },
//   onUpdate : function(settings) {
//     var that = this;
//     var metric;

//     if (this.state.transform == "derivative") {
//       metric = "perSecond(" + this.state.query + ")"
//     } else {
//       metric = this.state.query;
//     }

//     fetch(SIZE, metric, function(err, data) {
//       that.setState({ data : data }, that.forceUpdate);
//     })
//   }, 
//   render: function() {
//     return (
//         <div>
//             <Graph query={ this.state.query } data={ this.state.data }/>
//             <div id="controls">
//               <input onChange={ this.onInput } defaultValue={ this.state.query }></input>
//               <select onChange={ this.onSelect } value={ this.state.transform } >
//                 <option value="total">total</option>
//                 <option value="derivative">derivative</option>
//               </select> 
//             </div>
//       </div>
//     );
//   }
// });


var GraphNetwork = React.createClass({
  mixins : [GraphRender, GraphNetworkMixin],
  getInitialState: function() {
    return { 
        graph: null,
        queries: ["*.*.*b.rx","*.*.*b.tx"]
        data: [],
        transform: "derivative",
        height: 250,
        width: 680
    }
  }
});


