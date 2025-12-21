import { createAuthClient } from '@neondatabase/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		try {
			const neonAuthUrl = env.NEON_AUTH_BASE_URL;
			if (neonAuthUrl) {
				const auth = createAuthClient(neonAuthUrl);
				await auth.signOut({ headers: request.headers });
			}
		} catch (error) {
			// ignore sign-out failures; continue clearing local state
		}

		// Clear session cookies
		cookies.delete('neon_auth_session', { path: '/' });
		cookies.delete('neon_auth_token', { path: '/' });

		locals.user = null;
		locals.session = null;

		throw redirect(303, '/login');
	}
};

