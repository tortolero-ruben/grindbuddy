import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		// adapter-node is used for Node.js environments (like Docker containers)
		// See https://svelte.dev/docs/kit/adapter-node for more information
		adapter: adapter(),
		// Configure CSRF protection
		// Get allowed origins from environment variable (comma-separated)
		// Railway provides RAILWAY_PUBLIC_DOMAIN automatically
		csrf: {
			// Build trusted origins from multiple sources:
			// 1. ALLOWED_ORIGINS - custom domains (comma-separated)
			// 2. RAILWAY_PUBLIC_DOMAIN - Railway's internal domain (e.g., grindbuddy-production.up.railway.app)
			// 3. Extract public Railway domain from internal domain (e.g., grindbuddy.railway.app)
			// 4. Always include localhost for local development
			trustedOrigins: (() => {
				const origins = new Set();

				// Add custom origins from ALLOWED_ORIGINS
				const allowedOrigins = process.env.ALLOWED_ORIGINS || '';
				if (allowedOrigins) {
					allowedOrigins.split(',').forEach((o) => {
						const trimmed = o.trim();
						if (trimmed) origins.add(trimmed);
					});
				}

				// Handle Railway domains
				const railwayPublicDomain = process.env.RAILWAY_PUBLIC_DOMAIN;
				if (railwayPublicDomain) {
					// Add the internal Railway domain (e.g., grindbuddy-production.up.railway.app)
					origins.add(railwayPublicDomain.startsWith('http') ? railwayPublicDomain : `https://${railwayPublicDomain}`);

					// Extract project name and add public Railway domain (e.g., grindbuddy.railway.app)
					// Format: {project}-{env}.up.railway.app -> {project}.railway.app
					const match = railwayPublicDomain.match(/^([^.]+)-[^.]+\.up\.railway\.app$/);
					if (match) {
						const projectName = match[1];
						origins.add(`https://${projectName}.railway.app`);
					}
				}

				// Always include localhost for development
				origins.add('http://localhost:3000');
				origins.add('http://localhost:8080');

				return Array.from(origins);
			})()
		}
	}
};

export default config;
