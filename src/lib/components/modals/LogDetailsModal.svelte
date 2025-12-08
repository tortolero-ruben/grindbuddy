<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/Button.svelte';
	import Textarea from '$lib/components/ui/Textarea.svelte';
	import Select from '$lib/components/ui/Select.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	import PatternBadge from '$lib/components/ui/PatternBadge.svelte';
	import { selectedProblem, closeLogModal, addLog } from '$lib/stores/logsStore';
	import type { Status, Log } from '$lib/types';
	import { Zap, CheckCircle, HelpCircle, Eye, AlertTriangle } from 'lucide-svelte';

	interface Props {
		open: boolean;
		onClose: () => void;
	}

	let { open, onClose }: Props = $props();

	let outcome: Status | '' = $state('');
	let timeComplexity = $state('');
	let spaceComplexity = $state('');
	let notes = $state('');

	const statusOptions: Status[] = ['Optimal', 'Suboptimal', 'Hints', 'Solution', 'Failed'];
	const statusIcons = {
		Optimal: Zap,
		Suboptimal: CheckCircle,
		Hints: HelpCircle,
		Solution: Eye,
		Failed: AlertTriangle
	};
	const statusColors = {
		Optimal: 'bg-emerald-600 dark:bg-emerald-400',
		Suboptimal: 'bg-amber-500 dark:bg-amber-400',
		Hints: 'bg-blue-500 dark:bg-blue-400',
		Solution: 'bg-purple-500 dark:bg-purple-400',
		Failed: 'bg-rose-600 dark:bg-rose-500'
	};

	const complexityOptions = [
		{ value: '', label: 'Select...' },
		{ value: 'O(1)', label: 'O(1)' },
		{ value: 'O(log n)', label: 'O(log n)' },
		{ value: 'O(n)', label: 'O(n)' },
		{ value: 'O(n log n)', label: 'O(n log n)' },
		{ value: 'O(n²)', label: 'O(n²)' },
		{ value: 'O(n³)', label: 'O(n³)' },
		{ value: 'O(2^n)', label: 'O(2^n)' },
		{ value: 'O(n!)', label: 'O(n!)' }
	];

	const canSave = $derived(outcome !== '' && notes.trim() !== '');

	$effect(() => {
		if (open && $selectedProblem) {
			outcome = '';
			timeComplexity = '';
			spaceComplexity = '';
			notes = '';
		}
	});

	function handleSave() {
		if (!$selectedProblem || !canSave) return;

		const newLog = {
			id: `log-${Date.now()}`,
			problemId: $selectedProblem.id,
			status: outcome as Status,
			timeComplexity: timeComplexity || undefined,
			spaceComplexity: spaceComplexity || undefined,
			notes: notes.trim(),
			timestamp: new Date()
		};

		addLog(newLog);
		closeLogModal();
	}
</script>

{#if $selectedProblem}
	<Dialog {open} {onClose} class="md:flex">
		<div class="p-6">
			<!-- Header -->
			<div class="mb-6">
				<h2 class="mb-2 text-xl font-semibold">{$selectedProblem.title}</h2>
				<div class="flex flex-wrap items-center gap-2">
					<DifficultyBadge difficulty={$selectedProblem.difficulty} />
					{#each $selectedProblem.patterns as pattern (pattern)}
						<PatternBadge {pattern} />
					{/each}
				</div>
			</div>

			<!-- Form -->
			<form
				method="POST"
				action="/?/createLog"
				use:enhance={() => {
					return async ({ result, update }) => {
						if (result.type === 'success') {
							onClose();
							await update();
						}
					};
				}}
				class="space-y-6"
			>
				<input type="hidden" name="problemId" value={$selectedProblem.id} />
				<input type="hidden" name="status" value={outcome} />

				<!-- Outcome Section -->
				<fieldset>
					<legend class="mb-2 block text-sm font-medium">Outcome (Required)</legend>
					<div class="grid grid-cols-2 gap-2 sm:grid-cols-5">
						{#each statusOptions as status (status)}
							{@const Icon = statusIcons[status]}
							{@const isSelected = outcome === status}
							<button
								type="button"
								class="flex flex-col items-center gap-2 rounded-lg border-2 p-3 transition-colors {isSelected
									? `${statusColors[status]} border-transparent text-white`
									: 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50 hover:bg-slate-50 dark:hover:bg-slate-900'}"
								onclick={() => (outcome = status)}
							>
								<Icon class="h-5 w-5" />
								<span class="text-xs">{status}</span>
							</button>
						{/each}
					</div>
				</fieldset>

				<!-- Complexity Section -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="time-complexity" class="mb-2 block text-sm font-medium"
							>Time Complexity (Optional)</label
						>
						<Select
							name="timeComplexity"
							id="time-complexity"
							options={complexityOptions}
							bind:value={timeComplexity}
						/>
					</div>
					<div>
						<label for="space-complexity" class="mb-2 block text-sm font-medium"
							>Space Complexity (Optional)</label
						>
						<Select
							name="spaceComplexity"
							id="space-complexity"
							options={complexityOptions}
							bind:value={spaceComplexity}
						/>
					</div>
				</div>

				<!-- Notes Section -->
				<div>
					<label for="notes" class="mb-2 block text-sm font-medium">Notes (Required)</label>
					<Textarea
						name="notes"
						id="notes"
						bind:value={notes}
						placeholder="Briefly explain the intuition..."
						rows={4}
					/>
				</div>

				<!-- Footer -->
				<div class="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
					<Button variant="secondary" onclick={onClose} type="button">Cancel</Button>
					<Button variant="primary" disabled={!canSave} type="submit">Save Log</Button>
				</div>
			</form>
		</div>
	</Dialog>
{/if}
