import benchmark from 'benchmark';

/**
* Imports
*/
import { MiniSignal } from '../src/mini-signals.ts';
import assert from 'node:assert';
import Emittery from 'emittery';
import EventEmitter2 from 'eventemitter2';

/**
* Instances.
*/
const miniSignal = new MiniSignal();
const emittery = new Emittery();
const eventEmitter2 = new EventEmitter2();

var ASSERT = process.env['ASSERT'] === 'true';  // Set to true to enable argument checks, off for benchmarking

async function handle(args?: any[]) {
  if (!ASSERT) return;
  assert(arguments.length <= 1, 'too few arguments');
  if (args === undefined) return;
  assert(arguments.length < 1 || args[0] === 'bar', 'incorrect arguments');
  assert(arguments.length < 2 || args[1] === 'baz', 'incorrect arguments');
  assert(arguments.length < 3 || args[2] === 'boom', 'incorrect arguments');
}

async function handle2(args?: any[]) {
  if (!ASSERT) return;
  assert(arguments.length <= 1, 'too few arguments');
  if (args === undefined) return;
  assert(arguments.length < 1 || args[0] === 'bar', 'incorrect arguments');
  assert(arguments.length < 2 || args[1] === 'baz', 'incorrect arguments');
  assert(arguments.length < 3 || args[2] === 'boom', 'incorrect arguments');
}

// signals
miniSignal.add(handle); miniSignal.add(handle2);
emittery.on('event', handle); emittery.on('event', handle2);
eventEmitter2.on('event', handle); eventEmitter2.on('event', handle2);

const bench = new benchmark.Suite('async emit benchmarks' + (ASSERT ? ' WITH ASSERTS' : ''));

bench
  .on('start', () => {
    console.log('\n#', bench.name);
  })
  .on('cycle', (e: any) => {
    if (!e.target.aborted) {
      console.error(String(e.target));
    }
  })
  .on('error', (e: any) => {
    console.error(String(e.target.name)+' '+String(e.target.error));
  })
  .add('Burn-in', {
    defer: true,
    fn: async (deferred: any) => {
      await handle();
      await handle2();
      await handle(['bar']);
      await handle2(['bar']);
      await handle(['bar', 'baz']);
      await handle2(['bar', 'baz']);
      await handle(['bar', 'baz', 'boom']);
      await handle2(['bar', 'baz', 'boom']);
      deferred.resolve();
    }
  })
  .add('Hypercubed/mini-signals dispatch', () => {
      miniSignal.dispatch();
      miniSignal.dispatch(['bar']);
      miniSignal.dispatch(['bar', 'baz']);
      miniSignal.dispatch(['bar', 'baz', 'boom']);
  })
  .add('Hypercubed/mini-signals dispatchSerial', {
    defer: true,
    fn: async (deferred: any) => {
      await miniSignal.dispatchSerial();
      await miniSignal.dispatchSerial(['bar']);
      await miniSignal.dispatchSerial(['bar', 'baz']);
      await miniSignal.dispatchSerial(['bar', 'baz', 'boom']);
      deferred.resolve();
    }
  })
  .add('Hypercubed/mini-signals dispatchParallel', {
    defer: true,
    fn: async (deferred: any) => {
      await miniSignal.dispatchParallel();
      await miniSignal.dispatchParallel(['bar']);
      await miniSignal.dispatchParallel(['bar', 'baz']);
      await miniSignal.dispatchParallel(['bar', 'baz', 'boom']);
      deferred.resolve();
    }
  })
  .add('emittery emitSerial', {
    defer: true,
    fn: async (deferred: any) => {
      await emittery.emitSerial('event');
      await emittery.emitSerial('event', ['bar']);
      await emittery.emitSerial('event', ['bar', 'baz']);
      await emittery.emitSerial('event', ['bar', 'baz', 'boom']);
      deferred.resolve();
    }
  })
  .add('emittery emit (parallel)', {
    defer: true,
    fn: async (deferred: any) => {
      await emittery.emit('event');
      await emittery.emit('event', ['bar']);
      await emittery.emit('event', ['bar', 'baz']);
      await emittery.emit('event', ['bar', 'baz', 'boom']);
      deferred.resolve();
    }
  })
  .add('eventemitter2 emitAsync (parallel)', {
    defer: true,
    fn: async (deferred: any) => {
      await eventEmitter2.emitAsync('event');
      await eventEmitter2.emitAsync('event', ['bar']);
      await eventEmitter2.emitAsync('event', ['bar', 'baz']);
      await eventEmitter2.emitAsync('event', ['bar', 'baz', 'boom']);
      deferred.resolve();
    }
  })
  .run();