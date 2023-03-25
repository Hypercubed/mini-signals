/* jshint -W040 */
/* global it, describe, beforeEach */

import { MiniSignal, MiniSignalBinding } from '.';
import { expect } from 'chai';

describe('MiniSignal', () => {
  describe('CommonJS', () => {
    let e: MiniSignal;
    let context: any;

    beforeEach(() => {
      e = new MiniSignal();
      context = { bar: 'baz' };
    });

    it('should expose MiniSignal and MiniSignalBinding', () => {
      expect(MiniSignal).to.be.a('function');
      expect(MiniSignalBinding).to.be.a('function');
    });

    it('emits with context', () => {
      e.add(function (bar: string) {
        expect(bar).equals('bar');
        expect(this).equals(context);
        expect(arguments).has.length(1);
      }, context);

      e.dispatch('bar');
    });
  });

  it('quick test', () => {
    const pattern: string[] = [];
    const e = new MiniSignal();

    const foo = e.add(writer, 'foo');
    e.add(writer, 'baz');
    const bar = e.add(writer, 'bar');

    expect(e instanceof MiniSignal);
    expect(foo instanceof MiniSignalBinding);

    e.dispatch('banana');
    e.dispatch('apple');

    foo.detach();
    bar.detach();

    e.dispatch('pear');

    e.detachAll();

    e.dispatch('raspberry');

    expect(
      pattern.join(';') ===
        'foo:banana;baz:banana;bar:banana;foo:apple;baz:apple;bar:apple;baz:pear'
    );

    function writer(a: string): void {
      pattern.push(String(this) + ':' + a);
    }
  });
});
