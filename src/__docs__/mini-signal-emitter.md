# MiniSignalEmitter

A strongly-typed event emitter wrapper around MiniSignals.

## Basic Usage

```typescript
import { MiniSignal, MiniSignalEmitter, type SignalMap } from 'mini-signals';

// Create emitter
const emitter = new MiniSignalEmitter({
  'user:login': new MiniSignal<[string, number]>(),
  'user:logout': new MiniSignal<[string, number]>(),
  'data:update': new MiniSignal<[]>(),
});

// Listen to events
const cleanup = emitter.on('user:login', (userId, timestamp) => {
  console.log(`User ${userId} logged in at ${timestamp}`);
});

// Emit events
emitter.emit('user:login', 'user123', Date.now());

// Emit async event (also works with emitSerial)
await emitter.emitParallel('data:update');

// Cleanup
emitter.off('user:login', cleanup);
```

## Using with Classes

### Composition (Recommended)

Add event capabilities to any class by including an emitter instance:

```typescript
class UserManager {
  private readonly events = new MiniSignalEmitter({
    login: new MiniSignal<[string]>(),
    logout: new MiniSignal<[string]>(),
    update: new MiniSignal<[]>(),
  });

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

  async update() {
    // ... update logic
    await this.events.emitParallel('update');
  }
}

// Usage
const manager = new UserManager();
manager.on('login', (userId) => console.log(`${userId} logged in`));
manager.on('update', async () => {
  await doSomethingAsync();
});
```

### Inheritance

Extend `MiniSignalEmitter` directly for classes that are fundamentally event-driven:

```typescript
type ConnectionEvents = {
  open: [];
  close: [reason: string];
  error: [error: Error];
};

class WebSocketConnection extends MiniSignalEmitter<ConnectionEvents> {
  constructor() {
    super({
      open: new MiniSignal(),
      close: new MiniSignal(),
      error: new MiniSignal(),
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
  sync: new MiniSignal<[unknown]>(),
};

const emitter1 = new MiniSignalEmitter(sharedSignals);
const emitter2 = new MiniSignalEmitter(sharedSignals);

emitter1.on('sync', (data) => console.log('Emitter 1:', data));
emitter2.on('sync', (data) => console.log('Emitter 2:', data));

emitter1.emit('sync', 'hello'); // Both handlers fire!
```
