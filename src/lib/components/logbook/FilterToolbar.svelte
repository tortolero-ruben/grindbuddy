<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import type { Pattern, Status, Difficulty, Problem } from '$lib/types';
	import { logsStore } from '$lib/stores/logsStore';

	interface Props {
		searchQuery: string;
		selectedPattern: string;
		selectedStatus: string;
		selectedDifficulty: string;
		selectedDateRange: string;
		selectedTimeComplexity: string;
		onSearchChange: (value: string) => void;
		onPatternChange: (value: string) => void;
		onStatusChange: (value: string) => void;
		onDifficultyChange: (value: string) => void;
		onDateRangeChange: (value: string) => void;
		onTimeComplexityChange: (value: string) => void;
		onClear: () => void;
	}

	let {
		searchQuery = $bindable(),
		selectedPattern = $bindable(),
		selectedStatus = $bindable(),
		selectedDifficulty = $bindable(),
		selectedDateRange = $bindable(),
		selectedTimeComplexity = $bindable(),
		onSearchChange,
		onPatternChange,
		onStatusChange,
		onDifficultyChange,
		onDateRangeChange,
		onTimeComplexityChange,
		onClear
	}: Props = $props();

	// Get unique patterns, statuses, and difficulties
	const allPatterns = $derived.by(() =>
		Array.from(new Set(logsStore.problems.flatMap((p: Problem) => p.patterns))).sort()
	);
	const allStatuses: Status[] = ['Optimal', 'Suboptimal', 'Hints', 'Solution', 'Failed'];
	const allDifficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

	const hasActiveFilters = $derived(
		searchQuery.trim() !== '' || 
		selectedPattern !== '' || 
		selectedStatus !== '' || 
		selectedDifficulty !== '' ||
		selectedDateRange !== '' ||
		selectedTimeComplexity !== ''
	);
</script>

<div
	class="sticky top-16 z-30 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-4"
>
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="space-y-4">
			<!-- Row 1: Search -->
			<div class="flex w-full">
				<Input
					bind:value={searchQuery}
					placeholder="Search logs..."
					class="w-full"
					oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
				/>
			</div>

			<!-- Row 2: Filters -->
			<div class="flex flex-wrap items-center gap-3">
				<Select
					options={[
						{ value: '', label: 'All Patterns' },
						...allPatterns.map((p) => ({ value: p, label: p }))
					]}
					bind:value={selectedPattern}
					onchange={(e) => onPatternChange((e.target as HTMLSelectElement).value)}
					class="w-full sm:w-auto"
				/>

				<Select
					options={[
						{ value: '', label: 'All Statuses' },
						...allStatuses.map((s) => ({ value: s, label: s }))
					]}
					bind:value={selectedStatus}
					onchange={(e) => onStatusChange((e.target as HTMLSelectElement).value)}
					class="w-full sm:w-auto"
				/>

				<Select
					options={[
						{ value: '', label: 'All Difficulties' },
						...allDifficulties.map((d) => ({ value: d, label: d }))
					]}
					bind:value={selectedDifficulty}
					onchange={(e) => onDifficultyChange((e.target as HTMLSelectElement).value)}
					class="w-full sm:w-auto"
				/>

				<Select
					options={[
						{ value: '', label: 'All Time' },
						{ value: '7d', label: 'Last 7 Days' },
						{ value: '30d', label: 'Last 30 Days' },
						{ value: 'this_month', label: 'This Month' }
					]}
					bind:value={selectedDateRange}
					onchange={(e) => onDateRangeChange((e.target as HTMLSelectElement).value)}
					class="w-full sm:w-auto"
				/>

				<Select
					options={[
						{ value: '', label: 'All Complexities' },
						{ value: 'O(1)', label: 'O(1)' },
						{ value: 'O(log n)', label: 'O(log n)' },
						{ value: 'O(n)', label: 'O(n)' },
						{ value: 'O(n log n)', label: 'O(n log n)' },
						{ value: 'O(n²)', label: 'O(n²)' },
						{ value: 'O(2^n)', label: 'O(2^n)' }
					]}
					bind:value={selectedTimeComplexity}
					onchange={(e) => onTimeComplexityChange((e.target as HTMLSelectElement).value)}
					class="w-full sm:w-auto"
				/>

				{#if hasActiveFilters}
					<Button variant="secondary" onclick={onClear} size="sm" class="ml-auto sm:ml-0">
						Clear all
					</Button>
				{/if}
			</div>
		</div>
	</div>
</div>
