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
			const dateKey = new Date(log.timestamp).toISOString().split('T')[0];
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

<div class="w-full">
	<div class="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-21 lg:grid-cols-35 gap-1">
		{#each days as day}
			{@const dateKey = getDateKey(day)}
			{@const count = logCounts.get(dateKey) || 0}
			<div
				class="h-3 w-3 rounded-sm {getIntensity(count)} transition-colors"
				title="{day.toLocaleDateString()}: {count} {count === 1 ? 'problem' : 'problems'} solved"
				role="button"
				tabindex="0"
			></div>
		{/each}
	</div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 10px;
	}
	:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
		background: #1e293b;
	}
</style>
