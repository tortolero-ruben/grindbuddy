import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createAuthClient } from '@neondatabase/auth';

// Mock @neondatabase/auth
vi.mock('@neondatabase/auth', () => ({
	createAuthClient: vi.fn()
}));

// Define persistent helper for setting browser state
if (typeof (globalThis as any).__vitest_setBrowser !== 'function') {
	(globalThis as any).__vitest_setBrowser = (value: boolean) => {
		(globalThis as any).__vitest_browser = value;
	};
}

describe('auth browser client', () => {
	beforeEach(async () => {
		// Reset modules to force re-import with new browser state
		vi.resetModules();
		// Reset mock
		vi.clearAllMocks();
		// Set default browser state (using persistent helper)
		(globalThis as any).__vitest_setBrowser(true);
		vi.stubGlobal('window', {
			location: { origin: 'http://localhost:5173' }
		});
	});

	describe('getAuthClient', () => {
		it('should create auth client using API proxy URL', async () => {
			const { getAuthClient } = await import('./auth-client');
			const mockClient = {
				signIn: vi.fn(),
				signUp: vi.fn(),
				signOut: vi.fn(),
				getSession: vi.fn()
			};
			vi.mocked(createAuthClient).mockReturnValue(mockClient as any);

			const client = getAuthClient();

			expect(createAuthClient).toHaveBeenCalledWith('http://localhost:5173/api/auth');
			expect(client).toBe(mockClient);
		});

		it('should throw if not in browser environment', async () => {
			(globalThis as any).__vitest_setBrowser(false);
			const { getAuthClient } = await import('./auth-client');

			expect(() => getAuthClient()).toThrow('Auth client can only be used in the browser');
		});

		it('should reuse existing client instance', async () => {
			const { getAuthClient } = await import('./auth-client');
			const mockClient = {};
			vi.mocked(createAuthClient).mockReturnValue(mockClient as any);

			const client1 = getAuthClient();
			const client2 = getAuthClient();

			expect(client1).toBe(client2);
			expect(createAuthClient).toHaveBeenCalledTimes(1);
		});
	});

	describe('signIn', () => {
		it('should call signIn on auth client', async () => {
			const { signIn } = await import('./auth-client');
			const mockSignIn = vi.fn().mockResolvedValue({ data: { user: { id: '123' } } });
			vi.mocked(createAuthClient).mockReturnValue({
				signIn: mockSignIn
			} as any);

			const result = await signIn({ email: 'test@example.com', password: 'password' });

			expect(mockSignIn).toHaveBeenCalledWith({
				email: 'test@example.com',
				password: 'password'
			});
			expect(result.data.user.id).toBe('123');
		});
	});

	describe('signUp', () => {
		it('should call signUp on auth client', async () => {
			const { signUp } = await import('./auth-client');
			const mockSignUp = vi.fn().mockResolvedValue({ data: { user: { id: '456' } } });
			vi.mocked(createAuthClient).mockReturnValue({
				signUp: mockSignUp
			} as any);

			const result = await signUp({ email: 'new@example.com', password: 'password' });

			expect(mockSignUp).toHaveBeenCalledWith({
				email: 'new@example.com',
				password: 'password'
			});
			expect(result.data.user.id).toBe('456');
		});
	});

	describe('signOut', () => {
		it('should call signOut on auth client', async () => {
			const { signOut } = await import('./auth-client');
			const mockSignOut = vi.fn().mockResolvedValue({});
			vi.mocked(createAuthClient).mockReturnValue({
				signOut: mockSignOut
			} as any);

			await signOut();

			expect(mockSignOut).toHaveBeenCalled();
		});
	});

	describe('getSession', () => {
		it('should return session from auth client', async () => {
			const { getSession } = await import('./auth-client');
			const mockSession = { user: { id: '789', email: 'test@example.com' } };
			vi.mocked(createAuthClient).mockReturnValue({
				getSession: vi.fn(() => mockSession)
			} as any);

			const session = getSession();

			expect(session).toEqual(mockSession);
		});

		it('should return null if not in browser', async () => {
			(globalThis as any).__vitest_setBrowser(false);
			const { getSession } = await import('./auth-client');

			const session = getSession();

			expect(session).toBeNull();
		});

		it('should return null if getSession throws', async () => {
			const { getSession } = await import('./auth-client');
			vi.mocked(createAuthClient).mockReturnValue({
				getSession: vi.fn(() => {
					throw new Error('No session');
				})
			} as any);

			const session = getSession();

			expect(session).toBeNull();
		});
	});
});
