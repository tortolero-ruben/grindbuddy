<script lang="ts">
	import Card from '$lib/components/ui/Card.svelte';
	import PatternMasteryChart from '$lib/components/analytics/PatternMasteryChart.svelte';
	import ActivityHeatmap from '$lib/components/analytics/ActivityHeatmap.svelte';
	import StatusBreakdown from '$lib/components/analytics/StatusBreakdown.svelte';
	import SkillMatch from '$lib/components/analytics/SkillMatch.svelte';
</script>

<div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
	<h1 class="mb-4 text-h1">Analytics</h1>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<!-- Pattern Mastery Radar -->
		<Card class="p-6 flex flex-col min-h-[800px]">
			<div class="flex flex-col h-full">
				<h2 class="mb-4 text-h2">Pattern Mastery (Radar)</h2>
				<div class="flex-1 flex flex-col min-h-0">
					<PatternMasteryChart />
				</div>
			</div>
		</Card>

		<!-- Skill Match -->
		<Card class="p-6 flex flex-col min-h-[800px]">
			<div class="flex flex-col h-full">
				<h2 class="mb-4 text-h2">Skill Match</h2>
				<div class="flex-1 flex flex-col min-h-0">
					<SkillMatch />
				</div>
			</div>
		</Card>

		<!-- Activity Heatmap -->
		<Card class="p-6 lg:col-span-2">
			<h2 class="mb-4 text-h2">Activity Heatmap</h2>
			<ActivityHeatmap />
		</Card>

		<!-- Status Breakdown -->
		<Card class="p-6 lg:col-span-2">
			<h2 class="mb-4 text-h2">Status Breakdown</h2>
			<StatusBreakdown />
		</Card>
	</div>
</div>
