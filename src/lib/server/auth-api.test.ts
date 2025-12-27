import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getSession, signInEmail, signUpEmail, signOut } from './auth-api';
import { env } from '$env/dynamic/private';

// Define helper for tests
if (typeof (globalThis as any).__vitest_setBrowser !== 'function') {
	(globalThis as any).__vitest_setBrowser = (value: boolean) => {
		(globalThis as any).__vitest_browser = value;
	};
}

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('server auth-api helpers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		process.env.NEON_AUTH_BASE_URL = 'https://test.neonauth.dev/auth';
		vi.resetModules();
		(globalThis as any).__vitest_setBrowser(false);
	});

	describe('getSession', () => {
		it('should call /api/auth/get-session with cookies from headers', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ user: { id: '123', email: 'test@example.com' }, session: { token: 'abc' } })
			} as Response);

			const headers = new Headers({ cookie: 'neon_auth_session=xyz' });
			const result = await getSession(headers);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('/api/auth/get-session'),
				expect.objectContaining({
					headers: expect.objectContaining({
						cookie: 'neon_auth_session=xyz'
					})
				})
			);
			expect(result.user).toEqual({ id: '123', email: 'test@example.com' });
		});

		it('should return null if no session exists', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ user: null, session: null })
			} as Response);

			const headers = new Headers();
			const result = await getSession(headers);

			expect(result.user).toBeNull();
			expect(result.session).toBeNull();
		});

		it('should return null if request fails', async () => {
			mockFetch.mockRejectedValue(new Error('Network error'));

			const headers = new Headers();
			const result = await getSession(headers);

			expect(result).toBeNull();
		});
	});

	describe('signInEmail', () => {
		it('should call /api/auth/sign-in/email with credentials', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ user: { id: '123', email: 'test@example.com' } })
			} as Response);

			const result = await signInEmail({ email: 'test@example.com', password: 'password' });

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('/api/auth/sign-in/email'),
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						'content-type': 'application/json'
					}),
					body: expect.stringContaining('test@example.com')
				})
			);
			expect(result.user).toEqual({ id: '123', email: 'test@example.com' });
		});
	});

	describe('signUpEmail', () => {
		it('should call /api/auth/sign-up/email with credentials', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({ user: { id: '456', email: 'new@example.com', name: 'New User' } })
			} as Response);

			const result = await signUpEmail({ email: 'new@example.com', password: 'password', name: 'New User' });

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('/api/auth/sign-up/email'),
				expect.objectContaining({
					method: 'POST',
					body: expect.stringContaining('new@example.com')
				})
			);
			expect(result.user).toEqual({ id: '456', email: 'new@example.com', name: 'New User' });
		});
	});

	describe('signOut', () => {
		it('should call /api/auth/sign-out with cookies', async () => {
			mockFetch.mockResolvedValue({
				ok: true,
				json: async () => ({})
			} as Response);

			const headers = new Headers({ cookie: 'neon_auth_session=xyz' });
			await signOut(headers);

			expect(mockFetch).toHaveBeenCalledWith(
				expect.stringContaining('/api/auth/sign-out'),
				expect.objectContaining({
					method: 'POST',
					headers: expect.objectContaining({
						cookie: 'neon_auth_session=xyz'
					})
				})
			);
		});
	});
});
