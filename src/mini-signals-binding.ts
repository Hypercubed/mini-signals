import { MiniSignal } from "./mini-signals";

export type BoundFunction<T extends any[] = any[], A = any> = (
  thisArg: A,
  ...args: T
) => void;

export class MiniSignalBinding<T extends any[] = any[], A = any> {
  _next?: any = null;
  _prev?: any = null;
  _owner?: any = null;

  /**
   * MiniSignalBinding constructor.
   */
  constructor(
    readonly _fn: BoundFunction<T, A>,
    readonly _once = false,
    readonly _thisArg?: A
  ) {}

  detach(): boolean {
    if (this._owner === null) return false;
    this._owner.detach(this);
    return true;
  }
}
