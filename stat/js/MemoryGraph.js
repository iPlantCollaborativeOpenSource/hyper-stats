var MemoryGraph = function(el) {
    Graph.call(this, el, { 
        query: "*.*.*b.mem",
        transform: "total"
    });
};

MemoryGraph.prototype = Object.create(Graph.prototype);
MemoryGraph.prototype.constructor = MemoryGraph;
