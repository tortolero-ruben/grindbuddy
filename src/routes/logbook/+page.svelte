<script lang="ts">
	import { page } from '$app/stores';
	import FilterToolbar from '$lib/components/logbook/FilterToolbar.svelte';
	import LogTable from '$lib/components/logbook/LogTable.svelte';
	import LogCard from '$lib/components/logbook/LogCard.svelte';
	import { problemsWithLogs } from '$lib/stores/logsStore';
	import { get } from 'svelte/store';
	import type { Pattern, Status, Difficulty } from '$lib/types';

	let searchQuery = $state('');
	let selectedPattern = $state('');
	let selectedStatus = $state('');
	let selectedDifficulty = $state('');

	// Get initial filter from URL
	$effect(() => {
		const patternParam = $page.url.searchParams.get('pattern');
		if (patternParam) {
			selectedPattern = decodeURIComponent(patternParam);
		}
	});

	// Reactive filtered problems
	let filteredProblems = $derived.by(() => {
		let filtered = $problemsWithLogs;

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(p) =>
					p.title.toLowerCase().includes(query) ||
					p.number.toString().includes(query) ||
					p.patterns.some((pattern) => pattern.toLowerCase().includes(query))
			);
		}

		if (selectedPattern) {
			filtered = filtered.filter((p) => p.patterns.includes(selectedPattern as Pattern));
		}

		if (selectedStatus) {
			filtered = filtered.filter((p) => p.lastLog?.status === (selectedStatus as Status));
		}

		if (selectedDifficulty) {
			filtered = filtered.filter((p) => p.difficulty === (selectedDifficulty as Difficulty));
		}

		return filtered;
	});

	function clearFilters() {
		searchQuery = '';
		selectedPattern = '';
		selectedStatus = '';
		selectedDifficulty = '';
	}
</script>

<div class="mx-auto max-w-7xl">
	<h1 class="mb-6 px-4 pt-6 text-h1 sm:px-6 lg:px-8">Logbook</h1>

	<FilterToolbar
		bind:searchQuery
		bind:selectedPattern
		bind:selectedStatus
		bind:selectedDifficulty
		onSearchChange={(v) => searchQuery = v}
		onPatternChange={(v) => selectedPattern = v}
		onStatusChange={(v) => selectedStatus = v}
		onDifficultyChange={(v) => selectedDifficulty = v}
		onClear={clearFilters}
	/>

	<div class="px-4 py-6 sm:px-6 lg:px-8">
		{#if filteredProblems.length === 0}
			<div class="py-12 text-center text-slate-600 dark:text-slate-400">
				No logs found matching your filters.
			</div>
		{:else}
			<!-- Desktop: Table View -->
			<div class="hidden md:block">
				<LogTable problems={filteredProblems} />
			</div>

			<!-- Mobile: Card View -->
			<div class="md:hidden space-y-4">
				{#each filteredProblems as problem}
					<LogCard {problem} />
				{/each}
			</div>
		{/if}
	</div>
</div>

