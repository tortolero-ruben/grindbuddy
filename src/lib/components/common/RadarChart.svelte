<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Chart, ChartConfiguration } from 'chart.js/auto';
	import ChartJS from 'chart.js/auto';

	type DataSet = {
		label: string;
		data: number[];
		color: string;
	};

	let {
		labels,
		primaryData,
		comparisonData = null
	}: {
		labels: string[];
		primaryData: DataSet;
		comparisonData?: DataSet | null;
	} = $props();

	let canvasEl: HTMLCanvasElement | null = null;
	let chart: Chart | null = null;

	const chartConfig = $derived.by(() => {
		const datasets = [
			{
				label: primaryData.label,
				data: primaryData.data,
				backgroundColor: `${primaryData.color.replace('rgb', 'rgba').replace(')', ', 0.25)')}`,
				borderColor: primaryData.color,
				pointBackgroundColor: primaryData.data.map((val) => {
					if (val >= 70) return 'rgb(16, 185, 129)'; // emerald-600
					if (val >= 30) return 'rgb(245, 158, 11)'; // amber-500
					return 'rgb(225, 29, 72)'; // rose-600
				}) as string[],
				pointBorderColor: primaryData.color,
				pointHoverBackgroundColor: 'rgb(255, 255, 255)',
				pointHoverBorderColor: primaryData.color,
				fill: true,
				borderWidth: 2,
				order: 2
			}
		];

		if (comparisonData) {
			datasets.push({
				label: comparisonData.label,
				data: comparisonData.data,
				backgroundColor: `${comparisonData.color.replace('rgb', 'rgba').replace(')', ', 0.15)')}`,
				borderColor: comparisonData.color,
				pointBackgroundColor: comparisonData.color, // solid color for company
				pointBorderColor: comparisonData.color,
				pointHoverBackgroundColor: 'rgb(255, 255, 255)',
				pointHoverBorderColor: comparisonData.color,
				fill: true,
				borderWidth: 2,
				order: 1 // Draw behind primary
			});
		}

		const data = {
			labels,
			datasets
		};

		const options: ChartConfiguration['options'] = {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'top',
					labels: {
						color: 'rgb(100, 116, 139)' // slate-500
					}
				},
				tooltip: {
					callbacks: {
						label: (context: any) => `${context.dataset.label}: ${context.formattedValue}%`
					},
					backgroundColor: 'rgba(15, 23, 42, 0.9)', // slate-900
					titleColor: 'rgb(241, 245, 249)', // slate-100
					bodyColor: 'rgb(226, 232, 240)', // slate-200
					padding: 12,
					cornerRadius: 8
				}
			},
			scales: {
				r: {
					beginAtZero: true,
					max: 100,
					ticks: {
						callback: (value: number | string) => `${value}%`,
						stepSize: 20,
						display: true,
						color: 'rgb(148, 163, 184)', // slate-400
						backdropColor: 'transparent'
					},
					angleLines: {
						color: 'rgba(148, 163, 184, 0.2)' // slate-400/20
					},
					grid: {
						color: 'rgba(148, 163, 184, 0.15)'
					},
					pointLabels: {
						color: 'rgb(71, 85, 105)', // slate-600
						font: {
							size: 11
						},
						callback: (label: string) => {
							// Truncate long labels
							return label.length > 15 ? label.substring(0, 15) + '...' : label;
						}
					}
				}
			}
		};

		return { type: 'radar', data, options } satisfies ChartConfiguration;
	});

	$effect(() => {
		if (chart && chartConfig) {
			chart.data = chartConfig.data;
			chart.options = chartConfig.options;
			chart.update();
		}
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

<div class="h-80 w-full">
	<canvas bind:this={canvasEl} class="h-full w-full"></canvas>
</div>
