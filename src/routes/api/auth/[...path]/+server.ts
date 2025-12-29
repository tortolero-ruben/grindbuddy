import type { RequestHandler } from './$types';
import { env as privateEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

const NEON_AUTH_COOKIE_PREFIX = 'neon-auth';

// Headers to proxy to the upstream Neon Auth service
const PROXY_HEADERS = ['user-agent', 'authorization', 'referer', 'content-type'];

/**
 * Extract Neon Auth cookies from the request headers
 */
function extractNeonAuthCookies(request: Request): string {
	const cookieHeader = request.headers.get('cookie');
	if (!cookieHeader) return '';

	const isLocalhost = new URL(request.url).hostname === 'localhost';
	const cookies = new Map<string, string>();

	for (const cookie of cookieHeader.split(';')) {
		const parts = cookie.trim().split('=');
		let name = parts[0];
		const value = parts.slice(1).join('=');

		// Match both prefixed and non-prefixed cookies (e.g. __Secure-neon-auth and neon-auth)
		if (name?.includes(NEON_AUTH_COOKIE_PREFIX)) {
			// On localhost, we MUST ignore any incoming __Secure- cookies.
			// The browser invalidates them (triggers them as session-only or simply invalid) because we are on HTTP.
			// We only trust the '__-' cookies which we explicitly set for localhost.
			if (isLocalhost && name.startsWith('__Secure-')) {
				continue;
			}

			// If we find a specific non-secure prefix used by Neon Auth for http, upgrade it for the https upstream
			if (name.startsWith('__-')) {
				name = name.replace('__-', '__Secure-');
			}
			cookies.set(name, value);
		}
	}
	return Array.from(cookies.entries())
		.map(([key, value]) => `${key}=${value}`)
		.join('; ');
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
	const baseUrl = privateEnv.NEON_AUTH_BASE_URL || publicEnv.PUBLIC_NEON_AUTH_URL;

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
		const isLocalhost = new URL(request.url).hostname === 'localhost';

		for (let cookie of setCookieHeaders) {
			if (isLocalhost) {
				// If the cookie was originally __Secure-, we need to delete the old one from the browser
				// to prevent conflicts where the browser sends the old __Secure- cookie instead of our new __- one.
				if (cookie.startsWith('__Secure-')) {
					const cookieName = cookie.split('=')[0];
					responseHeaders.append('set-cookie', `${cookieName}=; Max-Age=0; Path=/; SameSite=Lax`);
				}

				// Rename __Secure- to __- so it can be set without Secure flag (browser requirement)
				cookie = cookie.replace('__Secure-', '__-');
				// Strip Secure flag if on localhost, as we are likely on HTTP
				cookie = cookie.replace(/;?\s*Secure/gi, '');
				// SameSite=None requires Secure, so change it to Lax for HTTP
				cookie = cookie.replace(/SameSite=None/gi, 'SameSite=Lax');
			}
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
