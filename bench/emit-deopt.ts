import { IsoBench } from 'iso-bench';

/**
* Imports
*/
import { MiniSignal } from '../src/mini-signals.ts';
import { EventEmitter } from 'node:events';
import EventEmitter3 from 'eventemitter3';
import Signal from 'signals';

import MiniSignal_0_0_1 from 'mini-signals-0.0.1';
import MiniSignal_0_0_2 from 'mini-signals-0.0.2';
import { MiniSignal as MiniSignal_1_0_1 } from 'mini-signals-1.0.1';
import MiniSignal_1_1_0 from 'mini-signals-1.1.0';
import { assert } from 'node:console';

/**
* Instances.
*/
const ee1 = new EventEmitter();
const ee3 = new EventEmitter3();
const miniSignal = new MiniSignal();
const miniSignal_0_0_1 = new MiniSignal_0_0_1();
const miniSignal_0_0_2 = new MiniSignal_0_0_2();
const miniSignal_1_0_1 = new MiniSignal_1_0_1();
const miniSignal_1_1_0 = new MiniSignal_1_1_0();
const signal = new Signal();

var ASSERT = process.env['ASSERT'] === 'true';  // Set to true to enable argument checks, off for benchmarking

function handle() {
  if (!ASSERT) return;
  assert(arguments.length <= 3, 'too many arguments');
}

// Adding a prop to the function to make it deopt
handle.$inject = [1,2,3];

function handle2() {
  if (!ASSERT) return;
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

const bench = new IsoBench('emit deopt' + (ASSERT ? ' WITH ASSERTS' : ''));

bench
  .add('node:events', () => {
    ee1.emit('foo');
    ee1.emit('foo', 'bar');
    ee1.emit('foo', 'bar', 'baz');
    ee1.emit('foo', 'bar', 'baz', 'boom');
  })
  .add('primus/eventemitter3', () => {
    ee3.emit('foo');
    ee3.emit('foo', 'bar');
    ee3.emit('foo', 'bar', 'baz');
    ee3.emit('foo', 'bar', 'baz', 'boom');
  })
  .add('millermedeiros/js-signals', () => {
    signal.dispatch();
    signal.dispatch('bar');
    signal.dispatch('bar', 'baz');
    signal.dispatch('bar', 'baz', 'boom');
  })
  .add('Hypercubed/mini-signals', () => {
    miniSignal.dispatch();
    miniSignal.dispatch('bar');
    miniSignal.dispatch('bar', 'baz');
    miniSignal.dispatch('bar', 'baz', 'boom');
  })
  .add('Hypercubed/mini-signals@0.0.1', () => {
    miniSignal_0_0_1.dispatch();
    miniSignal_0_0_1.dispatch('bar');
    miniSignal_0_0_1.dispatch('bar', 'baz');
    miniSignal_0_0_1.dispatch('bar', 'baz', 'boom');
  })
  .add('Hypercubed/mini-signals@0.0.2', () => {
    miniSignal_0_0_2.dispatch();
    miniSignal_0_0_2.dispatch('bar');
    miniSignal_0_0_2.dispatch('bar', 'baz');
    miniSignal_0_0_2.dispatch('bar', 'baz', 'boom');
  })
  .add('Hypercubed/mini-signals@1.0.1', () => {
    miniSignal_1_0_1.dispatch();
    miniSignal_1_0_1.dispatch('bar');
    miniSignal_1_0_1.dispatch('bar', 'baz');
    miniSignal_1_0_1.dispatch('bar', 'baz', 'boom');
  })
  .add('Hypercubed/mini-signals@1.2.0', () => {
    miniSignal_1_1_0.dispatch();
    miniSignal_1_1_0.dispatch('bar');
    miniSignal_1_1_0.dispatch('bar', 'baz');
    miniSignal_1_1_0.dispatch('bar', 'baz', 'boom');
  });

bench.consoleLog().run();
