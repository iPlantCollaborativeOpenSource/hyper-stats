var CPUGraph = function(el) {
    Graph.call(this, el, { 
        query: "*.*.*b.cpu",
        transform: "derivative"
    });
};

CPUGraph.prototype = Object.create(Graph.prototype);
CPUGraph.prototype.constructor = CPUGraph;
