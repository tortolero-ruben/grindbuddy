import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url, request }) => {
	if (url.searchParams.get('debug') === '1') {
		const headers: Record<string, string> = {};
		for (const [k, v] of request.headers) headers[k] = v;

		return Response.json(
			{
				url: url.toString(),
				origin: url.origin,
				host: request.headers.get('host'),
				originHeader: request.headers.get('origin'),
				referer: request.headers.get('referer'),
				forwardedHost: request.headers.get('x-forwarded-host'),
				forwardedProto: request.headers.get('x-forwarded-proto'),
				headers
			},
			{ status: 200 }
		);
	}

	return new Response('OK', { status: 200 });
};
