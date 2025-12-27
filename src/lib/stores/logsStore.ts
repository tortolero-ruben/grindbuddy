// Svelte 5 runes - modern reactive state management
// Direct runes usage for optimal performance and DX

import { writable, derived } from 'svelte/store';
import type { Log, Problem, ProblemWithLogs } from '$lib/types/index';

// Core stores
export const logs = writable<Log[]>([]);
export const problems = writable<Problem[]>([]);
export const isSearchModalOpen = writable(false);
export const isLogModalOpen = writable(false);
export const isDetailsModalOpen = writable(false);
export const selectedProblem = writable<Problem | null>(null);
export const selectedDetailsProblem = writable<ProblemWithLogs | null>(null);

// Initialize stores with data from server
export function initializeStores(data: { problems: Problem[]; logs: Log[] }) {
	logs.set(data.logs);
	problems.set(data.problems);
}

// Helper function to get logs for a problem
export function getLogsForProblem(problemId: string, logs: Log[]): Log[] {
	return logs
		.filter((log) => log.problemId === problemId)
		.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// Helper function to get last log for a problem
export function getLastLogForProblem(problemId: string, logs: Log[]): Log | undefined {
	const problemLogs = getLogsForProblem(problemId, logs);
	return problemLogs[0];
}

// Derived stores - reactive computed values
export const problemsWithLogs = derived([problems, logs], ([$problems, $logs]) => {
	return $problems.map((problem) => ({
		...problem,
		logs: $logs.filter((log) => log.problemId === problem.id),
		lastLog: getLastLogForProblem(problem.id, $logs)
	}));
});

export const reviewQueue = derived(problemsWithLogs, ($problemsWithLogs) => {
	return $problemsWithLogs.filter((problem) => {
		if (!problem.lastLog) return false; // Never logged, NOT in review queue
		if (problem.lastLog.status === 'Failed') return true; // Failed problems need review

		const daysSinceLastLog =
			(Date.now() - new Date(problem.lastLog.timestamp).getTime()) / (1000 * 60 * 60 * 24);
		return daysSinceLastLog >= 1; // Review if last log was 1+ days ago
	});
});

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

export function openDetailsModal(problem: ProblemWithLogs) {
	selectedDetailsProblem.set(problem);
	isDetailsModalOpen.set(true);
}

export function closeDetailsModal() {
	isDetailsModalOpen.set(false);
	selectedDetailsProblem.set(null);
}