<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import RadarChart from '$lib/components/common/RadarChart.svelte';
	import PatternFrequencyTable from './PatternFrequencyTable.svelte';
	import type { Pattern, ProblemWithLogs, Difficulty } from '$lib/types';
	import { logsStore } from '$lib/stores/logsStore';
	import { RefreshCw } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import {
		calculateSkillMatchScore,
		getQualityWeight,
		type DifficultyProfile
	} from '$lib/utils/skillMatch';

	interface DynamicCompany {
		name: string;
		slug: string;
		color: string;
		patterns: Record<string, number>;
		patternCounts?: Record<string, number>;
		patternDifficulty?: Record<string, { Easy: number; Medium: number; Hard: number }>;
		totalProblems?: number;
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

	// Calculate user's solved problems by difficulty per pattern
	// This tracks which problems the user has solved and their difficulty levels
	// Now includes quality weighting based on solution status
	// IMPORTANT: Each problem is counted once per pattern it belongs to
	const userSolvedByDifficulty = $derived.by(() => {
		const solvedByPattern: Record<
			Pattern,
			{ 
				easy: number; 
				medium: number; 
				hard: number; 
				total: number;
				qualityWeighted: number; // Quality-weighted equivalent count
				problemIds: Set<string>; // Track unique problem IDs to prevent double counting
			}
		> = {} as Record<Pattern, { 
			easy: number; 
			medium: number; 
			hard: number; 
			total: number;
			qualityWeighted: number;
			problemIds: Set<string>;
		}>;

		// Count solved problems by pattern and difficulty
		// Use a Set to track which problems we've already counted for each pattern
		logsStore.problemsWithLogs.forEach((problem: ProblemWithLogs) => {
			// Only count problems that have been attempted (have logs)
			if (problem.logs.length > 0) {
				// Get the most recent log's status for quality weighting
				const lastLog = problem.logs[0]; // Logs are sorted by most recent first
				const qualityWeight = getQualityWeight(lastLog.status);
				
				// Track which patterns we've already processed for this problem to avoid duplicates
				const processedPatterns = new Set<Pattern>();
				
				problem.patterns.forEach((pattern: Pattern) => {
					// Skip if we've already processed this pattern for this problem
					// (handles duplicate patterns in the array)
					if (processedPatterns.has(pattern)) {
						return;
					}
					processedPatterns.add(pattern);
					
					if (!solvedByPattern[pattern]) {
						solvedByPattern[pattern] = { 
							easy: 0, 
							medium: 0, 
							hard: 0, 
							total: 0,
							qualityWeighted: 0,
							problemIds: new Set<string>()
						};
					}
					
					// Only count this problem once per pattern (use Set as source of truth)
					if (!solvedByPattern[pattern].problemIds.has(problem.id)) {
						solvedByPattern[pattern].problemIds.add(problem.id);
						solvedByPattern[pattern].total = solvedByPattern[pattern].problemIds.size; // Use Set size
						solvedByPattern[pattern].qualityWeighted += qualityWeight;
						
						// Count by difficulty (weighted by quality)
						const difficulty = problem.difficulty;
						if (difficulty === 'Easy') {
							solvedByPattern[pattern].easy += qualityWeight;
						} else if (difficulty === 'Medium') {
							solvedByPattern[pattern].medium += qualityWeight;
						} else if (difficulty === 'Hard') {
							solvedByPattern[pattern].hard += qualityWeight;
						}
					}
				});
			}
		});

		return solvedByPattern;
	});

	// Calculate realistic skill match scores using the new algorithm
	const skillMatchScores = $derived.by(() => {
		if (!currentCompanyData || !currentCompanyData.patternDifficulty) {
			return {} as Record<Pattern, number>;
		}

		const scores: Record<Pattern, number> = {} as Record<Pattern, number>;
		const companyDifficulty = currentCompanyData.patternDifficulty;
		const patternCounts = currentCompanyData.patternCounts || {};

		CORE_PATTERNS.forEach((pattern) => {
			const companyTotal = patternCounts[pattern] || 0;
			if (companyTotal === 0) {
				scores[pattern] = 0;
				return;
			}

			// Get user's solved problems for this pattern
			const userSolved = userSolvedByDifficulty[pattern];
			const userSolvedCount = userSolved?.total || 0;
			const qualityWeightedScore = userSolved?.qualityWeighted 
				? userSolved.qualityWeighted / companyTotal 
				: undefined;

			// Get difficulty profiles (now quality-weighted)
			const userProfile: DifficultyProfile = {
				easy: Math.round(userSolved?.easy || 0),
				medium: Math.round(userSolved?.medium || 0),
				hard: Math.round(userSolved?.hard || 0)
			};

			const companyProfile: DifficultyProfile = {
				easy: companyDifficulty[pattern]?.Easy || 0,
				medium: companyDifficulty[pattern]?.Medium || 0,
				hard: companyDifficulty[pattern]?.Hard || 0
			};

			// Calculate skill match score using the new algorithm
			// Pass quality-weighted score to account for solution quality
			const result = calculateSkillMatchScore(
				userSolvedCount,
				companyTotal,
				userProfile,
				companyProfile,
				10,
				qualityWeightedScore
			);

			scores[pattern] = result.score;
		});

		return scores;
	});

	// Calculate total questions answered by user
	const totalQuestionsAnswered = $derived.by(() => {
		return logsStore.problemsWithLogs.filter((problem) => problem.logs.length > 0).length;
	});

	const chartData = $derived.by(() => {
		if (!currentCompanyData) return { labels: [], primary: { label: 'You', data: [], color: '' }, comparison: { label: '', data: [], color: '' } };

		const patterns = currentCompanyData.patterns;
		const patternCounts = currentCompanyData.patternCounts || {};
		
		// Filter to only include patterns that have data (non-zero values in either user or company data)
		const patternsWithData = CORE_PATTERNS.filter((pattern) => {
			const userValue = skillMatchScores[pattern] || 0;
			const companyValue = patterns[pattern] || 0;
			return userValue > 0 || companyValue > 0;
		});

		// Use the new skill match scores (confidence-adjusted + difficulty-weighted)
		const userDataPoints = patternsWithData.map((pattern) => skillMatchScores[pattern] || 0);
		const companyDataPoints = patternsWithData.map((pattern) => patterns[pattern] || 0);
		const companyCounts = patternsWithData.map((pattern) => patternCounts[pattern] || 0);
		
		// Calculate user's actual problem count per pattern (not counting duplicates)
		// A problem should only be counted once per pattern, even if it has multiple patterns
		const userCounts = patternsWithData.map((pattern) => {
			const userSolved = userSolvedByDifficulty[pattern];
			// Use the Set size to ensure we're counting unique problems only
			const uniqueCount = userSolved?.problemIds?.size || 0;
			
			// Return the unique count (which should equal total, but use Set size as source of truth)
			return uniqueCount;
		});

		return {
			labels: patternsWithData,
			primary: {
				label: 'You',
				data: userDataPoints,
				counts: userCounts, // Show user's actual problem count
				color: 'hsl(217, 91%, 60%)' // Soft blue
			},
			comparison: {
				label: currentCompanyData.name,
				data: companyDataPoints,
				counts: companyCounts,
				color: currentCompanyData.color || '#6366f1'
			}
		};
	});
</script>

<div class="flex flex-col h-full">
	<p class="mb-4 text-sm text-muted-foreground">
		Compare your skill profile against our estimated requirements for top tech companies.
	</p>
	{#if currentCompanyData && currentCompanyData.totalProblems}
		<p class="mb-4 text-xs text-muted-foreground">
			Pattern frequency shows what percentage of {currentCompanyData.name}'s interview questions test each pattern. 
			Values are calculated from {currentCompanyData.totalProblems} actual interview questions.
		</p>
	{/if}

	<div class="mb-6 flex items-center gap-4">
		<div class="grid w-full max-w-sm items-center gap-1.5">
			<Label for="company-select">Target Company</Label>
			<div class="flex items-center gap-2">
				<select
					id="company-select"
					bind:value={selectedCompanySlug}
					class="flex h-10 w-[240px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
				>
					{#each companies as company (company.slug)}
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
		{#if isRefreshing}
			<div class="flex h-full items-center justify-center text-muted-foreground">
				Loading company data...
			</div>
		{:else if chartData.labels.length > 0}
			<RadarChart
				labels={chartData.labels}
				primaryData={chartData.primary}
				comparisonData={chartData.comparison}
				totalQuestionsAnswered={totalQuestionsAnswered}
			/>
		{:else if !currentCompanyData}
			<div class="flex h-full items-center justify-center text-muted-foreground">
				Select a company to see the comparison.
			</div>
		{:else}
			<div class="flex h-full items-center justify-center text-muted-foreground">
				No data available for this company.
			</div>
		{/if}
	</div>

	{#if currentCompanyData && currentCompanyData.patterns && Object.keys(currentCompanyData.patterns).length > 0}
		<div class="mt-auto pt-8">
			<PatternFrequencyTable
				patterns={currentCompanyData.patterns}
				patternCounts={currentCompanyData.patternCounts}
				totalProblems={currentCompanyData.totalProblems}
				companyName={currentCompanyData.name}
			/>
		</div>
	{/if}
</div>
