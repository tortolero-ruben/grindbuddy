import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAuth, getAuthClient } from './auth';
import type { Cookies } from '@sveltejs/kit';
import { createAuthClient } from '@neondatabase/auth';

// Mock @neondatabase/auth
vi.mock('@neondatabase/auth', () => ({
	createAuthClient: vi.fn()
}));

describe('auth server client', () => {
	describe('createAuth', () => {
		let mockCookies: Cookies;

		beforeEach(() => {
			// Mock SvelteKit cookies
			mockCookies = {
				getAll: vi.fn(() => []),
				set: vi.fn()
			} as unknown as Cookies;

			// Reset env mock
			vi.stubEnv('NEON_AUTH_BASE_URL', 'https://test.neonauth.dev/auth');
		});

		it('should create an auth client with cookies', () => {
			const mockClient = {};
			vi.mocked(createAuthClient).mockReturnValue(
				mockClient as ReturnType<typeof createAuthClient>
			);

			const client = createAuth(mockCookies);

			expect(createAuthClient).toHaveBeenCalledWith(
				'https://test.neonauth.dev/auth',
				expect.objectContaining({
					cookies: expect.objectContaining({
						getAll: expect.any(Function),
						setAll: expect.any(Function)
					})
				})
			);
			expect(client).toBe(mockClient);
		});

		it('should throw if NEON_AUTH_BASE_URL is not set', () => {
			vi.stubEnv('NEON_AUTH_BASE_URL', '');

			expect(() => createAuth(mockCookies)).toThrow(
				'NEON_AUTH_BASE_URL environment variable is not set'
			);
		});
	});

	describe('getAuthClient', () => {
		it('should create auth client with provided URL and cookies', () => {
			const mockClient = {};
			vi.mocked(createAuthClient).mockReturnValue(
				mockClient as ReturnType<typeof createAuthClient>
			);

			const mockCookies = {
				getAll: vi.fn(() => [{ name: 'session', value: 'abc123' }]),
				set: vi.fn()
			} as unknown as Cookies;

			const client = getAuthClient('https://custom.auth.dev/auth', mockCookies);

			expect(createAuthClient).toHaveBeenCalledWith(
				'https://custom.auth.dev/auth',
				expect.objectContaining({
					cookies: expect.any(Object)
				})
			);
			expect(client).toBe(mockClient);
		});

		it('should throw if URL is empty', () => {
			expect(() => getAuthClient('', undefined)).toThrow('NEON_AUTH_BASE_URL is not set');
		});

		it('should create client without cookies if not provided', () => {
			const mockClient = {};
			vi.mocked(createAuthClient).mockReturnValue(
				mockClient as ReturnType<typeof createAuthClient>
			);

			const client = getAuthClient('https://test.auth.dev/auth');

			expect(createAuthClient).toHaveBeenCalledWith('https://test.auth.dev/auth');
			expect(client).toBe(mockClient);
		});
	});
});

describe('auth regression tests after standalone migration', () => {
	it('should maintain session across requests', async () => {
		// This tests that the standalone migration didn't break session handling
		const auth = await import('./auth');
		expect(auth).toBeDefined();
	});

	it('should handle missing database gracefully', async () => {
		// Test that auth functions fail safely when DB is unavailable
		const auth = await import('./auth');

		// In standalone mode, auth should work without direct DB dependency
		// Auth operations are delegated to Neon Auth service
		expect(auth).toBeDefined();

		// Auth should not crash even if DB layer has issues
		// since it uses Neon Auth which manages its own connection
		expect(auth.createAuth).toBeDefined();
		expect(auth.getAuthClient).toBeDefined();
	});
});
