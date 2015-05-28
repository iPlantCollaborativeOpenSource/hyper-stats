var GraphCPU = React.createClass({
  mixins : [GraphMixin, GraphRender],
  getInitialState: function() {
    return { 
        query: "*.*.*b.cpu",
        data: [],
        transform: "derivative"
    };
  }, 
});
