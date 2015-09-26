/*jshint -W040 */

describe('MiniSignal', function tests() {
  'use strict';

  var MiniSignal = require('../').MiniSignal,
    MiniSignalBinding = require('../').MiniSignalBinding,
    assume = require('assume'),
    assert = require('assert');

  describe('MiniSignal', function () {

    function writer() {
      pattern += this;
    }

    var e, context, pattern;

    beforeEach(function() {
      e = new MiniSignal();
      context = { bar: 'baz' };
      pattern = '';
    });

    it('should return false when there are not events to dispatch', function () {
      assume(MiniSignal).exists();
      assume(MiniSignalBinding).exists();
    });

    it('should return false when there are not events to dispatch', function () {
      assume(e.dispatch('foo')).equals(false);
      assume(e.dispatch('bar')).equals(false);
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
