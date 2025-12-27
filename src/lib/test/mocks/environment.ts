// Mock $app/environment for testing
// Read from globalThis to allow test control
export const browser = (globalThis as any).__vitest_browser ?? true; // Default to true for tests
export const dev = true;
export const building = false;

// Helper for tests to set browser state (defined on globalThis so it persists)
if (typeof (globalThis as any).__vitest_setBrowser !== 'function') {
	(globalThis as any).__vitest_setBrowser = (value: boolean) => {
		(globalThis as any).__vitest_browser = value;
	};
}
