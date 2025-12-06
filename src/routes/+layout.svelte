<script lang="ts">
	import { page } from '$app/stores';
	import '../routes/layout.css';
	import { ModeWatcher } from 'mode-watcher';
	import DesktopNav from '$lib/components/nav/DesktopNav.svelte';
	import MobileNav from '$lib/components/nav/MobileNav.svelte';
	import ProblemSearchModal from '$lib/components/modals/ProblemSearchModal.svelte';
	import LogDetailsModal from '$lib/components/modals/LogDetailsModal.svelte';
	import { isSearchModalOpen, isLogModalOpen, closeSearchModal, closeLogModal } from '$lib/stores/logsStore';

	let { data, children } = $props();
	const isAuthRoute = $derived(
		$page.url.pathname === '/' || $page.url.pathname.startsWith('/login') || $page.url.pathname.startsWith('/register')
	);
</script>

<ModeWatcher defaultMode="light" />

<div
	class="min-h-screen bg-white dark:bg-slate-950 text-slate-950 dark:text-white transition-colors duration-300"
>
	{#if !isAuthRoute}
		<DesktopNav user={data.user} />
		<MobileNav user={data.user} />
	{/if}

	<main class={isAuthRoute ? 'py-12' : 'pt-16 pb-16 md:pb-0'}>
		{@render children()}
	</main>
</div>

{#if !isAuthRoute}
	<ProblemSearchModal open={$isSearchModalOpen} onClose={closeSearchModal} />
	<LogDetailsModal open={$isLogModalOpen} onClose={closeLogModal} />
{/if}
