<script lang="ts">
	import type { Pattern, ProblemWithLogs } from '$lib/types';
	import { logsStore } from '$lib/stores/logsStore';
	import RadarChart from '$lib/components/common/RadarChart.svelte';

	// Calculate mastery per pattern
	// Only calculate for problems that have logs (have been attempted)
	const patternMastery = $derived.by(() => {
		const patternMap = new Map<Pattern, { total: number; optimal: number }>();

		// Filter to only problems with logs to avoid counting unattempted problems
		logsStore.problemsWithLogs
			.filter(problem => problem.logs.length > 0)
			.forEach((problem: ProblemWithLogs) => {
				problem.patterns.forEach((pattern: Pattern) => {
					if (!patternMap.has(pattern)) {
						patternMap.set(pattern, { total: 0, optimal: 0 });
					}
					const stats = patternMap.get(pattern)!;
					stats.total++;
					if (problem.lastLog?.status === 'Optimal') {
						stats.optimal++;
					}
				});
			});

		const mastery: { pattern: Pattern; percentage: number }[] = [];
		patternMap.forEach((stats, pattern) => {
			const percentage = stats.total > 0 ? Math.round((stats.optimal / stats.total) * 100) : 0;
			mastery.push({ pattern, percentage });
		});

		return mastery.sort((a, b) => b.percentage - a.percentage);
	});

	const chartData = $derived.by(() => {
		return {
			labels: patternMastery.map((m) => m.pattern),
			primary: {
				label: 'Pattern Mastery %',
				data: patternMastery.map((m) => m.percentage),
				color: 'rgb(59, 130, 246)' // blue-500
			}
		};
	});
</script>

<div class="h-72">
	{#if chartData.labels.length > 0}
		<RadarChart labels={chartData.labels} primaryData={chartData.primary} />
	{:else}
		<div class="flex h-full w-full items-center justify-center text-muted-foreground">
			No data available yet. Start solving problems!
		</div>
	{/if}
</div>
