import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from './+server';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('auth proxy endpoint', () => {
	const mockRequest = (url: string, options?: RequestInit) =>
		new Request(url, options) as unknown as Request;

	beforeEach(() => {
		vi.clearAllMocks();
		// Reset env mock for each test
		process.env.NEON_AUTH_BASE_URL = 'https://test.neonauth.dev/auth';
	});

	describe('GET', () => {
		it('should forward GET requests to Neon Auth', async () => {
			mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			}) as unknown as Response);

			const response = await GET({
				request: mockRequest('http://localhost:5173/api/auth/sign-in'),
				params: { path: 'sign-in' }
			});

			expect(mockFetch).toHaveBeenCalled();
			expect(response.status).toBe(200);
		});

		it('should preserve query parameters', async () => {
			mockFetch.mockResolvedValue(new Response(JSON.stringify({}), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			}) as unknown as Response);

			await GET({
				request: mockRequest('http://localhost:5173/api/auth/callback?code=test'),
				params: { path: 'callback' }
			});

			const url = mockFetch.mock.calls[0][0] as string;
			expect(url).toContain('?code=test');
		});

		it('should return 500 if NEON_AUTH_BASE_URL is not set', async () => {
			delete process.env.NEON_AUTH_BASE_URL;

			const response = await GET({
				request: mockRequest('http://localhost:5173/api/auth/sign-in'),
				params: { path: 'sign-in' }
			});

			expect(response.status).toBe(500);
		});

		it('should forward cookies from request', async () => {
			mockFetch.mockResolvedValue(new Response(JSON.stringify({}), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			}) as unknown as Response);

			const request = new Request('http://localhost:5173/api/auth/sign-in', {
				headers: { 'cookie': 'neon_auth_session=abc123' }
			}) as unknown as Request;

			await GET({
				request,
				params: { path: 'sign-in' }
			});

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect(options?.headers).toBeDefined();
		});
	});

	describe('POST', () => {
		it('should forward POST requests to Neon Auth', async () => {
			mockFetch.mockResolvedValue(new Response(JSON.stringify({ success: true }), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			}) as unknown as Response);

			const request = new Request('http://localhost:5173/api/auth/sign-in', {
				method: 'POST',
				body: JSON.stringify({ email: 'test@example.com', password: 'password' }),
				headers: { 'content-type': 'application/json' }
			}) as unknown as Request;

			const response = await POST({
				request,
				params: { path: 'sign-in' }
			});

			expect(mockFetch).toHaveBeenCalled();
			expect(response.status).toBe(200);
		});

		it('should forward request body', async () => {
			mockFetch.mockResolvedValue(new Response(JSON.stringify({}), {
				status: 200,
				headers: { 'content-type': 'application/json' }
			}) as unknown as Response);

			const request = new Request('http://localhost:5173/api/auth/sign-up', {
				method: 'POST',
				body: JSON.stringify({ email: 'new@example.com' }),
				headers: { 'content-type': 'application/json' }
			}) as unknown as Request;

			await POST({
				request,
				params: { path: 'sign-up' }
			});

			const options = mockFetch.mock.calls[0][1] as RequestInit;
			expect(options?.body).toContain('new@example.com');
		});

		it('should return 500 if NEON_AUTH_BASE_URL is not set', async () => {
			delete process.env.NEON_AUTH_BASE_URL;

			const request = new Request('http://localhost:5173/api/auth/sign-in', {
				method: 'POST'
			}) as unknown as Request;

			const response = await POST({
				request,
				params: { path: 'sign-in' }
			});

			expect(response.status).toBe(500);
		});
	});
});
