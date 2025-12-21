import { createAuthClient } from '@neondatabase/auth';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ request, params }) => {
	const neonAuthUrl = env.NEON_AUTH_BASE_URL;
	if (!neonAuthUrl) {
		return json({ error: 'Auth not configured' }, { status: 500 });
	}

	const auth = createAuthClient(neonAuthUrl);
	const path = params.path || '';
	
	// Forward the request to Neon Auth
	const url = new URL(`${neonAuthUrl}/${path}${request.url.split('?')[1] ? '?' + request.url.split('?')[1] : ''}`);
	const response = await fetch(url.toString(), {
		method: 'GET',
		headers: request.headers,
	});

	return new Response(response.body, {
		status: response.status,
		headers: response.headers,
	});
};

export const POST: RequestHandler = async ({ request, params }) => {
	const neonAuthUrl = env.NEON_AUTH_BASE_URL;
	if (!neonAuthUrl) {
		return json({ error: 'Auth not configured' }, { status: 500 });
	}

	const auth = createAuthClient(neonAuthUrl);
	const path = params.path || '';
	
	// Forward the request to Neon Auth
	const url = new URL(`${neonAuthUrl}/${path}`);
	const body = await request.text();
	const response = await fetch(url.toString(), {
		method: 'POST',
		headers: request.headers,
		body: body || undefined,
	});

	return new Response(response.body, {
		status: response.status,
		headers: response.headers,
	});
};

