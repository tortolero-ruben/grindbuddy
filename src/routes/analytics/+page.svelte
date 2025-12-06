<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import PatternMasteryChart from '$lib/components/analytics/PatternMasteryChart.svelte';
	import ActivityHeatmap from '$lib/components/analytics/ActivityHeatmap.svelte';
	import StatusBreakdown from '$lib/components/analytics/StatusBreakdown.svelte';
</script>

<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
	<h1 class="mb-6 text-h1">Analytics</h1>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2">
		<!-- Pattern Mastery Radar (spans full width) -->
		<Card class="p-6 md:col-span-2">
			<h2 class="mb-4 text-h2">Pattern Mastery (Radar)</h2>
			<PatternMasteryChart />
			<div class="mt-4 flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-400">
				<span class="inline-flex items-center gap-1">
					<span class="h-2 w-2 rounded-full bg-emerald-600"></span> ≥ 70% (Strong)
				</span>
				<span class="inline-flex items-center gap-1">
					<span class="h-2 w-2 rounded-full bg-amber-500"></span> 30–69% (Moderate)
				</span>
				<span class="inline-flex items-center gap-1">
					<span class="h-2 w-2 rounded-full bg-rose-600"></span> &lt; 30% (Needs work)
				</span>
			</div>
		</Card>

		<!-- Activity Heatmap -->
		<Card class="p-6">
			<h2 class="mb-4 text-h2">Activity Heatmap</h2>
			<ActivityHeatmap />
		</Card>

		<!-- Status Breakdown -->
		<Card class="p-6">
			<h2 class="mb-4 text-h2">Status Breakdown</h2>
			<StatusBreakdown />
		</Card>
	</div>
</div>

