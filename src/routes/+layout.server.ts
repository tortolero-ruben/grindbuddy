import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

const isPublicRoute = (pathname: string) =>
	pathname.startsWith('/login') ||
	pathname.startsWith('/register') ||
	pathname.startsWith('/api/auth');

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user && !isPublicRoute(url.pathname)) {
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(302, `/login?redirectTo=${redirectTo}`);
	}

	return {
		user: locals.user
	};
};

