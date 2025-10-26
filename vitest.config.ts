import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/types.ts',
        'dist/**',
        'cli/**',
        'node_modules/**',
      ],
      all: true,
      lines: 100,
      functions: 100,
      branches: 95,
      statements: 100,
    },
  },
});

