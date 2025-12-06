<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import PatternBadge from '$lib/components/ui/PatternBadge.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	import HistoryTimeline from './HistoryTimeline.svelte';
	import { formatRelativeTime } from '$lib/utils/dateUtils';
	import type { ProblemWithLogs } from '$lib/types';

	interface Props {
		problem: ProblemWithLogs;
	}

	let { problem }: Props = $props();

	let isExpanded = $state(false);
</script>

<Card class="p-4">
	<div class="space-y-3">
		<div class="flex items-start justify-between">
			<div class="flex-1">
				<h3 class="font-mono font-semibold text-slate-900 dark:text-slate-50">
					#{problem.number} {problem.title}
				</h3>
				<div class="mt-2 flex flex-wrap items-center gap-2">
					<DifficultyBadge difficulty={problem.difficulty} />
					{#each problem.patterns.slice(0, 2) as pattern}
						<PatternBadge {pattern} />
					{/each}
				</div>
			</div>
		</div>

		<div class="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-3">
			<div class="flex items-center gap-2">
				{#if problem.lastLog}
					<StatusBadge status={problem.lastLog.status} />
					<span class="text-sm text-slate-600 dark:text-slate-400">
						{formatRelativeTime(problem.lastLog.timestamp)}
					</span>
				{:else}
					<span class="text-sm text-slate-400">Never logged</span>
				{/if}
			</div>
			<button
				class="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
				onclick={() => isExpanded = !isExpanded}
			>
				{isExpanded ? 'Hide' : 'Show'} History
			</button>
		</div>

		{#if isExpanded}
			<div class="border-t border-slate-200 dark:border-slate-800 pt-4">
				<HistoryTimeline problemId={problem.id} />
			</div>
		{/if}
	</div>
</Card>

