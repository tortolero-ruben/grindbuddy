<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	import PatternBadge from '$lib/components/ui/PatternBadge.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import HistoryTimeline from '$lib/components/logbook/HistoryTimeline.svelte';
	import { ExternalLink } from 'lucide-svelte';
	import type { ProblemWithLogs, Problem } from '$lib/types';
	import { formatRelativeTime } from '$lib/utils/dateUtils';
	import { openLogModal } from '$lib/stores/logsStore';

	interface Props {
		problem: ProblemWithLogs;
	}

	let { problem }: Props = $props();
	
	let isExpanded = $state(false);
</script>

<Card
	class="p-0 overflow-hidden transition-all hover:shadow-md cursor-pointer border-l-4 {problem.lastLog
		? 'border-l-indigo-500'
		: 'border-l-transparent'}"
>
	<div
		class="p-4 flex flex-col gap-3"
		onclick={() => (isExpanded = !isExpanded)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && (isExpanded = !isExpanded)}
	>
		<!-- Header: Problem number + title -->
		<div class="flex justify-between items-start">
			<h3 class="font-mono text-base font-bold text-slate-900 dark:text-slate-50">
				#{problem.number}
				{problem.title}
			</h3>
			{#if isExpanded}
				<span class="text-xs text-slate-400">Hide History</span>
			{:else}
				<span class="text-xs text-slate-400">Show History</span>
			{/if}
		</div>

		<!-- Badges: Difficulty and Patterns -->
		<div class="flex flex-wrap items-center gap-2">
			<DifficultyBadge difficulty={problem.difficulty} />
			{#each problem.patterns as pattern}
				<PatternBadge {pattern} />
			{/each}
		</div>

		<!-- Footer: Last status and actions -->
		<div
			class="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800 mt-1"
		>
			<div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
				{#if problem.lastLog}
					<span>Last:</span>
					<StatusBadge status={problem.lastLog.status} showIcon={true} />
					<span>{formatRelativeTime(problem.lastLog.timestamp)}</span>
				{:else}
					<span class="text-slate-400">Never logged</span>
				{/if}
			</div>
			<div class="flex items-center gap-2" onclick={(e) => e.stopPropagation()} role="group">
				<a
					href={problem.leetcodeUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
					aria-label="Open problem on LeetCode"
				>
					<ExternalLink class="h-5 w-5" />
				</a>
				<Button variant="primary" size="sm" onclick={() => openLogModal(problem)}>
					Log Attempt
				</Button>
			</div>
		</div>

		{#if isExpanded}
			<div
				class="pt-2 border-t border-slate-100 dark:border-slate-800"
				onclick={(e) => e.stopPropagation()}
				role="region"
			>
				<HistoryTimeline problemId={problem.id} />
			</div>
		{/if}
	</div>
</Card>
