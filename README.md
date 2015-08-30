# mini-signals
signals, in JavaScript, fast

# What?

Custom event/messaging system for JavaScript inspired by [js-signals](https://github.com/millermedeiros/js-signals) based on [EventEmitter3](https://github.com/primus/eventemitter3) code base.

# Why?

There are several advantages to signals over event emitters (see [Comparison between different Observer Pattern implementations](https://github.com/millermedeiros/js-signals/wiki/Comparison-between-different-Observer-Pattern-implementations)).  However, the current implementation of [js-signals](https://github.com/millermedeiros/js-signals) is (arguably) slow compared to [EventEmitter3](https://github.com/primus/eventemitter3).

# How?

This implementation is based on the fast [EventEmitter3](https://github.com/primus/eventemitter3) code base.

# Proof?

[EventsSpeedTests](https://github.com/Hypercubed/EventsSpeedTests)

# License

MIT
