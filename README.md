# mini-signals
signals, in JavaScript, fast

## Description

Custom event/messaging system for JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) originally based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

There are several advantages to signals over event-emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)).  However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to other implementations (see [EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)).  `mini-signals` is a fast, minimal emitter, that is mostly API compatible with[js-signals](https://github.com/millermedeiros/js-signals).

## Install

### npm:

```
npm install mini-signals
```

### jspm:

```
jspm install mini-signals=github:Hypercubed/mini-signals
```

## Example Usage

```
var Signal = require('mini-signals');
var mySignal = new Signal();

mySignal.add(onSignal);           //add listener
mySignal.dispatch('foo', 'bar');  //dispatch signal passing custom parameters
mySignal.remove(onSignal);        //remove a single listener

function onSignal(foo, bar) {
  /* */
}
```


## License

Copyright (c) 2015 Jayson Harshbarger

MIT License
