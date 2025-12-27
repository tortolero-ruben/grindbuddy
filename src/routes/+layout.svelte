<script lang="ts">
	import { page } from '$app/stores';
	import '../routes/layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import DesktopNav from '$lib/components/nav/DesktopNav.svelte';
	import MobileNav from '$lib/components/nav/MobileNav.svelte';
	import ProblemSearchModal from '$lib/components/modals/ProblemSearchModal.svelte';
	import LogDetailsModal from '$lib/components/modals/LogDetailsModal.svelte';
	import { isSearchModalOpen, isLogModalOpen, isDetailsModalOpen, selectedDetailsProblem, closeSearchModal, closeLogModal, closeDetailsModal, initializeStores } from '$lib/stores/logsStore';
	import ProblemDetailsModal from '$lib/components/modals/ProblemDetailsModal.svelte';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	
	$effect(() => {
		if (data.problems && data.logs) {
			initializeStores({ problems: data.problems, logs: data.logs });
		}
	});

	const isAuthRoute = $derived(
		$page.url.pathname.startsWith('/login') || $page.url.pathname.startsWith('/register')
	);
	
	const isHome = $derived($page.url.pathname === '/');
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
	<ProblemSearchModal open={$isSearchModalOpen} onClose={closeSearchModal} />
	<LogDetailsModal open={$isLogModalOpen} onClose={closeLogModal} />
	<ProblemDetailsModal open={$isDetailsModalOpen} onClose={closeDetailsModal} problem={$selectedDetailsProblem} />
{/if}
