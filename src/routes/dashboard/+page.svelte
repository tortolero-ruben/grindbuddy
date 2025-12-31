<script lang="ts">
	import ProblemCard from '$lib/components/dashboard/ProblemCard.svelte';
	import ZeroState from '$lib/components/dashboard/ZeroState.svelte';
	import { logsStore } from '$lib/stores/logsStore';
</script>

<div class="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
	<!-- Header -->
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-h1">Today's Review Queue</h1>
		{#if logsStore.reviewQueue.length > 0}
			<span class="text-small text-slate-600 dark:text-slate-400">
				{logsStore.reviewQueue.length} {logsStore.reviewQueue.length === 1 ? 'problem' : 'problems'} to review
			</span>
		{/if}
	</div>

	<!-- Review List or Zero State -->
	{#if logsStore.reviewQueue.length === 0}
		<ZeroState />
	{:else}
		<div class="flex flex-col gap-4">
			{#each logsStore.reviewQueue as problem (problem.id)}
				<ProblemCard {problem} />
			{/each}
		</div>
	{/if}
</div>

