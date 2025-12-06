<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Chart, ChartConfiguration } from 'chart.js/auto';
	import ChartJS from 'chart.js/auto';
	import { SvelteMap } from 'svelte/reactivity';
	import { get } from 'svelte/store';
	import type { Pattern, ProblemWithLogs } from '$lib/types';
	import { problemsWithLogs } from '$lib/stores/logsStore';

	let canvasEl: HTMLCanvasElement | null = null;
	let chart: Chart | null = null;

	// Calculate mastery per pattern
	const patternMastery = $derived.by(() => {
		const patternMap = new SvelteMap<Pattern, { total: number; optimal: number }>();

		get(problemsWithLogs).forEach((problem: ProblemWithLogs) => {
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

	const chartConfig = $derived.by(() => {
		const data = {
			labels: patternMastery.map((m) => m.pattern),
			datasets: [
				{
					label: 'Pattern Mastery %',
					data: patternMastery.map((m) => m.percentage),
					backgroundColor: 'rgba(59, 130, 246, 0.25)', // blue-500 with opacity
					borderColor: 'rgb(59, 130, 246)',
					pointBackgroundColor: patternMastery.map((m) => {
						if (m.percentage >= 70) return 'rgb(16, 185, 129)'; // emerald-600
						if (m.percentage >= 30) return 'rgb(245, 158, 11)'; // amber-500
						return 'rgb(225, 29, 72)'; // rose-600
					}),
					pointBorderColor: 'rgb(59, 130, 246)',
					pointHoverBackgroundColor: 'rgb(255, 255, 255)',
					pointHoverBorderColor: 'rgb(59, 130, 246)',
					fill: true,
					borderWidth: 2
				}
			]
		};

		const options: ChartConfiguration['options'] = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'top'
				},
				tooltip: {
					callbacks: {
						label: (context: any) => `${context.formattedValue}% mastery`
					}
				}
			},
			scales: {
				r: {
					beginAtZero: true,
					max: 100,
					ticks: {
						callback: (value: number | string) => `${value}%`,
						stepSize: 20,
						display: true
					},
					angleLines: {
						color: 'rgba(148, 163, 184, 0.3)' // slate-400/30
					},
					grid: {
						color: 'rgba(148, 163, 184, 0.2)'
					},
					pointLabels: {
						color: 'rgb(51, 65, 85)', // slate-700
						callback: (label: string) => label
					}
				}
			}
		};

		return { type: 'radar', data, options } satisfies ChartConfiguration;
	});

	onMount(() => {
		if (!browser || !canvasEl) return;
		chart = new ChartJS(canvasEl, chartConfig);

		return () => {
			chart?.destroy();
			chart = null;
		};
	});
</script>

<div class="h-72">
	<canvas bind:this={canvasEl} class="h-full w-full"></canvas>
</div>

