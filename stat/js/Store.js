var Store = function(config) {
    var data = config || {};

    this.has = function(key) {
        return data[key] != undefined;
    }
    this.get = function(key) {
        return data[key];
    }
    this.set = function(key, obj) {
        data[key] = obj;
    }
}
