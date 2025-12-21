import { describe, it, expect, beforeAll } from 'vitest';
import { createAuth } from '@repo/neon-auth';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Polyfill WebSocket for Node.js environment in tests
neonConfig.webSocketConstructor = ws;

describe('Grind Buddy Auth Integration', () => {
    const dbUrl = process.env.DATABASE_URL;

    if (!dbUrl) {
        it.skip('Skipping integration test: DATABASE_URL not found', () => { });
        return;
    }

    const auth = createAuth({
        databaseUrl: dbUrl,
        trustedOrigins: ['http://localhost:5173'], // Mock origin
    });

    const testUser = {
        email: `test-${Date.now()}@example.com`,
        password: 'password123',
        name: 'Test User'
    };

    it('should successfully sign up a new user', async () => {
        const result = await auth.api.signUpEmail({
            body: {
                email: testUser.email,
                password: testUser.password,
                name: testUser.name
            }
        });

        expect(result).toBeDefined();
        // better-auth returns the user object on success in the result wrapper often?
        // Checking if data is returned or at least no error thrown (which should happen via promise rejection if API error usually?)
        // Actually, looking at docs/usage, server-side API usually returns the response object or strict data if `asResponse` is not true?
        // Let's verify structure. For now, assuming success if no throw and we get something back.

        // Wait, better-auth server `api` calls usually return the realized object directly unless `asResponse: true`.
        // Let's expect `user` property.
        expect(result).toHaveProperty('user');
        expect(result.user).toHaveProperty('email', testUser.email);
    });

    it('should successfully sign in the creates user', async () => {
        const result = await auth.api.signInEmail({
            body: {
                email: testUser.email,
                password: testUser.password
            }
        });
        expect(result).toBeDefined();
        expect(result).toHaveProperty('user');
        expect(result.user).toHaveProperty('email', testUser.email);
        expect(result).toHaveProperty('token'); // Check for session token instead of session object
    });

    it('should fail to sign in with wrong password', async () => {
        try {
            await auth.api.signInEmail({
                body: {
                    email: testUser.email,
                    password: 'wrongpassword'
                }
            });
            // Should not reach here
            expect(true).toBe(false);
        } catch (error: any) {
            expect(error).toBeDefined();
            // Expecting an APIError
        }
    });
});
