/*jshint -W040 */

var MiniSignal = require('../'),
  MiniSignalBinding = MiniSignal.MiniSignalBinding,
  assume = require('assume');

describe('MiniSignal', function tests() {
  'use strict';

  describe('CommonJS', function () {

    //function writer() {
    //  pattern += this;
    //}

    var e, context, pattern;

    beforeEach(function() {
      e = new MiniSignal();
      context = { bar: 'baz' };
      pattern = '';
    });

    it('should expose MiniSignal and MiniSignalBinding', function () {
      assume(MiniSignal).exists();
      assume(MiniSignalBinding).exists();
    });

    it('emits with context', function () {
      e.add((function (bar) {
        assume(bar).equals('bar');
        assume(this).equals(context);
        assume(arguments).has.length(1);
      }).bind(context));

      e.dispatch('bar');
    });

  });

});
