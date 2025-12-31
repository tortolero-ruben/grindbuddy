// Svelte 5 runes - modern reactive state management
// Re-export runes-based store for direct access without get()

import { logsStore } from './logsStore.svelte';
import type { Log, Problem, ProblemWithLogs } from '$lib/types/index';

// Export the store instance so runes maintain reactivity
export { logsStore };

// Export runes-based state directly (accessing through store instance maintains reactivity)
export const logs = logsStore.logs;
export const problems = logsStore.problems;
export const isSearchModalOpen = logsStore.isSearchModalOpen;
export const isLogModalOpen = logsStore.isLogModalOpen;
export const isDetailsModalOpen = logsStore.isDetailsModalOpen;
export const selectedProblem = logsStore.selectedProblem;
export const selectedDetailsProblem = logsStore.selectedDetailsProblem;
export const problemsWithLogs = logsStore.problemsWithLogs;
export const reviewQueue = logsStore.reviewQueue;

// Initialize stores with data from server
export function initializeStores(data: { problems: Problem[]; logs: Log[] }) {
	logsStore.initialize(data);
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

// Actions to mutate state
export function addLog(log: Log) {
	logsStore.addLog(log);
}

export function updateLogs(logs: Log[]) {
	logsStore.updateLogs(logs);
}

export function openSearchModal() {
	logsStore.openSearchModal();
}

export function closeSearchModal() {
	logsStore.closeSearchModal();
}

export function openLogModal(problem: Problem) {
	logsStore.openLogModal(problem);
}

export function closeLogModal() {
	logsStore.closeLogModal();
}

export function openDetailsModal(problem: ProblemWithLogs) {
	logsStore.openDetailsModal(problem);
}

export function closeDetailsModal() {
	logsStore.closeDetailsModal();
}