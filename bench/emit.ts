import { IsoBench } from 'iso-bench';
import assert from 'node:assert';

/**
* Imports
*/
import { EventEmitter } from 'node:events';
import EventEmitter3 from 'eventemitter3';
import { EventEmitter as TseepEventEmitter } from 'tseep/lib/ee-safe.js';

import { MiniSignal } from '../src/mini-signals.ts';
import Signal from 'signals';
import { Event } from 'ts-typed-events';

import MiniSignal_0_0_1 from 'mini-signals-0.0.1';
import MiniSignal_0_0_2 from 'mini-signals-0.0.2';
import MiniSignal_1_0_1 from 'mini-signals-1.0.1';
import MiniSignal_1_1_0 from 'mini-signals-1.1.0';
import { MiniSignal as MiniSignal_2_0_0 } from 'mini-signals-2.0.0';

/**
* Instances.
*/
const ee1 = new EventEmitter();
const ee3 = new EventEmitter3();
const tseepEE = new TseepEventEmitter();

const signal = new Signal();
const event = new Event<string>();
const miniSignal = new MiniSignal();

const miniSignal_0_0_1 = new MiniSignal_0_0_1();
const miniSignal_0_0_2 = new MiniSignal_0_0_2();
const miniSignal_1_0_1 = new MiniSignal_1_0_1();
const miniSignal_1_1_0 = new MiniSignal_1_1_0();
const miniSignal_2_0_0 = new MiniSignal_2_0_0();

var ASSERT = process.env['ASSERT'] === 'true';  // Set to true to enable argument checks, off for benchmarking

function handle(...args: any[]) {
  if (!ASSERT) return;
  assert(args.length <= 5, 'too many arguments ' + arguments.length);
  assert(args[0] === undefined || args[0] === 'bar', 'incorrect arguments');
  assert(args[1] === undefined || args[1] === 'baz', 'incorrect arguments');
  assert(args[2] === undefined || args[2] === 'boom', 'incorrect arguments');
}

function handle2(...args: any[]) {
  if (!ASSERT) return;
  assert(args.length <= 5, 'too many arguments ' + arguments.length);
  assert(args[0] === undefined || args[0] === 'bar', 'incorrect arguments');
  assert(args[1] === undefined || args[1] === 'baz', 'incorrect arguments');
  assert(args[2] === undefined || args[2] === 'boom', 'incorrect arguments');
}

// events
ee1.on('foo', handle); ee1.on('foo', handle2);
ee3.on('foo', handle); ee3.on('foo', handle2);
tseepEE.on('foo', handle); tseepEE.on('foo', handle2);

// signals
signal.add(handle); signal.add(handle2);
miniSignal.add(handle); miniSignal.add(handle2);
event.on(handle); event.on(handle2);

miniSignal_0_0_1.add(handle); miniSignal_0_0_1.add(handle2);
miniSignal_0_0_2.add(handle); miniSignal_0_0_2.add(handle2);
miniSignal_1_0_1.add(handle); miniSignal_1_0_1.add(handle2);
miniSignal_1_1_0.add(handle); miniSignal_1_1_0.add(handle2);
miniSignal_2_0_0.add(handle); miniSignal_2_0_0.add(handle2);

const bench = new IsoBench('emit' + (ASSERT ? ' WITH ASSERTS' : ''));

bench
  .add('Theory', () => {
    handle();
    handle2();
    handle('bar');
    handle2('bar');
    handle('bar', 'baz');
    handle2('bar', 'baz');
    handle('bar', 'baz', 'boom');
    handle2('bar', 'baz', 'boom');
  })
  .endGroup('Burn-in')
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
  })
  .add('Hypercubed/mini-signals@2.0.0', () => {
    miniSignal_2_0_0.dispatch();
    miniSignal_2_0_0.dispatch('bar');
    miniSignal_2_0_0.dispatch('bar', 'baz');
    miniSignal_2_0_0.dispatch('bar', 'baz', 'boom');
  })
  .add('Morglod/tseep', () => {
    miniSignal_2_0_0.dispatch();
    miniSignal_2_0_0.dispatch('bar');
    miniSignal_2_0_0.dispatch('bar', 'baz');
    miniSignal_2_0_0.dispatch('bar', 'baz', 'boom');
  });

bench.consoleLog().run();