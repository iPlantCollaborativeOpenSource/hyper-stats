var App = React.createClass({
  getInitialState: function() {
    return {
       graph_type:"net",
       points: 50,
    };
  },
  handleClick : function(e) {
      var that = this;
      ["cpu", "mem", "net"].some(function(graph) {
          // ex. target.id is cpuButton
          var found = e.target.id.contains(graph);
          if (found) that.setState({ graph_type : graph });
          return found;
      })
  },
  render: function() {
    return (
        <div>
            <Graph points={ this.state.points } type={ this.state.graph_type } />
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
