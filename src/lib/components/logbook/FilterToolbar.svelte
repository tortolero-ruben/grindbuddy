<script lang="ts">
	import Input from '$lib/components/ui/Input.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { get } from 'svelte/store';
	import type { Pattern, Status, Difficulty, Problem } from '$lib/types';
	import { problems } from '$lib/stores/logsStore';

	interface Props {
		searchQuery: string;
		selectedPattern: string;
		selectedStatus: string;
		selectedDifficulty: string;
		onSearchChange: (value: string) => void;
		onPatternChange: (value: string) => void;
		onStatusChange: (value: string) => void;
		onDifficultyChange: (value: string) => void;
		onClear: () => void;
	}

	let {
		searchQuery = $bindable(),
		selectedPattern = $bindable(),
		selectedStatus = $bindable(),
		selectedDifficulty = $bindable(),
		onSearchChange,
		onPatternChange,
		onStatusChange,
		onDifficultyChange,
		onClear
	}: Props = $props();

	// Get unique patterns, statuses, and difficulties
	const allPatterns = $derived.by(() =>
		Array.from(new Set(get(problems).flatMap((p: Problem) => p.patterns))).sort()
	);
	const allStatuses: Status[] = ['Optimal', 'Suboptimal', 'Hints', 'Solution', 'Failed'];
	const allDifficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

	const hasActiveFilters = $derived(
		searchQuery.trim() !== '' || selectedPattern !== '' || selectedStatus !== '' || selectedDifficulty !== ''
	);
</script>

<div class="sticky top-16 z-30 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-4">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
			<Input
				bind:value={searchQuery}
				placeholder="Search logs..."
				class="flex-1"
				oninput={(e) => onSearchChange((e.target as HTMLInputElement).value)}
			/>

			<Select
				options={[
					{ value: '', label: 'All Patterns' },
					...allPatterns.map((p) => ({ value: p, label: p }))
				]}
				bind:value={selectedPattern}
				onchange={(e) => onPatternChange((e.target as HTMLSelectElement).value)}
			/>

			<Select
				options={[
					{ value: '', label: 'All Statuses' },
					...allStatuses.map((s) => ({ value: s, label: s }))
				]}
				bind:value={selectedStatus}
				onchange={(e) => onStatusChange((e.target as HTMLSelectElement).value)}
			/>

			<Select
				options={[
					{ value: '', label: 'All Difficulties' },
					...allDifficulties.map((d) => ({ value: d, label: d }))
				]}
				bind:value={selectedDifficulty}
				onchange={(e) => onDifficultyChange((e.target as HTMLSelectElement).value)}
			/>

			{#if hasActiveFilters}
				<Button variant="secondary" onclick={onClear} size="sm">Clear all</Button>
			{/if}
		</div>
	</div>
</div>

