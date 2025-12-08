<script lang="ts">
	import { page } from '$app/stores';
	import FilterToolbar from '$lib/components/logbook/FilterToolbar.svelte';
	import LogTable from '$lib/components/logbook/LogTable.svelte';
	import ProblemCard from '$lib/components/dashboard/ProblemCard.svelte';
	import { problemsWithLogs } from '$lib/stores/logsStore';
	import { get } from 'svelte/store';
	import type { Pattern, Status, Difficulty } from '$lib/types';

	let searchQuery = $state('');
	let selectedPattern = $state('');
	let selectedStatus = $state('');
	let selectedDifficulty = $state('');
	let selectedDateRange = $state('');
	let selectedTimeComplexity = $state('');

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

		if (selectedTimeComplexity) {
			filtered = filtered.filter((p) => p.lastLog?.timeComplexity === selectedTimeComplexity);
		}

		if (selectedDateRange) {
			const now = new Date();
			const oneDay = 24 * 60 * 60 * 1000;
			
			filtered = filtered.filter((p) => {
				if (!p.lastLog) return false;
				const logDate = new Date(p.lastLog.timestamp);
				
				switch (selectedDateRange) {
					case '7d':
						return (now.getTime() - logDate.getTime()) < (7 * oneDay);
					case '30d':
						return (now.getTime() - logDate.getTime()) < (30 * oneDay);
					case 'this_month':
						return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
					default:
						return true;
				}
			});
		}

		return filtered;
	});

	function clearFilters() {
		searchQuery = '';
		selectedPattern = '';
		selectedStatus = '';
		selectedDifficulty = '';
		selectedDateRange = '';
		selectedTimeComplexity = '';
	}
</script>

<div class="mx-auto max-w-7xl">
	<h1 class="mb-6 px-4 pt-6 text-h1 sm:px-6 lg:px-8">Logbook</h1>

	<FilterToolbar
		bind:searchQuery
		bind:selectedPattern
		bind:selectedStatus
		bind:selectedDifficulty
		bind:selectedDateRange
		bind:selectedTimeComplexity
		onSearchChange={(v) => (searchQuery = v)}
		onPatternChange={(v) => (selectedPattern = v)}
		onStatusChange={(v) => (selectedStatus = v)}
		onDifficultyChange={(v) => (selectedDifficulty = v)}
		onDateRangeChange={(v) => (selectedDateRange = v)}
		onTimeComplexityChange={(v) => (selectedTimeComplexity = v)}
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
					<ProblemCard {problem} />
				{/each}
			</div>
		{/if}
	</div>
</div>
