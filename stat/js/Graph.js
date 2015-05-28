var Graph = React.createClass({
  render: function() {

    var props = {
      points: this.props.points,
      width: 680,
      height: 250,
    }

    switch (this.props.type) {
      case "cpu":
        return React.createElement(GraphCPU, props);
      case "mem":
        return React.createElement(GraphMemory, props);
      case "net":
        return React.createElement(GraphNetwork, props);
    }
  }
});
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
