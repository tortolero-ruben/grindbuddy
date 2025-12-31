<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import type { Log, Status } from '$lib/types';

	function formatDate(date: Date): string {
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}
	import { getLogsForProblem, logsStore } from '$lib/stores/logsStore';
	import { enhance } from '$app/forms';
	import { Trash2 } from '@lucide/svelte';

	interface Props {
		problemId: string;
	}

	let { problemId }: Props = $props();

	let selectedFilter: Status | 'All' = $state('All');
	const filters: (Status | 'All')[] = ['All', 'Optimal', 'Suboptimal', 'Hints', 'Solution', 'Failed'];

	const allLogs = $derived(getLogsForProblem(problemId, logsStore.logs));
	const problemLogs = $derived(
		selectedFilter === 'All' 
			? allLogs 
			: allLogs.filter((l) => l.status === selectedFilter)
	);
</script>

<div class="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
	<!-- Filters -->
	<div class="mb-6 flex flex-wrap gap-2">
		{#each filters as filter}
			<button
				class="rounded-full px-3 py-1 text-xs font-medium transition-colors {selectedFilter ===
				filter
					? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
					: 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700'}"
				onclick={() => (selectedFilter = filter)}
			>
				{filter}
			</button>
		{/each}
	</div>

	{#each problemLogs as log (log.id)}
		<div class="relative -left-[9px]">
			<div class="absolute left-0 top-2 h-2 w-2 rounded-full bg-slate-400"></div>
			<div class="ml-4 space-y-2">
				<div class="flex items-center gap-2">
					<span class="text-sm text-slate-600 dark:text-slate-400">{formatDate(log.timestamp)}</span
					>
					<StatusBadge status={log.status} />
					<form method="POST" action="/?/deleteLog" use:enhance class="ml-auto">
						<input type="hidden" name="logId" value={log.id} />
						<button
							type="submit"
							class="text-slate-400 hover:text-red-500 transition-colors"
							aria-label="Delete log"
						>
							<Trash2 class="h-4 w-4" />
						</button>
					</form>
				</div>
				{#if log.timeComplexity || log.spaceComplexity}
					<div class="flex gap-2">
						{#if log.timeComplexity}
							<Badge
								variant="pattern"
								class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
							>
								Time: {log.timeComplexity}
							</Badge>
						{/if}
						{#if log.spaceComplexity}
							<Badge
								variant="pattern"
								class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200"
							>
								Space: {log.spaceComplexity}
							</Badge>
						{/if}
					</div>
				{/if}
				{#if log.notes}
					<div class="rounded-lg bg-slate-100 dark:bg-slate-800 p-3 text-sm">
						{log.notes}
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
