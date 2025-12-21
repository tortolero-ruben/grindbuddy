import { createAuth } from "@repo/neon-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
import { DATABASE_URL } from "$env/static/private";

export const auth = createAuth({
	databaseUrl: DATABASE_URL,
	trustedOrigins: ["http://localhost:5173"], // TODO: Add production URL
	plugins: [sveltekitCookies(getRequestEvent)]
});
