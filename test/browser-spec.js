/*jshint -W040 */

describe('MiniSignal', function tests() {
  'use strict';

  var MiniSignal = require('../browser'),
    MiniSignalBinding = require('../browser').MiniSignalBinding,
    assume = require('assume');

  describe('browser.js', function () {

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
