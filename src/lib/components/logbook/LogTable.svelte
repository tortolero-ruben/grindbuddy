<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import PatternBadge from '$lib/components/ui/PatternBadge.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	import HistoryTimeline from './HistoryTimeline.svelte';
	import type { ProblemWithLogs } from '$lib/types';

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
	import { ExternalLink, Plus } from '@lucide/svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { openLogModal } from '$lib/stores/logsStore';
	import ProblemDetailsModal from '$lib/components/modals/ProblemDetailsModal.svelte';

	import { openDetailsModal } from '$lib/stores/logsStore';

	interface Props {
		problems: ProblemWithLogs[];
	}

	let { problems }: Props = $props();

	function openDetails(problem: ProblemWithLogs) {
		openDetailsModal(problem);
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
			{#each problems as problem (problem.id)}
				<tr
					class="border-b border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors"
					onclick={() => openDetails(problem)}
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
			{/each}
		</tbody>
	</table>
</div>

<ProblemDetailsModal
	open={isModalOpen}
	onClose={() => (isModalOpen = false)}
	problem={selectedProblemForDetails}
/>
