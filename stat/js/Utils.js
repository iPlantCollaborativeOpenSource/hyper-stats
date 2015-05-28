SIZE=60;//1 * 7 * 24 * 60;
OFFLINE=false;

var fetch = function(minutes, expression, callback) {
  // fetch(10,"perSecond(stats.*.*51.tx)", function(a,b){ console.log(a,b); }) 
      var now, then, step, host;
      host = "http://monarch.iplantc.org:8000";

      now = Date.now();
      then = (now / 1000) - minutes * 60  - 4 * 60 // add 4 minutes for extra room

      var req = host + "/render?format=json"
      + "&target=" + encodeURIComponent(expression)
      + "&from=" + Math.floor(then)

        if (OFFLINE) { 
            text = '[{ "datapoints": [[15978.2, 1432519800], [15978.5, 1432519860], [15978.8, 1432519920], [15979.1, 1432519980], [15979.3, 1432520040], [15979.5, 1432520100], [15979.8, 1432520160], [15980.1, 1432520220], [15980.3, 1432520280], [15980.6, 1432520340], [15980.8, 1432520400], [15981.1, 1432520460], [15981.6, 1432520520], [15982.0, 1432520580], [15982.5, 1432520640], [15982.7, 1432520700], [15983.0, 1432520760], [15983.2, 1432520820], [15983.4, 1432520880], [15983.7, 1432520940], [15983.9, 1432521000], [15984.2, 1432521060], [15984.4, 1432521120], [15984.6, 1432521180], [15984.9, 1432521240], [15985.2, 1432521300], [15985.6, 1432521360], [15985.9, 1432521420], [15986.3, 1432521480], [15986.6, 1432521540], [15986.9, 1432521600], [15987.1, 1432521660], [15987.4, 1432521720], [15987.8, 1432521780], [15988.2, 1432521840], [15988.7, 1432521900], [15989.3, 1432521960], [15989.7, 1432522020], [15990.1, 1432522080], [15990.5, 1432522140], [15990.8, 1432522200], [15991.2, 1432522260], [15991.5, 1432522320], [15991.8, 1432522380], [15992.1, 1432522440], [15992.5, 1432522500], [15992.9, 1432522560], [15993.0, 1432522620], [15993.2, 1432522680], [15993.5, 1432522740], [15993.6, 1432522800], [15993.8, 1432522860], [15994.0, 1432522920], [15994.3, 1432522980], [15994.7, 1432523040], [15995.1, 1432523100]] }]' 
            var json = JSON.parse(text);
            var data = json[0].datapoints.slice(1) // trim first
            data.length = minutes;                 // trim extra tail, in case 
            callback(null, data.map(function(arr) {
              return { x: arr[1], y: arr[0] };
            }));

        } else {
          d3.text(req, function(text) {
            if (!text && !OFFLINE) return callback(new Error("unable to load data"));
            var json = JSON.parse(text);
            var data = json[0].datapoints.slice(1) // trim first
            data.length = minutes;                 // trim extra tail, in case 
            callback(null, data.map(function(arr) {
              return { x: arr[1], y: arr[0] };
            }));
          });
        }
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
