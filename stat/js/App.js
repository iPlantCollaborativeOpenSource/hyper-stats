var App = React.createClass({
  getInitialState: function() {
    return {
       graph: null,
       uuid: "f81462ab-9819-4421-9f04-8443f1ff965e",
       uuids: [],
       points: 30,
       resolution: 1,
    };
  },
  componentDidMount: function() {
      var me = this;

      getAllUUIDS(function(data) {
        me.setState({ 
            uuids: data.sort(),
            graph: new GraphController({ 
                container: document.querySelector("#graph"),
                uuid: me.state.uuid,
                points: me.state.points,
                resolution: me.state.resolution
            }), 
        }, function() {
            me.state.graph.switch(me.state.uuid, "cpu")
        })
      })
  },
  handleClick : function(e) {
      var me = this;
      console.log("targ", e.target.id)
      if (e.target.id.contains("refresh")) {
          console.log("wot")
          me.state.graph.refresh()
          return;
      }
      ["cpu", "mem", "net"].some(function(type) {
          // ex. target.id is cpuButton
          var found = e.target.id.contains(type);
          return found && me.state.graph.switch(me.state.uuid, type);
      })
  },
  onSelect : function(e) {
    var me = this;
    this.setState({ uuid : e.target.value }, function() {
        me.state.graph.switch(me.state.uuid, me.state.graph.type())
    })
  },
  render: function() {
    var selectChildren = this.state.uuids.map(function(uuid){
          var props = {
              value : uuid
          }
          return React.DOM.option(props, uuid)
    })
    var children = [
        React.createElement(ReactGraph, {
            points: this.state.points,
            resolution: this.state.resolution
        }),
        React.DOM.div({
            id: "controls"
        }, 
        [
            React.DOM.button({
                id: "cpuButton",
                onClick: this.handleClick 
            }, "cpu"),
            React.DOM.button({
                id: "memButton",
                onClick: this.handleClick 
            }, "memory"),
            React.DOM.button({
                id: "netButton",
                onClick: this.handleClick 
            }, "network"),
            React.DOM.button({
                id: "refreshButton",
                onClick: this.handleClick 
            }, "refresh"),

            React.DOM.select({
                value: this.state.uuid,
                onChange: this.onSelect,
            }, selectChildren)
       ])
    ];
    return React.DOM.div(null, children)
  }
});


React.render(
  <App />,
  document.getElementById('app')
);

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
