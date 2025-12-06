import { parseSetCookieHeader } from 'better-auth/cookies';
import type { Cookies } from '@sveltejs/kit';

export function applyAuthCookies(headers: Headers, cookies: Cookies) {
	const setCookies = headers.get('set-cookie');
	if (!setCookies) return;

	const parsed = parseSetCookieHeader(setCookies);
	for (const [name, { value, ...ops }] of parsed) {
		cookies.set(name, decodeURIComponent(value), {
			sameSite: ops.samesite,
			path: ops.path || '/',
			expires: ops.expires,
			secure: ops.secure,
			httpOnly: ops.httponly,
			domain: ops.domain,
			maxAge: ops['max-age']
		});
	}
}


export function setSessionCookie(cookies: Cookies, token: string, maxAge: number = 604800) {
	cookies.set('ba_session', token, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false, // Set to true in production if https
		maxAge: maxAge, // 7 days by default
		domain: 'localhost'
	});
}
