import { svelteKitHandler } from 'better-auth/svelte-kit';
import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '@repo/auth';

export const handle: Handle = async ({ event, resolve }) => {
	// Fix origin and URL if behind Traefik/proxy (for CSRF protection)
	const forwardedHost = event.request.headers.get('x-forwarded-host');
	const forwardedProto = event.request.headers.get('x-forwarded-proto');
	
	if (forwardedHost && forwardedProto) {
		const origin = `${forwardedProto}://${forwardedHost}`;
		
		// Update headers for CSRF check
		event.request.headers.set('origin', origin);
		event.request.headers.set('host', forwardedHost);
		
		// Update the URL object to match the forwarded host/proto
		// This is critical for SvelteKit's CSRF protection
		event.url = new URL(
			event.url.pathname + event.url.search,
			origin
		);
	}

	if (!building) {
		const session = await auth.api.getSession({ headers: event.request.headers });
		event.locals.session = session?.session ?? null;
		event.locals.user = session?.user ?? null;
	} else {
		event.locals.session = null;
		event.locals.user = null;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};
