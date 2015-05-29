var GraphController = function(el) {
    this.container = el;
    this.active = "";
    this.store = new Store({
        "cpu" : CPUGraph,
        "mem" : MemoryGraph,
        "net" : NetworkGraph
    });
}
GraphController.prototype.hide = function(type) {
    if (!this.store.has(type)) return undefined;

    this.store.get(type).hide();
}
GraphController.prototype.switch = function(type) {
    var me = this;
    graph = this.store.get(type)
    if (typeof graph == "object") {
        this.hide(this.active); 
        graph.show();
    } else {
        var g = new graph(this.container)
        var active = me.active
        g.create(function() {
            active && me.hide(active); 
            g.show();
        })
        this.store.set(type, g);
    }
    this.active = type;
}
