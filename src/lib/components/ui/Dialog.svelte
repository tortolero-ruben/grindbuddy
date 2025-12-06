<script lang="ts">
	import { browser } from '$app/environment';

	interface Props {
		open: boolean;
		onClose: () => void;
		class?: string;
		children: any;
	}

	let { open, onClose, class: className = '', children }: Props = $props();

	let isMobile = $state(false);

	$effect(() => {
		if (browser) {
			isMobile = window.innerWidth < 640;
			const handleResize = () => {
				isMobile = window.innerWidth < 640;
			};
			window.addEventListener('resize', handleResize);
			return () => window.removeEventListener('resize', handleResize);
		}
	});

	$effect(() => {
		if (!browser) return;
		document.body.style.overflow = open ? 'hidden' : '';
	});

	function handleBackdropClick(e: MouseEvent) {
		if (e.currentTarget === e.target) onClose();
	}

	function handleEscape(e: KeyboardEvent) {
		if (e.key === 'Escape') onClose();
	}
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm {isMobile
			? 'flex items-end justify-center'
			: 'flex items-center justify-center'} {className}"
		role="dialog"
		aria-modal="true"
		onclick={handleBackdropClick}
		onkeydown={handleEscape}
		tabindex="0"
	>
		<div
			class="relative bg-white dark:bg-slate-900 rounded-lg shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto {isMobile
				? 'rounded-t-lg rounded-b-none mb-0'
				: ''}"
		>
			{@render children()}
		</div>
	</div>
{/if}

