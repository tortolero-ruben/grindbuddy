<script lang="ts">
	import Dialog from '$lib/components/ui/Dialog.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import DifficultyBadge from '$lib/components/ui/DifficultyBadge.svelte';
	import PatternBadge from '$lib/components/ui/PatternBadge.svelte';
	import StatusBadge from '$lib/components/ui/StatusBadge.svelte';
	import HistoryTimeline from '$lib/components/logbook/HistoryTimeline.svelte';
	import { ExternalLink, Plus, X } from '@lucide/svelte';
	import type { ProblemWithLogs } from '$lib/types';
	import { openLogModal } from '$lib/stores/logsStore';

	function formatRelativeTime(date: Date): string {
		const now = new Date();
		const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

		if (diffInSeconds < 60) {
			return 'just now';
		}

		const diffInMinutes = Math.floor(diffInSeconds / 60);
		if (diffInMinutes < 60) {
			return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
		}

		const diffInHours = Math.floor(diffInMinutes / 60);
		if (diffInHours < 24) {
			return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
		}

		const diffInDays = Math.floor(diffInHours / 24);
		if (diffInDays < 7) {
			return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
		}

		const diffInWeeks = Math.floor(diffInDays / 7);
		if (diffInWeeks < 4) {
			return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
		}

		const diffInMonths = Math.floor(diffInDays / 30);
		return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
	}

	interface Props {
		open: boolean;
		onClose: () => void;
		problem: ProblemWithLogs | null;
	}

	let { open, onClose, problem }: Props = $props();
</script>

{#if problem}
	<Dialog {open} {onClose} class="max-w-4xl">
		<div class="relative p-0 overflow-hidden">
			<!-- Banner Color -->
			<div
				class="h-2 w-full {problem.lastLog ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-800'}"
			></div>

			<div class="p-6">
				<!-- Header -->
				<div class="flex justify-between items-start mb-6">
					<div>
						<h2 class="text-2xl font-mono font-bold text-slate-900 dark:text-slate-50">
							#{problem.number}
							{problem.title}
						</h2>
						<div class="flex flex-wrap items-center gap-2 mt-2">
							<DifficultyBadge difficulty={problem.difficulty} />
							{#each problem.patterns as pattern (pattern)}
								<PatternBadge {pattern} />
							{/each}
						</div>
					</div>
					<button
						onclick={onClose}
						class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
						aria-label="Close"
					>
						<X class="h-5 w-5" />
					</button>
				</div>

				<!-- Stats/Status -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
					<div
						class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50"
					>
						<div class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
							Current Status
						</div>
						{#if problem.lastLog}
							<div class="flex items-center gap-2">
								<StatusBadge status={problem.lastLog.status} showIcon={true} />
								<span class="text-sm text-slate-600 dark:text-slate-400">
									Logged {formatRelativeTime(problem.lastLog.timestamp)}
								</span>
							</div>
						{:else}
							<span class="text-sm text-slate-400">Never logged</span>
						{/if}
					</div>
					<div
						class="rounded-xl border border-slate-200 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/50"
					>
						<div class="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
							Actions
						</div>
						<div class="flex flex-wrap items-center gap-3">
							<a
								href={problem.leetcodeUrl}
								target="_blank"
								rel="noopener noreferrer"
								class="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
							>
								<ExternalLink class="h-4 w-4" />
								LeetCode
							</a>
							{#if problem.neetcodeUrl}
								<a
									href={problem.neetcodeUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
								>
									<ExternalLink class="h-4 w-4" />
									NeetCode
								</a>
							{/if}
							<Button
								variant="primary"
								size="sm"
								onclick={() => {
									onClose();
									openLogModal(problem);
								}}
							>
								<Plus class="mr-1.5 h-4 w-4" />
								Log Attempt
							</Button>
						</div>
					</div>
				</div>

				<!-- History -->
				<div class="space-y-4">
					<h3 class="text-sm font-bold uppercase tracking-widest text-slate-500">
						History & Notes
					</h3>
					<div class="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
						<HistoryTimeline problemId={problem.id} />
					</div>
				</div>
			</div>
		</div>
	</Dialog>
{/if}

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: #e2e8f0;
		border-radius: 10px;
	}
	:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
		background: #1e293b;
	}
</style>
