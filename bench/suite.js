var benchmark = require('benchmark');

if (typeof window !== 'undefined') {
  window.Benchmark = benchmark;
}

module.exports = function suite(name) {
  var suite = new benchmark.Suite(name);

  suite
  .on('start', function cycle(e) {
    console.log('\n#',this.name);
  })
  .on('cycle', function cycle(e) {
    if (!e.target.aborted) {
      console.log(String(e.target));
    }
  })
  .on('error', function(e) {
    console.log(String(e.target.name)+' '+String(e.target.error));
  })
  .on('complete', function completed() {
    console.log('*Fastest is %s*', this.filter('fastest').pluck('name').join(','));
  });

  return suite;
}
