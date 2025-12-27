// Mock environment variables for testing
// Use getter to make it dynamic and respect vi.stubEnv changes
export const env = new Proxy({} as Record<string, string>, {
	get(_target, prop: string) {
		return process.env[prop] || '';
	}
});

export const PRIVATE_BASE_URL = env.NEON_AUTH_BASE_URL;
