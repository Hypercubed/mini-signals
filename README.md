# mini-signals
signals, in JavaScript, fast

[![NPM](https://img.shields.io/npm/v/mini-signals.svg)](https://www.npmjs.com/package/mini-signals) [![Build Status](https://travis-ci.org/Hypercubed/mini-signals.svg)](https://travis-ci.org/Hypercubed/mini-signals/) [![Codacy Badge](https://api.codacy.com/project/badge/18fa3fdfb90b43c7966f817124307d66)](https://www.codacy.com/app/hypercubed/mini-signals) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Hypercubed/mini-signals/blob/master/LICENSE)

## Description

Custom event/messaging system for JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) originally based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

There are several advantages to signals over event-emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)).  However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to other implementations (see [EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)).  `mini-signals` is a fast, minimal emitter, that is mostly API compatible with [js-signals](https://github.com/millermedeiros/js-signals).

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
