const { MiniSignal } = require('.');

const e = new MiniSignal();

const w = e.add(() => {});

e.dispatch();

e.detach(w);

(async () => {
  await new Promise(resolve => setTimeout(resolve, 0));
  global.gc();
  console.log(w.deref());
})();
