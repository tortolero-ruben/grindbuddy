import { auth } from '$lib/server/auth';
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
			const result = await auth.api.signInEmail({
				body: { email, password }
				// sveltekitCookies plugin handles cookies via getRequestEvent
			});

			if (result?.user) {
				// If successful, just redirect. The cookies should be set by the plugin.
				throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
			}

			// Should not be reached if successful usually returns strict object or throws?
			// better-auth throws on error? No, usually returns object if not passing proper generic.
			// But let's check basic API.
			// Actually, if it returns { user, session }, it's success.

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
