<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	// import { searchProblems } from '$lib/data/mockProblems';
	import { logsStore, closeSearchModal, openLogModal } from '$lib/stores/logsStore';
	import { onMount } from 'svelte';
	import type { Problem } from '$lib/types';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	let searchQuery = $state('');
	let selectedIndex = $state(-1);
	let searchInput: HTMLInputElement;

	const searchResults = $derived(
		!searchQuery.trim()
			? []
			: logsStore.problems.filter(
					(p) =>
						p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
						p.number.toString().includes(searchQuery)
				)
	);

	$effect(() => {
		if (open) {
			searchQuery = '';
			selectedIndex = -1;
			setTimeout(() => searchInput?.focus(), 100);
		}
	});

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowDown') {
			e.preventDefault();
			selectedIndex = Math.min(selectedIndex + 1, searchResults.length - 1);
		} else if (e.key === 'ArrowUp') {
			e.preventDefault();
			selectedIndex = Math.max(selectedIndex - 1, -1);
		} else if (e.key === 'Enter' && selectedIndex >= 0) {
			e.preventDefault();
			selectProblem(searchResults[selectedIndex]);
		}
	}

	function selectProblem(problem: Problem) {
		closeSearchModal();
		openLogModal(problem);
	}
</script>

<Dialog {open} {onClose}>
	<div class="p-6">
		<h2 class="mb-4 text-xl font-semibold">Search Problems</h2>

		<input
			bind:this={searchInput}
			bind:value={searchQuery}
			placeholder="Type a problem name or number..."
			class="flex h-12 w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3 text-base ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 mb-4 text-lg"
			onkeydown={handleKeyDown}
		/>

		{#if searchQuery.trim()}
			{#if searchResults.length > 0}
				<ul class="max-h-96 overflow-y-auto -mx-6 px-6">
					{#each searchResults as result, index (result.id)}
						<li>
							<button
								class="w-full px-4 py-4 text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors {selectedIndex ===
								index
									? 'bg-slate-100 dark:bg-slate-800'
									: ''} min-h-[60px] flex items-center"
								onclick={() => selectProblem(result)}
							>
								<div class="flex items-center justify-between gap-2 flex-wrap">
									<span class="font-mono font-semibold text-base">
										#{result.number}
										{result.title}
									</span>
									<DifficultyBadge difficulty={result.difficulty} />
								</div>
							</button>
						</li>
					{/each}
				</ul>
			{:else}
				<div class="py-8 text-center text-slate-600 dark:text-slate-400">
					<p class="mb-4">Problem not found.</p>
					<button class="text-indigo-600 dark:text-indigo-400 hover:underline" onclick={onClose}>
						Log Manually
					</button>
				</div>
			{/if}
		{/if}
	</div>
</Dialog>
