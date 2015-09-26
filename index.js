// main entry point for commonjs, exports MiniSignal
var minisignal = require('./lib/mini-signals');
exports = minisignal['default'];
exports.MiniSignal = minisignal.MiniSignal;
exports.MiniSignalBinding = minisignal.MiniSignalBinding;
module.exports = exports;
