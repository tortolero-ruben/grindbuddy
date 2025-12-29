import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUpEmail } from './auth-api';

describe('auth-api - registration', () => {
	let mockFetch: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockFetch = vi.fn();
	});

	// RED - Write failing test showing what should happen
	it('should use the provided fetch function when calling sign-up endpoint', async () => {
		const credentials = {
			email: 'test@example.com',
			password: 'password123',
			name: 'Test User'
		};

		// Mock successful response
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => ({
				user: { id: '123', email: credentials.email, name: credentials.name },
				session: { token: 'abc123' }
			})
		});

		// Call signUpEmail with our mock fetch
		const result = await signUpEmail(credentials, mockFetch);

		// Verify the fetch was called correctly
		expect(mockFetch).toHaveBeenCalledTimes(1);
		expect(mockFetch).toHaveBeenCalledWith(
			expect.stringContaining('/sign-up/email'),
			expect.objectContaining({
				method: 'POST',
				headers: expect.objectContaining({
					'content-type': 'application/json'
				}),
				body: JSON.stringify(credentials)
			})
		);

		// Verify result
		expect(result).not.toBeNull();
		expect(result?.user.email).toBe(credentials.email);
	});

	it('should return null when sign-up fails', async () => {
		const credentials = {
			email: 'test@example.com',
			password: 'password123',
			name: 'Test User'
		};

		// Mock failed response
		mockFetch.mockResolvedValueOnce({
			ok: false,
			statusText: 'Conflict',
			text: async () => 'User already exists'
		});

		// Call signUpEmail with our mock fetch
		const result = await signUpEmail(credentials, mockFetch);

		// Verify null is returned on failure
		expect(result).toBeNull();
	});

	it('should return null when fetch throws an error', async () => {
		const credentials = {
			email: 'test@example.com',
			password: 'password123',
			name: 'Test User'
		};

		// Mock network error
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		// Call signUpEmail with our mock fetch
		const result = await signUpEmail(credentials, mockFetch);

		// Verify null is returned on error
		expect(result).toBeNull();
	});
});
