<script lang="ts">
	import { page } from '$app/state';
	import '../routes/layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import DesktopNav from '$lib/components/nav/DesktopNav.svelte';
	import MobileNav from '$lib/components/nav/MobileNav.svelte';
	import ProblemSearchModal from '$lib/components/modals/ProblemSearchModal.svelte';
	import LogDetailsModal from '$lib/components/modals/LogDetailsModal.svelte';
	import { logsStore, closeSearchModal, closeLogModal, closeDetailsModal, initializeStores, updateLogs } from '$lib/stores/logsStore';
	import ProblemDetailsModal from '$lib/components/modals/ProblemDetailsModal.svelte';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	
	let initialized = $state(false);
	
	// Initialize stores only once on mount
	$effect(() => {
		if (!initialized && data.problems && data.logs) {
			initializeStores({ problems: data.problems, logs: data.logs });
			initialized = true;
		}
	});

	const isAuthRoute = $derived(
		page.url.pathname.startsWith('/login') || page.url.pathname.startsWith('/register')
	);
	
	const isHome = $derived(page.url.pathname === '/');
</script>

<ModeWatcher defaultMode="light" />

<div
	class="min-h-screen bg-background text-foreground transition-colors duration-300 relative font-sans"
>
	<div class="fixed inset-0 bg-noise pointer-events-none z-0"></div>
	
	<div class="relative z-10">
		{#if !isAuthRoute && !isHome}
			<DesktopNav user={data.user} />
			<MobileNav user={data.user} />
		{/if}

		<main class={isAuthRoute ? 'py-12' : isHome ? '' : 'pt-16 pb-16 md:pb-0'}>
			{@render children()}
		</main>
	</div>
</div>

{#if !isAuthRoute && !isHome}
	<ProblemSearchModal open={logsStore.isSearchModalOpen} onClose={closeSearchModal} />
	<LogDetailsModal open={logsStore.isLogModalOpen} onClose={closeLogModal} />
	<ProblemDetailsModal open={logsStore.isDetailsModalOpen} onClose={closeDetailsModal} problem={logsStore.selectedDetailsProblem} />
{/if}
