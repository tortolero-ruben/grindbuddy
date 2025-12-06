<script lang="ts">
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import { get } from 'svelte/store';
	import { formatDate } from '$lib/utils/dateUtils';
	import type { Log } from '$lib/types';
	import { getLogsForProblem } from '$lib/data/mockLogs';
	import { logs } from '$lib/stores/logsStore';

	interface Props {
		problemId: string;
	}

	let { problemId }: Props = $props();

	const problemLogs = $derived(getLogsForProblem(problemId, get(logs)));
</script>

<div class="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-800">
	{#each problemLogs as log}
		<div class="relative -left-[9px]">
			<div class="absolute left-0 top-2 h-2 w-2 rounded-full bg-slate-400"></div>
			<div class="ml-4 space-y-2">
				<div class="flex items-center gap-2">
					<span class="text-sm text-slate-600 dark:text-slate-400">{formatDate(log.timestamp)}</span>
					<StatusBadge status={log.status} />
				</div>
				{#if log.timeComplexity || log.spaceComplexity}
					<div class="flex gap-2">
						{#if log.timeComplexity}
							<Badge variant="pattern" class="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
								Time: {log.timeComplexity}
							</Badge>
						{/if}
						{#if log.spaceComplexity}
							<Badge variant="pattern" class="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
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

