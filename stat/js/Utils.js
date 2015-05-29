var fetch = function(minutes, expression, callback) {
  // fetch(10,"perSecond(stats.*.*51.tx)", function(a,b){ console.log(a,b); }) 
      var now, then, step, host;
      host = "http://monarch.iplantc.org:8000";

      now = Date.now();
      then = (now / 1000) - minutes * 60  - 4 * 60 // add 4 minutes for extra room

      var req = host + "/render?format=json"
      + "&target=" + encodeURIComponent(expression)
      + "&from=" + Math.floor(then)

      d3.text(req, function(text) {
        if (!text) return callback(new Error("unable to load data"));
        var json = JSON.parse(text);
        var data = json[0].datapoints.slice(1) // trim first
        data.length = minutes;                 // trim extra tail, in case 
        callback(null, data.map(function(arr) {
          return { x: arr[1], y: arr[0] };
        }));
      });
}

function minMax(data) {
    var min = Number.MAX_VALUE;
    var max = Number.MIN_VALUE;
    for (i = 0; i < data.length; i++) {
        min = Math.min(min, data[i].y);
        max = Math.max(max, data[i].y);
    }
    return [ min, max ];
}

var bytesToString = function (bytes) {
    var fmt = d3.format('.0f'),
        isNegative = bytes < 0,
        output = ""; 

    bytes = Math.abs(bytes);
    if (bytes < 1024) {
        output = fmt(bytes) + 'B';
    } else if (bytes < 1024 * 1024) {
        output = fmt(bytes / 1024) + 'kB';
    } else if (bytes < 1024 * 1024 * 1024) {
        output = fmt(bytes / 1024 / 1024) + 'MB';
    } else {
        output = fmt(bytes / 1024 / 1024 / 1024) + 'GB';
    }
    return isNegative ? "-" + output : output;
}
var secondsToString = function(seconds, i) { 
    var now = Math.floor(Date.now() / 1000)
    var w = Math.floor((now - seconds) / (3600 * 24 * 7));
    var days = (now - seconds) % (3600 * 24 * 7)
    var d = Math.floor(days / 3600 / 24);
    var hours = days % (3600 * 24)
    var h = Math.floor(hours / 3600)
    var mins = hours % 60
    var m = Math.floor(hours / 60)

    var labels = ["week","day","hour","minute"];
    var data = [w,d,h,m];
    var result;

    data.some(function(d, i) {
        if (d > 0) {
            console.log("i", i)
            result = d + " " + labels[i] + (d > 1 ? "s" : "") + " ago"
        }
        return d > 0;
    })
    return result;
}
