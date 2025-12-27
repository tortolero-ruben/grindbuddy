import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

const NEON_AUTH_COOKIE_PREFIX = 'neon_auth';

// Headers to proxy to the upstream Neon Auth service
const PROXY_HEADERS = ['user-agent', 'authorization', 'referer', 'content-type'];

/**
 * Extract Neon Auth cookies from the request headers
 */
function extractNeonAuthCookies(request: Request): string {
	const cookieHeader = request.headers.get('cookie');
	if (!cookieHeader) return '';

	const cookies: string[] = [];
	for (const cookie of cookieHeader.split(';')) {
		const [name] = cookie.trim().split('=');
		if (name?.startsWith(NEON_AUTH_COOKIE_PREFIX)) {
			cookies.push(cookie.trim());
		}
	}
	return cookies.join('; ');
}

/**
 * Get the origin from the request
 */
function getOrigin(request: Request): string {
	return (
		request.headers.get('origin') ||
		request.headers.get('referer')?.split('/').slice(0, 3).join('/') ||
		new URL(request.url).origin
	);
}

/**
 * Handle auth request by proxying to Neon Auth service
 */
async function handleAuthRequest(request: Request, path: string): Promise<Response> {
	const baseUrl = env.NEON_AUTH_BASE_URL;

	if (!baseUrl) {
		console.error('NEON_AUTH_BASE_URL is not set');
		return new Response('Auth service not configured', { status: 500 });
	}

	// Prepare headers for upstream request
	const headers = new Headers();
	for (const header of PROXY_HEADERS) {
		const value = request.headers.get(header);
		if (value) headers.set(header, value);
	}
	headers.set('Origin', getOrigin(request));
	headers.set('Cookie', extractNeonAuthCookies(request));

	// Get request body if present
	let body: string | null = null;
	if (request.method !== 'GET' && request.method !== 'HEAD') {
		try {
			body = await request.text();
		} catch {
			// No body
		}
	}

	// Build upstream URL
	const originalUrl = new URL(request.url);
	const upstreamUrl = new URL(`${baseUrl}/${path}`);
	upstreamUrl.search = originalUrl.search;

	try {
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

		const upstreamResponse = await fetch(upstreamUrl.toString(), {
			method: request.method,
			headers,
			body: body || undefined,
			signal: controller.signal
		});

		clearTimeout(timeoutId);

		// Create response with same status and body
		const responseBody = await upstreamResponse.text();
		const responseHeaders = new Headers();

		// Copy content-type
		const contentType = upstreamResponse.headers.get('content-type');
		if (contentType) {
			responseHeaders.set('content-type', contentType);
		}

		// Handle set-cookie headers (there can be multiple)
		const setCookieHeaders = upstreamResponse.headers.getSetCookie();
		for (const cookie of setCookieHeaders) {
			responseHeaders.append('set-cookie', cookie);
		}

		return new Response(responseBody, {
			status: upstreamResponse.status,
			headers: responseHeaders
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Internal Server Error';
		const isAbort = error instanceof Error && error.name === 'AbortError';
		const isNetwork = error instanceof TypeError && error.message.includes('fetch');

		console.error(`[AuthError] ${message}`, {
			error,
			url: upstreamUrl.toString(),
			isAbort,
			isNetwork
		});

		// Return a more helpful error message
		if (isAbort) {
			return new Response(JSON.stringify({ error: 'Request timeout' }), {
				status: 504,
				headers: { 'content-type': 'application/json' }
			});
		}

		if (isNetwork) {
			return new Response(JSON.stringify({ error: 'Network error connecting to auth service' }), {
				status: 503,
				headers: { 'content-type': 'application/json' }
			});
		}

		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { 'content-type': 'application/json' }
		});
	}
}

export const GET: RequestHandler = async ({ params, request }) => {
	const path = params.path || '';
	return handleAuthRequest(request, path);
};

export const POST: RequestHandler = async ({ params, request }) => {
	const path = params.path || '';
	return handleAuthRequest(request, path);
};
