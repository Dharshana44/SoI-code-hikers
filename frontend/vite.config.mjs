import { defineConfig } from 'vite'

export default defineConfig({
	server: {
		headers: {
			// allow opener to interact with popups (dev only)
			'Cross-Origin-Opener-Policy': 'same-origin-allow-popups'
		}
	}
})
