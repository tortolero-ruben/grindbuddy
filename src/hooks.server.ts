import { getSession } from "$lib/server/auth-api";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
	// Skip session fetch for auth API requests to prevent infinite recursion
	if (!event.url.pathname.startsWith("/api/auth")) {
		// Fetch current session via auth proxy
		const session = await getSession(event.request.headers, event.fetch);

		// Make session and user available on server
		if (session) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	}

	return resolve(event);
};
