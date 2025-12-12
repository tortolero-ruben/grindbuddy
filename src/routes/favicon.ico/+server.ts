import type { RequestHandler } from './$types';

// Avoid noisy redirects/logs for browsers requesting /favicon.ico.
export const GET: RequestHandler = () => {
	return new Response(null, {
		status: 204,
		headers: {
			'cache-control': 'public, max-age=86400'
		}
	});
};
