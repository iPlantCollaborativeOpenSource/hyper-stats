var GraphMemory = React.createClass({
  mixins : [GraphMixin, GraphRender],
  getInitialState: function() {
    return { 
        query: "*.*.*b.mem",
        data: [],
        transform: "total"
    };
  }, 
});
