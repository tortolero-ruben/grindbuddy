<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	import PatternBadge from '$lib/components/ui/PatternBadge.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import HistoryTimeline from '$lib/components/logbook/HistoryTimeline.svelte';
	import { ExternalLink } from 'lucide-svelte';
	import type { ProblemWithLogs, Problem } from '$lib/types';
	import { openDetailsModal } from '$lib/stores/logsStore';

	function formatRelativeTime(date: Date): string {
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return 'just now';
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) {
			return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
		}

		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks < 4) {
			return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
		}

		const diffInMonths = Math.floor(diffInDays / 30);
		return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
	}

	interface Props {
		problem: ProblemWithLogs;
	}

	let { problem }: Props = $props();
</script>

<Card
	class="p-0 overflow-hidden transition-all hover:shadow-md cursor-pointer border-l-4 {problem.lastLog
		? 'border-l-indigo-500'
		: 'border-l-transparent'}"
>
	<div
		class="p-4 flex flex-col gap-3"
		onclick={() => openDetailsModal(problem)}
		role="button"
		tabindex="0"
		onkeydown={(e) => e.key === 'Enter' && openDetailsModal(problem)}
	>
		<!-- Header: Problem number + title -->
		<div class="flex justify-between items-start">
			<h3 class="font-mono text-base font-bold text-slate-900 dark:text-slate-50">
				#{problem.number}
				{problem.title}
			</h3>
			<div class="flex items-center gap-2">
				<span class="text-xs text-slate-400">View Details</span>
			</div>
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
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				class="flex items-center gap-2"
				onclick={(e) => e.stopPropagation()}
				onkeydown={(e) => e.stopPropagation()}
				role="group"
			>
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
	</div>
</Card>
