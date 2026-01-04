# Copilot Instructions for mini-signals

## Project Overview
- **mini-signals** is a fast, minimal, type-safe event/messaging system for TypeScript/JavaScript, inspired by [js-signals](https://github.com/millermedeiros/js-signals) and [EventEmitter3](https://github.com/primus/eventemitter3).
- Provides two main APIs:
  - `MiniSignal`: Single-channel, high-performance signal.
  - `MiniSignalEmitter`: Multi-channel event emitter, each event is a flavor-typed `MiniSignal`.
- Designed for both synchronous and asynchronous event dispatching (supports listeners returning Promises).

## Key Files & Structure
- Source: [`src/`](../src/) — main TypeScript implementation.
  - [`mini-signals.ts`](../src/mini-signals.ts): Core `MiniSignal` logic.
  - [`mini-signals-emitter.ts`](../src/mini-signals-emitter.ts): `MiniSignalEmitter` implementation.
  - [`mini-signals-utils.ts`](../src/mini-signals-utils.ts): Utility helpers.
  - [`mini-signals-types.d.ts`](../src/mini-signals-types.d.ts): Type definitions.
- Tests: [`src/__tests__/`](../src/__tests__) — Vitest-based unit tests.
- Benchmarks: [`bench/`](../bench/) — Performance scripts.
- Docs: [`docs/`](../docs/) — API and usage documentation.

## Developer Workflows
- **Install dependencies:**
  ```sh
  npm install
  ```
- **Build (TypeScript):**
  ```sh
  npm run build
  ```
- **Test (Vitest):**
  ```sh
  npm test
  # or
  npx vitest run
  ```
- **Benchmark:**
  ```sh
  node bench/emit.js
  # or run other scripts in bench/
  ```
- **Docs:**
  - API docs are generated via TypeDoc; see [`typedoc.json`](../typedoc.json).

## Project Conventions & Patterns
- **Type Safety:** All signals/events are strongly typed. Use generics to specify listener argument types.
- **Flavor-Typing:** Each signal instance is uniquely branded; only bindings from the same signal can detach listeners.
- **Async Support:** Use `.dispatchSerial` and `.dispatchParallel` for async listeners.
- **Minimal Dependencies:** No runtime dependencies; pure TypeScript/ESM/CJS output.
- **Testing:** All new features/bugfixes require corresponding tests in `src/__tests__/`.
- **Exports:** Both ESM (`index.mjs`) and CJS (`index.cjs`) are supported.

## Integration & External References
- Inspired by and API-compatible with [js-signals](https://github.com/millermedeiros/js-signals) and Node.js `EventEmitter` (for `MiniSignalEmitter`).
- No external runtime dependencies.

## Examples
- See [`README.md`](../README.md) and [`docs/`](../docs/) for usage patterns and API details.
- Example: Creating a signal and adding/removing listeners:
  ```typescript
  import { MiniSignal } from 'mini-signals';
  const sig = new MiniSignal<[string]>();
  const binding = sig.add((msg) => console.log(msg));
  sig.dispatch('hello');
  binding.detach();
  ```

---

For any new features, follow the patterns in `src/` and ensure type safety and test coverage. When in doubt, reference the README and existing tests for idiomatic usage.
