<script lang="ts">
	import type { Pattern } from '$lib/types';

	interface PatternFrequency {
		pattern: Pattern;
		percentage: number;
		count: number;
	}

	let {
		patterns,
		patternCounts = {},
		totalProblems,
		companyName,
		description
	}: {
		patterns: Record<string, number>;
		patternCounts?: Record<string, number>;
		totalProblems?: number;
		companyName: string;
		description?: string;
	} = $props();

	const patternFrequencies = $derived.by(() => {
		const frequencies: PatternFrequency[] = [];

		Object.entries(patterns).forEach(([pattern, percentage]) => {
			frequencies.push({
				pattern: pattern as Pattern,
				percentage,
				count: patternCounts[pattern] || 0
			});
		});

		// Sort by percentage descending
		return frequencies.sort((a, b) => b.percentage - a.percentage);
	});

	function getFrequencyLabel(percentage: number): string {
		if (percentage >= 70) return 'Very Common';
		if (percentage >= 40) return 'Common';
		if (percentage >= 20) return 'Moderate';
		if (percentage > 0) return 'Rare';
		return 'Not Tested';
	}

	function getFrequencyColor(percentage: number): string {
		if (percentage >= 70) return 'bg-emerald-500';
		if (percentage >= 40) return 'bg-blue-500';
		if (percentage >= 20) return 'bg-amber-500';
		if (percentage > 0) return 'bg-slate-400';
		return 'bg-slate-300';
	}
</script>

<div class="w-full">
	<div class="mb-4">
		<h3 class="text-lg font-semibold mb-2">Pattern Frequency Breakdown</h3>
		<p class="text-sm text-muted-foreground">
			{description || `Detailed breakdown of how often ${companyName} tests each pattern in their interviews.`}
		</p>
	</div>

	<div class="rounded-lg border border-border overflow-hidden">
		<div class="max-h-[400px] overflow-y-auto">
			<table class="w-full">
				<thead class="bg-muted sticky top-0 z-10">
					<tr>
						<th class="px-4 py-3 text-left text-sm font-medium">Pattern</th>
						<th class="px-4 py-3 text-center text-sm font-medium">Frequency</th>
						<th class="px-4 py-3 text-center text-sm font-medium">Count</th>
						<th class="px-4 py-3 text-center text-sm font-medium">Category</th>
					</tr>
				</thead>
				<tbody>
					{#each patternFrequencies as { pattern, percentage, count } (pattern)}
						<tr class="border-t border-border hover:bg-muted/50 transition-colors">
							<td class="px-4 py-3 text-sm font-medium">{pattern}</td>
							<td class="px-4 py-3 text-center">
								<div class="flex items-center justify-center gap-2">
									<div class="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
										<div
											class="h-2 rounded-full {getFrequencyColor(percentage)} transition-all"
											style="width: {percentage}%"
										></div>
									</div>
									<span class="text-sm font-medium w-12 text-right">{percentage}%</span>
								</div>
							</td>
							<td class="px-4 py-3 text-center text-sm text-muted-foreground">
								{count} {count === 1 ? 'question' : 'questions'}
							</td>
							<td class="px-4 py-3 text-center">
								<span
									class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium {getFrequencyColor(
										percentage
									)} text-white"
								>
									{getFrequencyLabel(percentage)}
								</span>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>

	{#if totalProblems}
		<p class="mt-3 text-xs text-muted-foreground text-center">
			{companyName === 'Your Mastery' 
				? `Based on ${totalProblems} total problems available`
				: `Based on ${totalProblems} interview questions from ${companyName}`}
		</p>
	{/if}
</div>

