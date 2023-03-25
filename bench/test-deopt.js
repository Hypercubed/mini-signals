var { MiniSignal } = require('../dist/');
var assert = require('assert');

var myObject = new MyObject();

myObject.started.add(startedDispatch);
myObject.started.add(startedDispatch2, myObject);

// startedDispatch2.$ = 'Causes Bad value context for arguments value';

for (var i = 0; i < 200000; i++) {
  myObject.started.dispatch(1, 2, 3, 4, 5);
}

function MyObject () {
  this.started = new MiniSignal();
  this.updated = new MiniSignal();
  this.ended = new MiniSignal();
}

function startedDispatch () {
  assert(arguments.length === 5);
}

function startedDispatch2 () {
  assert(arguments.length === 5);
}
