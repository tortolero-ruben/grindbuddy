import { browser } from '$app/environment';

interface ViewportState {
	width: number;
	height: number;
	scale: number;
	keyboardOpen: boolean;
	availableHeight: number;
}

const initialState: ViewportState = {
	width: 1080,
	height: 1920,
	scale: 1,
	keyboardOpen: false,
	availableHeight: 1920
};

function createViewportStore() {
	let state = $state<ViewportState>(initialState);

	if (browser) {
		// Initialize from visual viewport
		const viewport = window.visualViewport;
		if (viewport) {
			state.width = viewport.width;
			state.height = viewport.height;
			state.scale = viewport.scale;
			state.availableHeight = viewport.height;
		}

		// Listen for viewport changes (keyboard open/close, resize, zoom)
		const handleResize = () => {
			if (viewport) {
				const oldHeight = state.height;
				state.width = viewport.width;
				state.height = viewport.height;
				state.scale = viewport.scale;
				state.availableHeight = viewport.height;

				// Detect keyboard: height significantly reduced
				const layoutViewport = window.innerHeight;
				state.keyboardOpen = layoutViewport > viewport.height * 1.1;

				// Adjust available height based on keyboard state
				if (state.keyboardOpen) {
					state.availableHeight = viewport.height;
				}
			}
		};

		// Use visual viewport API
		if (viewport) {
			viewport.addEventListener('resize', handleResize);
			// Initial call
			handleResize();
		}

		// Fallback: window resize (less accurate but covers some cases)
		window.addEventListener('resize', handleResize);
	}

	return {
		get width() {
			return state.width;
		},
		get height() {
			return state.height;
		},
		get scale() {
			return state.scale;
		},
		get keyboardOpen() {
			return state.keyboardOpen;
		},
		get availableHeight() {
			return state.availableHeight;
		},
		get isMobile() {
			return state.width < 640;
		}
	};
}

export const viewportStore = createViewportStore();

