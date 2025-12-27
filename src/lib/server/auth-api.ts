import { env } from '$env/dynamic/private';

const API_BASE = '/api/auth';

/**
 * Get the current session from cookies
 * Calls /api/auth/get-session endpoint
 */
export async function getSession(headers: Headers): Promise<{ user: any; session: any } | null> {
	try {
		const response = await fetch(`${API_BASE}/get-session`, {
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
export async function signInEmail(credentials: {
	email: string;
	password: string;
}): Promise<{ user: any; session: any } | null> {
	try {
		const response = await fetch(`${API_BASE}/sign-in/email`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(credentials)
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch {
		return null;
	}
}

/**
 * Sign up with email and password
 * Calls /api/auth/sign-up/email endpoint
 */
export async function signUpEmail(credentials: {
	email: string;
	password: string;
	name?: string;
}): Promise<{ user: any; session: any } | null> {
	try {
		const response = await fetch(`${API_BASE}/sign-up/email`, {
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(credentials)
		});

		if (!response.ok) {
			return null;
		}

		return await response.json();
	} catch {
		return null;
	}
}

/**
 * Sign out current user
 * Calls /api/auth/sign-out endpoint
 */
export async function signOut(headers: Headers): Promise<void> {
	try {
		await fetch(`${API_BASE}/sign-out`, {
			method: 'POST',
			headers: {
				cookie: headers.get('cookie') || ''
			}
		});
	} catch {
		// Ignore errors on sign out
	}
}
