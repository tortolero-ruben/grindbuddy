import { signOut } from '$lib/server/auth-api';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	throw redirect(303, '/dashboard');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		await signOut(request.headers);

		locals.user = null;
		locals.session = null;

		throw redirect(303, '/login');
	}
};
