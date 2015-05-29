var App = React.createClass({
  getInitialState: function() {
    return {
       graph: null,
    };
  },
  componentDidMount: function() {
      var me = this;
      this.setState({ 
          graph: new GraphController(document.querySelector("#graph-container")) 
      }, function() {
          me.state.graph.switch("cpu")
      })
  },
  handleClick : function(e) {
      var me = this;
      var things = ["cpu", "mem", "net"];
      things.some(function(type) {
          // ex. target.id is cpuButton
          var found = e.target.id.contains(type);
          return found && me.state.graph.switch(type);
      })
  },
  render: function() {
    //><Graph points={ this.state.points } type={ this.state.graph_type }>
    return (
        <div>
            <div points={ this.state.points } id="graph-container"></div>
            <div id="controls">
              <button id="cpuButton" onClick={ this.handleClick }>cpu</button>
              <button id="memButton" onClick={ this.handleClick }>memory</button>
              <button id="netButton" onClick={ this.handleClick }>network</button>
            </div>
      </div>
    );
  }
});


React.render(
  <App />,
  document.getElementById('app')
);
