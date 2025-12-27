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

	function toRgba(color: string, alpha: number) {
		if (!color) return `rgba(0,0,0,${alpha})`;
		if (color.startsWith('hsl')) {
			return color.replace('hsl', 'hsla').replace(')', `, ${alpha})`);
		}
		if (color.startsWith('rgb')) {
			return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
		}
		// Handle Hex
		if (color.startsWith('#')) {
			const r = parseInt(color.slice(1, 3), 16);
			const g = parseInt(color.slice(3, 5), 16);
			const b = parseInt(color.slice(5, 7), 16);
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		}
		return color;
	}

	const chartConfig = $derived.by(() => {
		const datasets = [
			{
				label: primaryData.label,
				data: primaryData.data,
				backgroundColor: toRgba(primaryData.color, 0.4),
				borderColor: primaryData.color,
				pointBackgroundColor: primaryData.data.map((val) => {
					if (val >= 70) return 'rgb(16, 185, 129)'; // emerald-600
					if (val >= 30) return 'rgb(245, 158, 11)'; // amber-500
					return 'rgb(225, 29, 72)'; // rose-600
				}) as any,
				pointBorderColor: primaryData.color,
				pointHoverBackgroundColor: 'rgb(255, 255, 255)',
				pointHoverBorderColor: primaryData.color,
				fill: true,
				borderWidth: 2,
				pointRadius: 3,
				pointHoverRadius: 5,
				order: 2
			} as any
		];

		if (comparisonData) {
			datasets.push({
				label: comparisonData.label,
				data: comparisonData.data,
				backgroundColor: toRgba(comparisonData.color, 0.2),
				borderColor: comparisonData.color,
				pointBackgroundColor: comparisonData.color as any,
				pointBorderColor: comparisonData.color as any,
				pointHoverBackgroundColor: 'rgb(255, 255, 255)',
				pointHoverBorderColor: comparisonData.color,
				fill: true,
				borderWidth: 2,
				pointRadius: 3,
				pointHoverRadius: 5,
				order: 1 // Draw behind primary
			} as any);
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
						color: 'rgb(203, 213, 225)', // slate-300 (lighter for dark mode)
						font: {
							size: 13
						}
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
						display: false, // Hide numerical ticks to reduce clutter
						backdropColor: 'transparent'
					},
					angleLines: {
						color: 'rgba(255, 255, 255, 0.1)' // faint white
					},
					grid: {
						color: 'rgba(255, 255, 255, 0.1)' // faint white
					},
					pointLabels: {
						color: 'rgb(226, 232, 240)', // slate-200 (much lighter)
						font: {
							size: 12,
							family: "'Inter', sans-serif"
						},
						callback: (label: string) => {
							// Truncate long labels
							return label.length > 20 ? label.substring(0, 20) + '...' : label;
						}
					}
				}
			}
		};

		return { type: 'radar', data, options } satisfies ChartConfiguration;
	});

	$effect(() => {
		if (!browser || !canvasEl || !chartConfig) return;

		// Destroy existing chart if it exists
		if (chart) {
			chart.destroy();
		}

		// Create a new chart instance with the fresh config
		// Use a deep copy to prevent any reactive side-effects from Chart.js mutations
		const configCopy = JSON.parse(JSON.stringify(chartConfig));
		chart = new ChartJS(canvasEl, configCopy);

		return () => {
			chart?.destroy();
			chart = null;
		};
	});

	onMount(() => {
		// Removal of redundant onMount logic as $effect handles creation
		return () => {
			chart?.destroy();
			chart = null;
		};
	});
</script>

<div class="h-80 w-full">
	<canvas bind:this={canvasEl} class="h-full w-full"></canvas>
</div>
