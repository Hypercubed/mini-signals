# MiniSignalEmitter

A strongly-typed event emitter wrapper around MiniSignals.

## Basic Usage
```typescript
import { MiniSignal } from 'mini-signals';
import { MiniSignalEmitter, type SignalMap } from './mini-signal-emitter';

// Create signals
const signals = {
  'user:login': new MiniSignal(),
  'user:logout': new MiniSignal(),
  'data:update': new MiniSignal(),
} as const;

// Create emitter (type is inferred!)
const emitter = new MiniSignalEmitter(signals);

// Listen to events
const cleanup = emitter.on('user:login', (userId, timestamp) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

// Emit events
emitter.emit('user:login', 'user123', Date.now());

// Cleanup
cleanup();
```

## Using with Classes

### Composition (Recommended)

Add event capabilities to any class by including an emitter instance:
```typescript
class UserManager {
  private readonly signals = {
    'login': new MiniSignal<[string]>(),
    'logout': new MiniSignal<[string]>(),
  } as const;

  private readonly events = new MiniSignalEmitter(this.signals);

  // Expose event methods
  readonly on = this.events.on.bind(this.events);
  readonly once = this.events.once.bind(this.events);

  login(userId: string) {
    // ... login logic
    this.events.emit('login', userId);
  }

  logout(userId: string) {
    // ... logout logic
    this.events.emit('logout', userId);
  }
}

// Usage
const manager = new UserManager();
manager.on('login', (userId) => console.log(`${userId} logged in`));
```

### Inheritance

Extend `MiniSignalEmitter` directly for classes that are fundamentally event-driven:

```typescript
type ConnectionEvents = {
  'open': [];
  'close': [reason: string];
  'error': [error: Error];
};

class WebSocketConnection extends MiniSignalEmitter<SignalMap<ConnectionEvents>> {
  constructor() {
    super({
      'open': new MiniSignal(),
      'close': new MiniSignal(),
      'error': new MiniSignal(),
    });
  }

  connect() {
    // ... connection logic
    this.emit('open');
  }

  disconnect(reason: string) {
    // ... disconnect logic
    this.emit('close', reason);
  }
}

// Usage
const ws = new WebSocketConnection();
ws.on('open', () => console.log('Connected'));
ws.on('close', (reason) => console.log(`Disconnected: ${reason}`));
ws.connect();
```

## Async Event Handlers
```typescript
// Wait for all handlers in parallel
await emitter.emitParallel('data:save', id, data);

// Wait for all handlers sequentially
await emitter.emitSerial('data:save', id, data);
```

## Shared Signals

Multiple emitters can share the same signal instances for coordinated event handling:

```typescript
const sharedSignals = {
  'sync': new MiniSignal<[string]>(),
};

const emitter1 = new MiniSignalEmitter(sharedSignals);
const emitter2 = new MiniSignalEmitter(sharedSignals);

emitter1.on('sync', (data) => console.log('Emitter 1:', data));
emitter2.on('sync', (data) => console.log('Emitter 2:', data));

emitter1.emit('sync', 'hello'); // Both handlers fire!
```