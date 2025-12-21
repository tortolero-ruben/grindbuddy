import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	process.env = { ...process.env, ...env };

	return {
		plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
		server: {
			host: true,
			port: Number(process.env.PORT) || 5173
		},
		preview: {
			host: true,
			port: Number(process.env.PORT) || 5173
		}
	};
});
