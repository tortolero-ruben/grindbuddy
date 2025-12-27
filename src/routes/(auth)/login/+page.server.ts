import { signInEmail } from '$lib/server/auth-api';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim().toLowerCase();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { email, message: 'Email and password are required.' });
		}

		try {
			const result = await signInEmail({ email, password });

			if (result?.user) {
				// If successful, redirect. Cookies are set by the auth proxy.
				throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
			}

			// If we get here, sign in failed
			return fail(401, { email, message: 'Invalid email or password.' });

		} catch (error) {
			if (error instanceof Error && 'status' in error) {
				// APIError
				return fail(401, { email, message: (error as any).body?.message || error.message });
			}
			if (error instanceof Error) {
				return fail(500, { email, message: error.message });
			}
			return fail(500, { email, message: 'Unable to sign in. Please try again.' });
		}
	}
};
