import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getProblems, getLogs } from '$lib/server/db';

const isPublicRoute = (pathname: string) =>
	pathname === '/' ||
	pathname.startsWith('/login') ||
	pathname.startsWith('/register') ||
	pathname.startsWith('/api/auth') ||
	pathname === '/api/health' ||
	pathname === '/favicon.ico' ||
	pathname === '/robots.txt';

export const load: LayoutServerLoad = async ({ locals, url, depends }) => {
	// Add dependency on user to prevent unnecessary reloads when user doesn't change
	depends('app:user');
	
	if (!locals.user && !isPublicRoute(url.pathname)) {
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(302, `/login?redirectTo=${redirectTo}`);
	}

	// Only fetch problems and logs for authenticated routes
	// Public routes like /login don't need this data
	const isPublic = isPublicRoute(url.pathname);

	let problems: Awaited<ReturnType<typeof getProblems>> = [];
	let logs: Awaited<ReturnType<typeof getLogs>> = [];

	if (!isPublic) {
		// Fetch problems and logs in parallel for better performance
		const [problemsResult, logsResult] = await Promise.allSettled([
			getProblems().catch(error => {
				console.error('Failed to fetch problems:', error);
				return [];
			}),
			locals.user 
				? getLogs(locals.user.id).catch(error => {
					console.error('Failed to fetch logs:', error);
					return [];
				  })
				: Promise.resolve([])
		]);

		if (problemsResult.status === 'fulfilled') {
			problems = problemsResult.value;
		}

		if (logsResult.status === 'fulfilled') {
			logs = logsResult.value;
		}
	}

	return {
		user: locals.user,
		problems,
		logs
	};
};
