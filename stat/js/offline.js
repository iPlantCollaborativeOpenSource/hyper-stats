function random(name) {
  var value = 0,
      i = 0;

      // for (var i = 0; i < 10000; i++) {
      //     values.push(Math.max(0, Math.min(10, 10 * Math.random())));
      // }
  return context.metric(function(start, stop, step, callback) {
      //console.log(stop - start, last, step)
      var values = [];
      start = +start, stop = +stop;
      var last = start;

      while (last < stop) {
        // if (i % 100 == 0) {
        //     console.log("WOOT " + i);
        // } 
        i % 100 == 0 ? values.push( Math.max(0, Math.min(10, 10 * Math.random()))): values.push(NaN) ; 
        //values.push( Math.max(0, Math.min(10, 10 * Math.random())));
        //values.push(value);
        i++;
        last += step;
      }

    //console.log(stop - start)
    //console.log("trim "  + ((stop - start) / step) + " from " + values.length)
    callback(null, values);
  }, name);
}

var context = cubism.context()
    .serverDelay(0)
    .clientDelay(0)
    .step(60 * 1000 / 500)
    .size(960);

var foo = random("foo"),
    bar = random("bar");

d3.select("body").append("div").call(function(div) {
  div.append("div")
      .attr("class", "axis")
      .call(context.axis().orient("top"));
  div.selectAll(".horizon")
      .data([foo])
    .enter().append("div")
      .attr("class", "horizon")
      .call(context.horizon().extent([0, 10]).height(150).colors(['#08519c', '#bae4b3']));
  div.append("div")
      .attr("class", "rule")
      .call(context.rule());
});
