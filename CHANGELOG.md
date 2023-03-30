# CHANGELOG

## HEAD (Unreleased)

- `.add` is now type safe.  The type of the listener is checked against the type variable in the constructor as well as an optional "flavor".
- `.add` now returns a node reference instead of a object.  The returned node cannot be removed directly; it must be from the signal using `MiniSignal#detach`.
- `.once` has been removed.  Use `.add` instead with a call to `.detach` in the callback.
- The `thisArg` parameter has been removed from `.add`.  Use `.add` with a call to `.bind` or (preferred) use an arrow function with a closure.
- `.dispatch` now throws an error if the signal is already dispatching.
- `.detach` now throws an error if node reference was not generated from the signal.

---

## 1.2.0 (2017-09-11)

- Added TS typings

## 1.1.1 (2016-02-07)

- Remove once listeners before calling, prevents loops

## 1.1.0 (2015-11-03)

- Added optional thisArg on MiniSignal#add and MiniSignal#once
- Added MiniSignal#has
- MiniSignal#detach now checks if node bound to itself
