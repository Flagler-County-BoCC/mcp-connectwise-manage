import { afterEach, vi } from 'vitest';

// Node.js >=22 built-in — avoids dotenv devDependency
if (typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile('.env.test');
  } catch {
    // .env.test missing is not fatal in CI environments
  }
}

afterEach(() => {
  vi.restoreAllMocks();
});
