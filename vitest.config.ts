
import { configDefaults, defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    include: [...configDefaults.include, '**/__tests__/*.spec.ts'],
    passWithNoTests: true,
    testTimeout: 10_000,
    coverage: {
      provider: 'v8',
      include: ['src/mini-signals.ts', 'src/mini-signals-emitter.ts', 'src/mini-signals-utils.ts'],
    }
  }
});
