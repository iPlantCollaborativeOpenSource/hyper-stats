var context = cubism.context(), // a default context
    graphite = context.graphite("http://monarch.iplantc.org:8000");

context.step(60 * 1000)
       .size(500)
//horizon.metric(['stats.sl2l3_iplantcollaborative_org.64545346-5647-4b6e-98dd-c70fdf2bb83e.pcpu'])


graphite.find("stats.*.*49.*", function(error, results) { 
////var metrics = results.filter(function(m) { 
////    return m.split('.').indexOf('state') != -1;
////}); // ["hosts.foo.cpu.0.", "hosts.bar.cpu.0.", etc.]
    var metrics = results.map(function(m) {
        return graphite.metric(m); 
    });
    d3.select("body").selectAll("div")
        .data(metrics)
      .enter().append("div")
        .attr("class", "horizon")
        .call(context.horizon()
                .height(50)
                .colors(["#6baed6","#bdd7e7","#bae4b3","#74c476"])
                .title(function(d, i) { return d.toString().split('.')[3] + ": ";})
                .extent([0, 100]));
  
    d3.select("body").append("svg")
        .attr("class", "axis")
        .attr("width", 1440)
        .attr("height", 30)
      .append("g")
        .attr("transform", "translate(0,30)")
        .call(context.axis());
});

/*(function () {
            var graphData = [81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,81,91,91,91,91,91,91,91,91,116,128,128,148,360,377,464,464,464,464,464,474,474,519,519,519,519,519,519,544,544,544,544,554,554,554,554,554,554,554,554,579,579,579,579,579,579,579,579,579,579,579,579,579,579];

            var width = 139;
            var height = 50;

            var x = d3.scale.linear().domain([1, graphData.length]).range([0, width]);
            var y = d3.scale.linear().domain([d3.min(graphData), d3.max(graphData)]).range([height - 1, 1]);

            var valueline = d3.svg.line()
                .x(function (d, i) { return x(i); })
                .y(function (d, i) { return y(d); });

            var svg = d3.select('#reputationGraph').attr('width', width).attr('height', height);
            svg.append('g').append('path').attr('class', 'line').attr('d', valueline(graphData));

            svg.append('rect')
                .attr('class', 'overlay')
                .attr('width', width)
                .attr('height', height)
                .on('mouseout', mouseout)
                .on('mousemove', mousemove);

            var toolTip;

            var commify = function (number) {
                var numberString = String(number.toFixed(0));
                var parts = numberString.split('.');
                var whole = parts[0];

                var pattern = /(\d+)(\d{3})(,|$)/;
                while (pattern.test(whole)) {
                    whole = whole.replace(pattern, '$1,$2');
                }

                numberString = (parts.length > 1) ? whole + '.' + parts[1] : whole;
                return numberString;
            }

            function mouseout() {
                if (toolTip && !toolTip.is(':hover')) {
                    toolTip.fadeOutAndRemove();
                }
            }

            function mousemove() {
                var xOffset = d3.mouse(this)[0];
                rep = graphData[Math.round(x.invert(xOffset))];
                var yOffset = y(rep);

                var $elem = $('.graph');

                if (!toolTip) {
                    toolTip = StackExchange.helpers.showMessage($elem, commify(rep), { type: 'config tooltip', dismissable: false, position: { at: 'top left', my: 'bottom left', offsetLeft: 26 + xOffset, offsetTop: yOffset }, removing: function () { toolTip = null; } });
                    toolTip.on('mouseout', function () {
                        if (toolTip) { toolTip.fadeOutAndRemove(); }
                    });
                }

                toolTip.find('.message-text').html(commify(rep));
                toolTip.css({ left: 30 + xOffset, top: yOffset - 20 });
            }
        })();*/
