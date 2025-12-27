import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => {
    // Load env file based on `mode` in the current working directory.
    // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
    const env = loadEnv(mode, process.cwd(), '');

    return {
        resolve: {
            alias: {
                '$env/dynamic/private': path.resolve(__dirname, './src/lib/test/mocks/env.ts'),
                '$env/static/private': path.resolve(__dirname, './src/lib/test/mocks/env.ts'),
                '$env/dynamic/public': path.resolve(__dirname, './src/lib/test/mocks/env.ts'),
                '$env/static/public': path.resolve(__dirname, './src/lib/test/mocks/env.ts'),
                '$app/environment': path.resolve(__dirname, './src/lib/test/mocks/environment.ts'),
            }
        },
        test: {
            environment: 'node',
            include: ['src/**/*.{test,spec}.{js,ts}'],
            env: env // Pass loaded env to tests
        }
    };
});
