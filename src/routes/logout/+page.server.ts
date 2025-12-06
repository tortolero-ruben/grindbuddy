import { auth } from '@repo/auth';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { applyAuthCookies } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	return {};
};

export const actions: Actions = {
	default: async ({ request, cookies, locals }) => {
		try {
			await auth.api.signOut({ headers: request.headers });
		} catch (error) {
			// ignore sign-out failures; continue clearing local state
		}

		// Manually clear session cookie to be safe
		cookies.delete('ba_session', { path: '/' });

		locals.user = null;
		locals.session = null;

		throw redirect(303, '/login');
	}
};

