'use strict';

/**
* Preparation code.
*/
var EventEmitter3 = require('eventemitter3'),
  EventEmitter1 = require('events').EventEmitter,
  MiniSignal = require('../src/index'),
  MiniSignal_0_0_1 = require('./mini-signals@0.0.1'),
  MiniSignal_0_0_2 = require('./mini-signals@0.0.2'),
  MiniSignal_1_0_1 = require('./mini-signals@1.0.1'),
  Signal = require('signals');

/**
* Instances.
*/
var ee1 = new EventEmitter1(),
  ee3 = new EventEmitter3(),
  miniSignal = new MiniSignal(),
  miniSignal_0_0_1 = new MiniSignal_0_0_1(),
  miniSignal_0_0_2 = new MiniSignal_0_0_2(),
  miniSignal_1_0_1 = new MiniSignal_1_0_1(),
  signal = new Signal();

var ctx = {
  foo: 'bar'
};

function handle() {
  if (arguments.length > 100) {console.log('damn');}
  if (this !== ctx) {console.log('damn'); process.exit(); }
}

function handle2() {
  if (arguments.length > 100) {console.log('damn');}
  if (this !== ctx) {console.log('damn'); process.exit(); }
}

// events
ee1.on('foo', handle.bind(ctx)); ee1.on('foo', handle2.bind(ctx));
ee3.on('foo', handle, ctx); ee3.on('foo', handle2, ctx);

// signals
signal.add(handle, ctx); signal.add(handle2, ctx);
miniSignal.add(handle,ctx); miniSignal.add(handle2, ctx);
miniSignal_0_0_1.add(handle.bind(ctx)); miniSignal_0_0_1.add(handle2.bind(ctx));
miniSignal_0_0_2.add(handle.bind(ctx)); miniSignal_0_0_2.add(handle2.bind(ctx));
miniSignal_1_0_1.add(handle.bind(ctx)); miniSignal_1_0_1.add(handle2.bind(ctx));

require('./suite')('emit')
  .add('Node EventEmitter', function() {
    ee1.emit('foo');
    ee1.emit('foo', 'bar');
    ee1.emit('foo', 'bar', 'baz');
    ee1.emit('foo', 'bar', 'baz', 'boom');
  })
  .add('EventEmitter3', function() {
    ee3.emit('foo');
    ee3.emit('foo', 'bar');
    ee3.emit('foo', 'bar', 'baz');
    ee3.emit('foo', 'bar', 'baz', 'boom');
  })
  .add('JS-Signals', function() {
    signal.dispatch();
    signal.dispatch('bar');
    signal.dispatch('bar', 'baz');
    signal.dispatch('bar', 'baz', 'boom');
  })
  .add('Latest', function() {
    miniSignal.dispatch();
    miniSignal.dispatch('bar');
    miniSignal.dispatch('bar', 'baz');
    miniSignal.dispatch('bar', 'baz', 'boom');
  })
  .add('\\@0.0.1', function() {
    miniSignal_0_0_1.dispatch();
    miniSignal_0_0_1.dispatch('bar');
    miniSignal_0_0_1.dispatch('bar', 'baz');
    miniSignal_0_0_1.dispatch('bar', 'baz', 'boom');
  })
  .add('\\@0.0.2', function() {
    miniSignal_0_0_2.dispatch();
    miniSignal_0_0_2.dispatch('bar');
    miniSignal_0_0_2.dispatch('bar', 'baz');
    miniSignal_0_0_2.dispatch('bar', 'baz', 'boom');
  })
  .add('\\@1.0.1', function() {
    miniSignal_1_0_1.dispatch();
    miniSignal_1_0_1.dispatch('bar');
    miniSignal_1_0_1.dispatch('bar', 'baz');
    miniSignal_1_0_1.dispatch('bar', 'baz', 'boom');
  })
  .run();
