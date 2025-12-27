<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
	import type { Pattern, ProblemWithLogs } from '$lib/types';
	import { problemsWithLogs } from '$lib/stores/logsStore';
	import { get } from 'svelte/store';
	import { RefreshCw } from 'lucide-svelte';
	import { onMount } from 'svelte';

	interface DynamicCompany {
		name: string;
		slug: string;
		color: string;
		patterns: Record<string, number>;
	}

	let companies = $state<any[]>([]);
	let selectedCompanySlug = $state('google');
	let isRefreshing = $state(false);
	let currentCompanyData = $state<DynamicCompany | null>(null);

	async function loadCompanies() {
		const res = await fetch('/api/companies');
		companies = await res.json();
	}

	async function loadCompanyDetails(slug: string) {
		isRefreshing = true;
		try {
			const res = await fetch(`/api/companies/${slug}`);
			currentCompanyData = await res.json();
		} finally {
			isRefreshing = false;
		}
	}

	onMount(() => {
		loadCompanies();
		loadCompanyDetails(selectedCompanySlug);
	});

	$effect(() => {
		if (selectedCompanySlug) {
			loadCompanyDetails(selectedCompanySlug);
		}
	});

	const CORE_PATTERNS: Pattern[] = [
		'Arrays & Hashing',
		'Two Pointers',
		'Sliding Window',
		'Stack',
		'Binary Search',
		'Linked List',
		'Trees',
		'Backtracking',
		'Graphs',
		'1-D Dynamic Programming'
	];

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
		if (!currentCompanyData) return { labels: [], primary: { label: 'You', data: [], color: '' }, comparison: { label: '', data: [], color: '' } };

		const patterns = currentCompanyData.patterns;
		const labels = CORE_PATTERNS;

		const userDataPoints = labels.map((pattern) => userMastery[pattern] || 0);
		const companyDataPoints = labels.map((pattern) => patterns[pattern] || 0);

		return {
			labels,
			primary: {
				label: 'You',
				data: userDataPoints,
				color: 'hsl(217, 91%, 60%)' // Soft blue
			},
			comparison: {
				label: currentCompanyData.name,
				data: companyDataPoints,
				color: currentCompanyData.color || '#6366f1'
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
			<div class="flex items-center gap-2">
				<select
					id="company-select"
					bind:value={selectedCompanySlug}
					class="flex h-10 w-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					{#each companies as company}
						<option value={company.slug}>{company.name}</option>
					{/each}
				</select>
				<button
					class="p-2 rounded-md border border-input hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
					onclick={() => loadCompanyDetails(selectedCompanySlug)}
					disabled={isRefreshing}
					aria-label="Refresh analysis"
				>
					<RefreshCw class="h-4 w-4 {isRefreshing ? 'animate-spin' : ''}" />
				</button>
			</div>
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
