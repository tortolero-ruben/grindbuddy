<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { CheckCircle2 } from 'lucide-svelte';
	import { openSearchModal } from '$lib/stores/logsStore';
</script>

<div class="flex flex-col items-center justify-center py-16 text-center">
	<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
		<CheckCircle2 class="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
	</div>
	<h2 class="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-50">
		You're all caught up!
	</h2>
	<p class="mb-6 text-slate-600 dark:text-slate-400">
		Great job. Want to do more? Log a new problem.
	</p>
	<Button onclick={openSearchModal} variant="primary">
		Find a Problem
	</Button>
</div>

