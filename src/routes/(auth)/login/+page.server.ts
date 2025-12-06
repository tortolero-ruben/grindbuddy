import { auth } from '@repo/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { applyAuthCookies } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals, url }) => {
	if (locals.user) {
		throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
	}

	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals, url }) => {
		const form = await request.formData();
		const email = String(form.get('email') ?? '').trim().toLowerCase();
		const password = String(form.get('password') ?? '');

		if (!email || !password) {
			return fail(400, { email, message: 'Email and password are required.' });
		}

		try {
			const response = await auth.api.signInEmail({
				body: { email, password },
				headers: request.headers
			});

			const payload = await response.json().catch(() => null);

			if (!response.ok) {
				return fail(response.status, {
					email,
					message:
						(payload as { error?: string; message?: string } | null)?.error ??
						(payload as { error?: string; message?: string } | null)?.message ??
						'Invalid credentials.'
				});
			}

			applyAuthCookies(response.headers, cookies);
			locals.user = (payload as { user?: unknown } | null)?.user ?? null;
			locals.session = (payload as { session?: unknown } | null)?.session ?? null;

			throw redirect(303, url.searchParams.get('redirectTo') ?? '/dashboard');
		} catch (error) {
			return fail(500, { email, message: 'Unable to sign in. Please try again.' });
		}
	}
};

