import { signUpWithEmail, auth } from '@repo/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { setSessionCookie } from '$lib/server/auth';
export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals, url }) => {
		const form = await request.formData();
		const name = (form.get('name')?.toString() ?? '').trim();
		const email = (form.get('email')?.toString() ?? '').trim().toLowerCase();
		const password = (form.get('password')?.toString() ?? '');

		if (!name || !email || !password) {
			return fail(400, { email, name, message: 'Name, email, and password are required.' });
		}

		try {
			// 1. Sign Up
			const signUpResponse = await signUpWithEmail(
				{ name, email, password },
				request.headers
			);

			// Debug the response
			console.log('DEBUG: signUpResponse:', signUpResponse);

			// Check if we got a token from signup
			let sessionToken = (signUpResponse as any)?.token;
			let user = (signUpResponse as any)?.user;

			// 2. If no token or we want to be sure, trying to sign in
			// But if signUp returned a token, we should trust it for performance.
			// If email verification is mandatory, signIn might fail without it.
			// But signUp response usually indicates what happened.

			if (!sessionToken) {
				// Try auto sign-in
				const signInResponse = await auth.api.signInEmail({
					body: { email, password },
					headers: request.headers
				});
				sessionToken = (signInResponse as any)?.token;
				user = (signInResponse as any)?.user;
			}

			if (sessionToken) {
				// Manually set the cookie
				setSessionCookie(cookies, sessionToken);
				locals.user = user;
				// locals.session = ... we don't have the full session object maybe, but the cookie is key
			} else {
				console.error('Failed to get session token after signup/signin');
				// We still redirect, but maybe with a warning? 
				// Or we throw 500?
				// Let's assume successful creation but require login if no token.
				throw redirect(303, '/login?message=account_created_please_login');
			}

		} catch (error: any) {
			console.error('signup exception', error);

			if (error?.body?.code === 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL') {
				return fail(422, { email, name, message: 'User already exists. Please use another email.' });
			}

			// Redirects are errors in SvelteKit
			if (error?.status && error.status >= 300 && error.status < 400) {
				throw error;
			}

			return fail(500, { email, name, message: error?.body?.message || 'Registration failed. Please try again.' });
		}

		// If we get here, success.
		throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
	}
};
