// Svelte 5 runes - modern reactive state management
// Direct runes usage for optimal performance and DX

import { writable, derived } from 'svelte/store';
import type { Log, Problem, ProblemWithLogs } from '$lib/types';
import { mockLogs } from '$lib/data/mockLogs';
import { mockProblems } from '$lib/data/mockProblems';
import { getLastLogForProblem } from '$lib/data/mockLogs';

// Core stores
export const logs = writable<Log[]>(mockLogs);
export const problems = writable<Problem[]>(mockProblems);
export const isSearchModalOpen = writable(false);
export const isLogModalOpen = writable(false);
export const selectedProblem = writable<Problem | null>(null);

// Derived stores - reactive computed values
export const problemsWithLogs = derived(
	[problems, logs],
	([$problems, $logs]) => {
		return $problems.map((problem) => ({
			...problem,
			logs: $logs.filter((log) => log.problemId === problem.id),
			lastLog: getLastLogForProblem(problem.id, $logs)
		}));
	}
);

export const reviewQueue = derived(
	problemsWithLogs,
	($problemsWithLogs) => {
		return $problemsWithLogs.filter((problem) => {
			if (!problem.lastLog) return true; // Never logged, needs review
			if (problem.lastLog.status === 'Failed') return true; // Failed problems need review

			const daysSinceLastLog = (Date.now() - problem.lastLog.timestamp.getTime()) / (1000 * 60 * 60 * 24);
			return daysSinceLastLog >= 1; // Review if last log was 1+ days ago
		});
	}
);

// Actions to mutate state
export function addLog(log: Log) {
	logs.update((currentLogs) => [...currentLogs, log]);
}

export function openSearchModal() {
	isSearchModalOpen.set(true);
}

export function closeSearchModal() {
	isSearchModalOpen.set(false);
}

export function openLogModal(problem: Problem) {
	selectedProblem.set(problem);
	isLogModalOpen.set(true);
}

export function closeLogModal() {
	isLogModalOpen.set(false);
	selectedProblem.set(null);
}