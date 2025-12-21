import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, locals, url }) => {
		const form = await request.formData();
		const name = (form.get('name')?.toString() ?? '').trim();
		const email = (form.get('email')?.toString() ?? '').trim().toLowerCase();
		const password = (form.get('password')?.toString() ?? '');

		if (!name || !email || !password) {
			return fail(400, { email, name, message: 'Name, email, and password are required.' });
		}

		try {
			await auth.api.signUpEmail({
				body: { email, password, name }
			});
			// If successful (no throw), cookies are set by plugin

			throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
		} catch (error: any) {
			// Check for APIError from better-auth
			// Assuming 422 or similar for user exists
			if (error?.body?.message?.includes('already exists') || error?.message?.includes('already exists')) {
				return fail(422, { email, name, message: 'User already exists. Please use another email.' });
			}
			// If it's a redirect, re-throw it (SvelteKit redirects are thrown errors)
			if (error?.status === 303 || (error instanceof Error && error.message.includes('Redirect'))) {
				throw error;
			}

			return fail(500, { email, name, message: (error as Error).message || 'Registration failed. Please try again.' });
		}
	}
};
