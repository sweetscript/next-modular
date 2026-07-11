import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts', 'modules/**/__tests__/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.ts', 'modules/**/src/**/*.ts'],
      exclude: [
        'src/**/*.d.ts',
        'src/types.ts',
        'modules/**/types/**',
        'modules/**/constants/**',
        'dist/**',
        'cli/**',
        'node_modules/**',
      ],
      all: true,
    },
  },
});

