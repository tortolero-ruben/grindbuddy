import { env } from '$env/dynamic/public';
import { createAuthClient } from 'better-auth/svelte';

export const authClient = createAuthClient({
	baseURL: env.PUBLIC_AUTH_URL || undefined
});

export const { signIn, signUp, signOut, useSession } = authClient;


