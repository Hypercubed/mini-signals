/* jshint -W040 */
/* global it, describe, beforeEach */

var MiniSignal = require('../');
var assume = require('assume');

describe('MiniSignal', function () {
  'use strict';

  describe('CommonJS', function () {
    // function writer() {
    //  pattern += this;
    // }

    var e, context; /* , pattern; */

    beforeEach(function () {
      e = new MiniSignal();
      context = { bar: 'baz' };
      // pattern = '';
    });

    it('should expose MiniSignal and MiniSignalBinding', function () {
      assume(MiniSignal).exists();
      assume(MiniSignal.MiniSignalBinding).exists();
    });

    it('emits with context', function () {
      e.add(function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);
        assume(arguments).has.length(1);
      }, context);

      e.dispatch('bar');
    });
  });

  it('quick test', function () {
    var pattern = [];
    var e = new MiniSignal();

    var foo = e.add(writer, 'foo');
    e.add(writer, 'baz');
    var bar = e.add(writer, 'bar');

    assume(e instanceof MiniSignal);
    assume(foo instanceof MiniSignal.MiniSignalBinding);

    e.dispatch('banana');
    e.dispatch('appple');

    foo.detach();
    bar.detach();

    e.dispatch('pear');

    e.detachAll();

    e.dispatch('raspberry');

    assume(pattern.join(';') === 'foo:banana;baz:banana;bar:banana;foo:appple;baz:appple;bar:appple;baz:pear');

    function writer (a) {
      pattern.push(this + ':' + a);
    }
  });
});
