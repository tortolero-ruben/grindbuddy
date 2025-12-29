import { env } from '$env/dynamic/private';
import { parse } from 'set-cookie-parser';

const API_BASE = '/api/auth';

/**
 * Apply cookies from an API response to the SvelteKit cookies object
 */
export function applyResponseCookies(cookies: any, response: Response) {
	try {
		const setCookieHeaders = response.headers.getSetCookie();
		if (setCookieHeaders.length === 0) return;

		const parsed = parse(setCookieHeaders);
		for (const c of parsed) {
			// Skip deletion cookies (Max-Age=0) that the auth proxy uses to clear old cookies
			if (c.maxAge === 0) {
				continue;
			}

			const { name, value, ...options } = c;

			// Normalize sameSite to lowercase if it's a string
			let sameSite = options.sameSite;
			if (typeof sameSite === 'string') {
				sameSite = sameSite.toLowerCase() as any;
			}

			// Map set-cookie attributes to SvelteKit cookie options
			// Note: SvelteKit doesn't support 'partitioned' attribute, so we filter it out
			const { partitioned, ...cookieOptions } = options as any;
			cookies.set(name, value, {
				path: cookieOptions.path || '/',
				expires: cookieOptions.expires,
				maxAge: cookieOptions.maxAge,
				sameSite: sameSite as any,
				httpOnly: cookieOptions.httpOnly,
				secure: cookieOptions.secure
			});
		}
	} catch (error) {
		console.error('[applyResponseCookies] Error setting cookies:', error);
	}
}


/**
 * Get the current session from cookies
 * Calls /api/auth/get-session endpoint
 */
export async function getSession(
	headers: Headers,
	fetchFn: typeof fetch = fetch
): Promise<{ user: any; session: any } | null> {
	try {
		const response = await fetchFn(`${API_BASE}/get-session`, {
			headers: {
				cookie: headers.get('cookie') || ''
			}
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return data;
	} catch {
		return null;
	}
}

/**
 * Sign in with email and password
 * Calls /api/auth/sign-in/email endpoint
 */
export async function signInEmail(
	credentials: {
		email: string;
		password: string;
	},
	fetchFn: typeof fetch = fetch
): Promise<{ user: any; session: any; response: Response } | null> {
	try {
		const response = await fetchFn(`${API_BASE}/sign-in/email`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(credentials)
		});

		if (!response.ok) {
			return null;
		}

		const data = await response.json();
		return { ...data, response };
	} catch {
		return null;
	}
}

/**
 * Sign up with email and password
 * Calls /api/auth/sign-up/email endpoint
 */
export async function signUpEmail(
	credentials: {
		email: string;
		password: string;
		name?: string;
	},
	fetchFn: typeof fetch = fetch
): Promise<{ user: any; session: any; response: Response } | null> {
	try {
		console.log('[auth-api] Calling sign-up with:', { email: credentials.email, name: credentials.name });
		const response = await fetchFn(`${API_BASE}/sign-up/email`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(credentials)
		});

		console.log('[auth-api] Response status:', response.status, response.statusText);
		console.log('[auth-api] Response ok:', response.ok);

		if (!response.ok) {
			const body = await response.text();
			console.log('[auth-api] Non-ok response body:', body);
			return null;
		}

		const data = await response.json();
		console.log('[auth-api] Success! Got user:', data.user?.email);
		return { ...data, response };
	} catch (error) {
		console.error('[auth-api] Error:', error);
		return null;
	}
}

/**
 * Sign out current user
 * Calls /api/auth/sign-out endpoint
 */
export async function signOut(
	headers: Headers,
	fetchFn: typeof fetch = fetch
): Promise<void> {
	try {
		await fetchFn(`${API_BASE}/sign-out`, {
			method: 'POST',
			headers: {
				cookie: headers.get('cookie') || ''
			}
		});
	} catch {
		// Ignore errors on sign out
	}
}
