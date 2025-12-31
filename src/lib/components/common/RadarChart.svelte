<script lang="ts">
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import type { Chart, ChartConfiguration } from 'chart.js/auto';
	import ChartJS from 'chart.js/auto';

	type DataSet = {
		label: string;
		data: number[];
		color: string;
		counts?: number[]; // Optional counts for tooltips
	};

	let {
		labels,
		primaryData,
		comparisonData = null,
		totalQuestionsAnswered = 0
	}: {
		labels: string[];
		primaryData: DataSet;
		comparisonData?: DataSet | null;
		totalQuestionsAnswered?: number;
	} = $props();

	let canvasEl: HTMLCanvasElement | null = null;
	let chart: Chart | null = null;
	let isDarkMode = $state(false);

	// Watch for theme changes and update state
	$effect(() => {
		if (!browser) return;
		
		const checkDarkMode = () => {
			const htmlEl = document.documentElement;
			isDarkMode = htmlEl.classList.contains('dark') || 
				window.matchMedia('(prefers-color-scheme: dark)').matches;
		};
		
		// Initial check
		checkDarkMode();
		
		// Watch for class changes on html element
		const observer = new MutationObserver(checkDarkMode);
		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});
		
		// Also listen to media query changes
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', checkDarkMode);
		
		return () => {
			observer.disconnect();
			mediaQuery.removeEventListener('change', checkDarkMode);
		};
	});

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

	// Calculate dynamic max scale based on data
	const dynamicMax = $derived.by(() => {
		const allValues: number[] = [];
		
		// Collect all data values from primary dataset
		primaryData.data.forEach(val => {
			if (val !== null && val !== undefined && !isNaN(val)) {
				allValues.push(val);
			}
		});
		
		// Collect all data values from comparison dataset if present
		if (comparisonData) {
			comparisonData.data.forEach(val => {
				if (val !== null && val !== undefined && !isNaN(val)) {
					allValues.push(val);
				}
			});
		}
		
		if (allValues.length === 0) return 100;
		
		const maxValue = Math.max(...allValues);
		
		// If max is already close to 100, use 100
		if (maxValue >= 90) return 100;
		
		// Add 20% padding above the max value, rounded to nearest 5
		const paddedMax = maxValue * 1.2;
		const roundedMax = Math.ceil(paddedMax / 5) * 5;
		
		// Ensure minimum scale of 20 for visibility of small values
		// But if max is very small (< 10), use a minimum of max * 2
		const minScale = maxValue < 10 ? Math.max(20, maxValue * 2) : 20;
		
		return Math.max(minScale, Math.min(roundedMax, 100));
	});

	// Calculate step size based on total questions answered
	// More questions = smaller increments (more granular scale)
	const dynamicStepSize = $derived.by(() => {
		// Base step size on data range
		let baseStepSize = dynamicMax <= 50 ? 10 : 20;
		
		// Adjust based on total questions answered
		if (totalQuestionsAnswered === 0) {
			// No questions answered - use default
			return baseStepSize;
		} else if (totalQuestionsAnswered <= 10) {
			// Few questions - larger increments
			return Math.max(baseStepSize, 10);
		} else if (totalQuestionsAnswered <= 25) {
			// Some questions - medium increments
			return 5;
		} else if (totalQuestionsAnswered <= 50) {
			// Many questions - smaller increments
			return 2;
		} else {
			// Lots of questions - very small increments
			return 1;
		}
	});

	const chartConfig = $derived.by(() => {
		const datasets = [
			{
				label: primaryData.label,
				data: primaryData.data,
				counts: primaryData.counts,
				backgroundColor: toRgba(primaryData.color, 0.4),
				borderColor: primaryData.color,
				fill: true,
				borderWidth: 2,
				pointRadius: 0,
				pointHoverRadius: 0,
				pointHitRadius: 10, // Invisible hover area for tooltips
				order: 2
			} as any
		];

		if (comparisonData) {
			datasets.push({
				label: comparisonData.label,
				data: comparisonData.data,
				counts: comparisonData.counts,
				backgroundColor: toRgba(comparisonData.color, 0.2),
				borderColor: comparisonData.color,
				fill: true,
				borderWidth: 2,
				pointRadius: 0,
				pointHoverRadius: 0,
				pointHitRadius: 10, // Invisible hover area for tooltips
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
						color: isDarkMode 
							? 'rgb(203, 213, 225)' // slate-300 for dark mode
							: 'rgb(15, 23, 42)', // slate-900 for light mode (much darker)
						font: {
							size: 13,
							weight: '500'
						}
					}
				},
				tooltip: {
					callbacks: {
						label: (context: any) => {
							const dataset = context.dataset;
							const dataIndex = context.dataIndex;
							
							// For radar charts, the value is at context.parsed.r
							// Fallback to dataset.data if parsed.r is not available
							const rawValue = context.parsed?.r ?? dataset.data[dataIndex] ?? 0;
							const percentage = typeof rawValue === 'number' ? Math.round(rawValue) : Number(rawValue) || 0;
							const counts = dataset.counts;
							
							if (counts && Array.isArray(counts) && counts[dataIndex] !== undefined && counts[dataIndex] !== null) {
								return `${dataset.label}: ${percentage}% (${counts[dataIndex]} ${counts[dataIndex] === 1 ? 'question' : 'questions'})`;
							}
							return `${dataset.label}: ${percentage}%`;
						}
					},
					backgroundColor: isDarkMode 
						? 'rgba(15, 23, 42, 0.9)' // slate-900 for dark mode
						: 'rgba(255, 255, 255, 0.95)', // white for light mode
					titleColor: isDarkMode 
						? 'rgb(241, 245, 249)' // slate-100 for dark mode
						: 'rgb(15, 23, 42)', // slate-900 for light mode
					bodyColor: isDarkMode 
						? 'rgb(226, 232, 240)' // slate-200 for dark mode
						: 'rgb(51, 65, 85)', // slate-700 for light mode
					padding: 12,
					cornerRadius: 8,
					borderColor: isDarkMode 
						? 'rgba(255, 255, 255, 0.1)' // subtle border for dark mode
						: 'rgba(0, 0, 0, 0.1)', // subtle border for light mode
					borderWidth: 1
				}
			},
			scales: {
				r: {
					beginAtZero: true,
					max: dynamicMax,
					ticks: {
						display: false, // Hide numerical ticks to reduce clutter
						backdropColor: 'transparent',
						stepSize: dynamicStepSize // Adjust step size based on total questions answered
					},
					angleLines: {
						color: isDarkMode 
							? 'rgba(255, 255, 255, 0.15)' // white for dark mode
							: 'rgba(0, 0, 0, 0.2)', // darker black for light mode (more visible)
						lineWidth: 1.5
					},
					grid: {
						color: isDarkMode 
							? 'rgba(255, 255, 255, 0.1)' // faint white for dark mode
							: 'rgba(0, 0, 0, 0.15)', // darker black for light mode (more visible)
						lineWidth: 1.5
					},
					pointLabels: {
						color: isDarkMode 
							? 'rgb(226, 232, 240)' // slate-200 for dark mode
							: 'rgb(15, 23, 42)', // slate-900 for light mode (much darker, more readable)
						font: {
							size: 12,
							family: "'Inter', sans-serif",
							weight: '500'
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
			chart = null;
		}

		// Create a new chart instance with the fresh config
		// Use a deep copy to prevent any reactive side-effects from Chart.js mutations
		const configCopy = JSON.parse(JSON.stringify(chartConfig));
		chart = new ChartJS(canvasEl, configCopy);

		return () => {
			if (chart) {
				chart.destroy();
				chart = null;
			}
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
