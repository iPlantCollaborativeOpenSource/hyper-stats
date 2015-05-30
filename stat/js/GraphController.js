var GraphController = function(config) {
    this.container = config.container;
    this.active = {
        type: config.type || "",
        uuid: config.uuid
    };
    this.resolution = config.resolution;
    this.points = config.points;
    this.store = new Store();
}
GraphController.prototype.hide = function() {
    var durp = this.store.get(this.active)
    durp && durp.hide();
}
GraphController.prototype.switch = function(uuid, type, forceCreate) {
    var me = this;
    var key = { type: type, uuid: uuid };
    var graph = this.store.get(key)
    if (graph && !forceCreate) {
        console.log("NoMAK")
        this.hide();
        graph.show();
        me.active.type = type;
        me.active.uuid = uuid;
    } else {
        console.log("MAK")
        var g = this.makeGraph({ 
            type: type, 
            uuid: uuid,
            container: this.container,
            resolution: this.resolution,
            points: this.points
        })
        var active = me.active.type
        g.create(function() {
            console.log("AC", active)
            active && me.hide();
            g.show();
            me.store.set(key, g);
            me.active.type = type;
            me.active.uuid = uuid;
        })
    }
}
GraphController.prototype.type = function() {
    return this.active.type;
}
GraphController.prototype.refresh = function() {
    this.switch(this.active.uuid, this.active.type, true);
}
GraphController.prototype.makeGraph = function(settings) {
    switch (settings.type) {
        case "cpu" : 
            return new CPUGraph(settings)
        case "mem" : 
            return new MemoryGraph(settings)
        case "net" : 
            return new NetworkGraph(settings)
    }
}
