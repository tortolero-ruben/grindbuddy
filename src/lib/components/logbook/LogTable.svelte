<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import PatternBadge from '$lib/components/ui/PatternBadge.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	import HistoryTimeline from './HistoryTimeline.svelte';
	import { formatRelativeTime } from '$lib/utils/dateUtils';
	import type { ProblemWithLogs } from '$lib/types';

	interface Props {
		problems: ProblemWithLogs[];
	}

	let { problems }: Props = $props();

	let expandedRows = $state<Set<string>>(new Set());

	function toggleRow(problemId: string) {
		if (expandedRows.has(problemId)) {
			expandedRows.delete(problemId);
		} else {
			expandedRows.add(problemId);
		}
		expandedRows = expandedRows; // Trigger reactivity
	}
</script>

<div class="overflow-x-auto">
	<table class="w-full">
		<thead>
			<tr class="border-b border-slate-200 dark:border-slate-800">
				<th class="px-4 py-3 text-left text-sm font-semibold">Problem</th>
				<th class="px-4 py-3 text-left text-sm font-semibold">Pattern</th>
				<th class="px-4 py-3 text-left text-sm font-semibold">Last Status</th>
				<th class="px-4 py-3 text-left text-sm font-semibold">Last Logged</th>
			</tr>
		</thead>
		<tbody>
			{#each problems as problem}
				<tr
					class="border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900"
					onclick={() => toggleRow(problem.id)}
				>
					<td class="px-4 py-3">
						<div class="font-mono font-semibold">#{problem.number} {problem.title}</div>
						<DifficultyBadge difficulty={problem.difficulty} />
					</td>
					<td class="px-4 py-3">
						<div class="flex flex-wrap gap-1">
							{#each problem.patterns.slice(0, 2) as pattern}
								<PatternBadge {pattern} />
							{/each}
							{#if problem.patterns.length > 2}
								<span class="text-xs text-slate-500">+{problem.patterns.length - 2}</span>
							{/if}
						</div>
					</td>
					<td class="px-4 py-3">
						{#if problem.lastLog}
							<StatusBadge status={problem.lastLog.status} />
						{:else}
							<span class="text-slate-400">Never</span>
						{/if}
					</td>
					<td class="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
						{#if problem.lastLog}
							{formatRelativeTime(problem.lastLog.timestamp)}
						{:else}
							—
						{/if}
					</td>
				</tr>
				{#if expandedRows.has(problem.id)}
					<tr>
						<td colspan="4" class="px-4 py-4 bg-slate-50 dark:bg-slate-900">
							<HistoryTimeline problemId={problem.id} />
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>
</div>

