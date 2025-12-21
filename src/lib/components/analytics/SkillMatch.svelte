<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { COMPANY_PROFILES } from '$lib/data/companies';
	import type { CompanyProfile } from '$lib/data/companies';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
	import type { Pattern, ProblemWithLogs } from '$lib/types';
	import { problemsWithLogs } from '$lib/stores/logsStore';
	import { get } from 'svelte/store';

	let selectedCompanySlug = $state('google');

	const selectedCompany = $derived(
		(COMPANY_PROFILES.find((c) => c.slug === selectedCompanySlug) ||
			COMPANY_PROFILES[0]) as CompanyProfile
	);

	// Calculate user mastery per pattern
	const userMastery = $derived.by(() => {
		const patternMap = new Map<Pattern, { total: number; optimal: number }>();

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

		const mastery: Record<string, number> = {};
		patternMap.forEach((stats, pattern) => {
			const percentage = stats.total > 0 ? Math.round((stats.optimal / stats.total) * 100) : 0;
			mastery[pattern] = percentage;
		});

		return mastery;
	});

	const chartData = $derived.by(() => {
		// Force type assertion for patterns keys
		const patterns = selectedCompany.patterns as Partial<Record<Pattern, number>>;
		const companyPatterns = Object.keys(patterns) as Pattern[];
		const labels = companyPatterns;

		const userDataPoints = labels.map((pattern) => userMastery[pattern] || 0);
		const companyDataPoints = labels.map((pattern) => patterns[pattern] || 0);

		return {
			labels,
			primary: {
				label: 'You',
				data: userDataPoints,
				color: 'rgb(59, 130, 246)' // blue-500
			},
			comparison: {
				label: selectedCompany.name,
				data: companyDataPoints,
				color: selectedCompany.color
			}
		};
	});
</script>

<div>
	<p class="mb-4 text-sm text-muted-foreground">
		Compare your skill profile against our estimated requirements for top tech companies.
	</p>

	<div class="mb-6 flex items-center gap-4">
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label for="company-select">Target Company</Label>
			<select
				id="company-select"
				bind:value={selectedCompanySlug}
				class="flex h-10 w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
			>
				{#each COMPANY_PROFILES as company}
					<option value={company.slug}>{company.name}</option>
				{/each}
			</select>
		</div>
	</div>

	<div class="h-[320px] w-full">
		{#if chartData.labels.length > 0}
			<RadarChart
				labels={chartData.labels}
				primaryData={chartData.primary}
				comparisonData={chartData.comparison}
			/>
		{:else}
			<div class="flex h-full items-center justify-center text-muted-foreground">
				Select a company to see the comparison.
			</div>
		{/if}
	</div>
</div>
