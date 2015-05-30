var Store = function() {
    var data = {};
    glob = data;

    this.has = function(key) {
        return data[JSON.stringify(key)] != undefined;
    }
    this.get = function(key) {
        return data[JSON.stringify(key)];
    }
    this.set = function(key, obj) {
        data[JSON.stringify(key)] = obj;
    }
    this.remove = function(key) {
        delete data[JSON.stringify(key)];
    }
}
