'use strict';

/**
* Preparation code.
*/
const EventEmitter3 = require('eventemitter3');
const EventEmitter1 = require('events').EventEmitter;
const {MiniSignal} = require('../src/index');
const MiniSignal_0_0_1 = require('./mini-signals@0.0.1');
const MiniSignal_0_0_2 = require('./mini-signals@0.0.2');
const MiniSignal_1_0_1 = require('./mini-signals@1.0.1');
const MiniSignal_1_1_0 = require('./mini-signals@1.1.0');
const Signal = require('signals');

/**
* Instances.
*/
const ee1 = new EventEmitter1();
const ee3 = new EventEmitter3();
const miniSignal = new MiniSignal();
const miniSignal_0_0_1 = new MiniSignal_0_0_1();
const miniSignal_0_0_2 = new MiniSignal_0_0_2();
const miniSignal_1_0_1 = new MiniSignal_1_0_1();
const miniSignal_1_1_0 = new MiniSignal_1_1_0();
const signal = new Signal();

function handle() {
  if (arguments.length > 100) {console.log('damn');}
}

function handle2() {
  if (arguments.length > 100) {console.log('damn');}
}

// events
ee1.on('foo', handle); ee1.on('foo', handle2);
ee3.on('foo', handle); ee3.on('foo', handle2);

// signals
signal.add(handle); signal.add(handle2);
miniSignal.add(handle); miniSignal.add(handle2);
miniSignal_0_0_1.add(handle); miniSignal_0_0_1.add(handle2);
miniSignal_0_0_2.add(handle); miniSignal_0_0_2.add(handle2);
miniSignal_1_0_1.add(handle); miniSignal_1_0_1.add(handle2);
miniSignal_1_1_0.add(handle); miniSignal_1_1_0.add(handle2);

require('./suite')('emit')
  .add('Node EventEmitter', () => {
    ee1.emit('foo');
    ee1.emit('foo', 'bar');
    ee1.emit('foo', 'bar', 'baz');
    ee1.emit('foo', 'bar', 'baz', 'boom');
  })
  .add('EventEmitter3', () => {
    ee3.emit('foo');
    ee3.emit('foo', 'bar');
    ee3.emit('foo', 'bar', 'baz');
    ee3.emit('foo', 'bar', 'baz', 'boom');
  })
  .add('JS-Signals', () => {
    signal.dispatch();
    signal.dispatch('bar');
    signal.dispatch('bar', 'baz');
    signal.dispatch('bar', 'baz', 'boom');
  })
  .add('MiniSignals Latest', () => {
    miniSignal.dispatch();
    miniSignal.dispatch('bar');
    miniSignal.dispatch('bar', 'baz');
    miniSignal.dispatch('bar', 'baz', 'boom');
  })
  .add('MiniSignals @0.0.1', () => {
    miniSignal_0_0_1.dispatch();
    miniSignal_0_0_1.dispatch('bar');
    miniSignal_0_0_1.dispatch('bar', 'baz');
    miniSignal_0_0_1.dispatch('bar', 'baz', 'boom');
  })
  .add('MiniSignals @0.0.2', () => {
    miniSignal_0_0_2.dispatch();
    miniSignal_0_0_2.dispatch('bar');
    miniSignal_0_0_2.dispatch('bar', 'baz');
    miniSignal_0_0_2.dispatch('bar', 'baz', 'boom');
  })
  .add('MiniSignals @1.0.1', () => {
    miniSignal_1_0_1.dispatch();
    miniSignal_1_0_1.dispatch('bar');
    miniSignal_1_0_1.dispatch('bar', 'baz');
    miniSignal_1_0_1.dispatch('bar', 'baz', 'boom');
  })
  .add('MiniSignals @1.2.0', () => {
    miniSignal_1_1_0.dispatch();
    miniSignal_1_1_0.dispatch('bar');
    miniSignal_1_1_0.dispatch('bar', 'baz');
    miniSignal_1_1_0.dispatch('bar', 'baz', 'boom');
  })
  .run();
