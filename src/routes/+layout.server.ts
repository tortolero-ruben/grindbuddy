import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getProblems, getLogs } from '$lib/server/db';

const isPublicRoute = (pathname: string) =>
	pathname.startsWith('/login') ||
	pathname.startsWith('/register') ||
	pathname.startsWith('/api/auth');

export const load: LayoutServerLoad = async ({ locals, url }) => {
	if (!locals.user && !isPublicRoute(url.pathname)) {
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(302, `/login?redirectTo=${redirectTo}`);
	}

	const problems = await getProblems();
	const logs = locals.user ? await getLogs(locals.user.id) : [];

	return {
		user: locals.user,
		problems: problems as any,
		logs: logs as any
	};
};

