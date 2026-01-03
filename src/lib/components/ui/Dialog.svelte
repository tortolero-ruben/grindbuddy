<script lang="ts">
	import { browser } from '$app/environment';
	import { viewportStore } from '$lib/stores/viewportStore.svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
		class?: string;
		children: any;
	}

	let { open, onClose, class: className = '', children }: Props = $props();

	// Use viewport store instead of local state
	const isMobile = $derived(viewportStore.isMobile);
	const keyboardOpen = $derived(viewportStore.keyboardOpen);
	const availableHeight = $derived(viewportStore.availableHeight);

	// Calculate modal max-height based on keyboard state
	const modalMaxHeight = $derived.by(() => {
		if (!isMobile) return '90vh';
		if (keyboardOpen) return `${availableHeight - 80}px`; // Leave room for header
		return '85vh'; // Slightly less when keyboard closed
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
			: 'flex items-center justify-center'}"
		role="dialog"
		aria-modal="true"
		onclick={handleBackdropClick}
		onkeydown={handleEscape}
		tabindex="0"
	>
		<div
			class="relative bg-white dark:bg-slate-900 shadow-lg {className || 'max-w-lg'} {isMobile
				? 'w-full'
				: 'w-auto'} mx-4 overflow-y-auto"
			style:max-height={modalMaxHeight}
			class:rounded-t-lg={isMobile}
			class:rounded-b-none={isMobile}
			class:rounded-lg={!isMobile}
			class:mb-0={isMobile}
		>
			<!-- Mobile drag handle indicator -->
			{#if isMobile}
				<div class="flex justify-center pt-3 pb-1">
					<div class="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
				</div>
			{/if}

			{@render children()}
		</div>
	</div>
{/if}
