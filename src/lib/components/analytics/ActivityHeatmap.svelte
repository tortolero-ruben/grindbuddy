<script lang="ts">
import { logs } from '$lib/stores/logsStore';
import { get } from 'svelte/store';
	import type { Log } from '$lib/types';

	// Generate last 365 days
	const days = $derived.by(() => {
		const result: Date[] = [];
		for (let i = 364; i >= 0; i--) {
			const date = new Date();
			date.setDate(date.getDate() - i);
			result.push(date);
		}
		return result;
	});

	// Count logs per day
	const logCounts = $derived.by(() => {
		const counts = new Map<string, number>();
		get(logs).forEach((log: Log) => {
			const dateKey = log.timestamp.toISOString().split('T')[0];
			counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
		});
		return counts;
	});

	function getIntensity(count: number): string {
		if (count === 0) return 'bg-slate-100 dark:bg-slate-800';
		if (count === 1) return 'bg-emerald-300 dark:bg-emerald-600';
		if (count === 2) return 'bg-emerald-400 dark:bg-emerald-500';
		if (count >= 3) return 'bg-emerald-600 dark:bg-emerald-400';
		return 'bg-slate-100 dark:bg-slate-800';
	}

	function getDateKey(date: Date): string {
		return date.toISOString().split('T')[0];
	}
</script>

<div class="overflow-x-auto">
	<div class="inline-flex gap-1 p-4">
		{#each days as day}
			{@const dateKey = getDateKey(day)}
			{@const count = logCounts.get(dateKey) || 0}
			<div
				class="h-3 w-3 rounded {getIntensity(count)}"
				title="{day.toLocaleDateString()}: {count} {count === 1 ? 'problem' : 'problems'} solved"
				role="button"
				tabindex="0"
			></div>
		{/each}
	</div>
</div>

