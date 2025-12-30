import { signUpEmail, applyResponseCookies } from '$lib/server/auth-api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, url, fetch, cookies }) => {
		const form = await request.formData();
		const name = (form.get('name')?.toString() ?? '').trim();
		const email = (form.get('email')?.toString() ?? '').trim().toLowerCase();
		const password = (form.get('password')?.toString() ?? '');

		if (!name || !email || !password) {
			return fail(400, { email, name, message: 'Name, email, and password are required.' });
		}

		try {
			console.log('[Register Action] Calling signUpEmail with:', { email, name });
			const result = await signUpEmail({ email, password, name }, fetch);

			console.log('[Register Action] Result:', result ? 'Got result' : 'Result is null');

			if (result?.user && result?.response) {
				// If successful, redirect. Cookies are set by the auth proxy.
				console.log('[Register Action] Success! Propagating cookies and redirecting...');
				applyResponseCookies(cookies, result.response);
				throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
			}

			console.log('[Register Action] Failed - no user in result');
			return fail(500, { email, name, message: 'Registration failed. Please try again.' });

		} catch (error: any) {
			// If it's a redirect, re-throw it (SvelteKit redirects are thrown errors)
			if (error && typeof error === 'object' && 'status' in error && (error.status === 303 || error.status === 302)) {
				throw error;
			}

			// Check for APIError from better-auth
			// Assuming 422 or similar for user exists
			if (error?.body?.message?.includes('already exists') || error?.message?.includes('already exists')) {
				return fail(422, { email, name, message: 'User already exists. Please use another email.' });
			}

			if (error instanceof Error && 'status' in error) {
				// APIError
				return fail(401, { email, name, message: (error as any).body?.message || error.message });
			}

			return fail(500, { email, name, message: (error as Error).message || 'Registration failed. Please try again.' });
		}
	}
};
