/* jshint -W040 */
/* global it, describe, beforeEach */

var MiniSignal = require('../');
var MiniSignalBinding = MiniSignal.MiniSignalBinding;
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
      assume(MiniSignalBinding).exists();
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
});
