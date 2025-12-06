import type { Log, Status } from '$lib/types';

// Mock log entries with various statuses and timestamps
export const mockLogs: Log[] = [
	{
		id: 'log1',
		problemId: '1',
		status: 'Optimal',
		timeComplexity: 'O(n)',
		spaceComplexity: 'O(n)',
		notes: 'Used hash map to store complements. Clean solution.',
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
	},
	{
		id: 'log2',
		problemId: '2',
		status: 'Suboptimal',
		timeComplexity: 'O(n²)',
		spaceComplexity: 'O(1)',
		notes: 'Brute force approach. Could optimize with single pass.',
		timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
	},
	{
		id: 'log3',
		problemId: '3',
		status: 'Optimal',
		timeComplexity: 'O(n)',
		spaceComplexity: 'O(n)',
		notes: 'Hash set solution. Very straightforward.',
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
	},
	{
		id: 'log4',
		problemId: '4',
		status: 'Hints',
		timeComplexity: 'O(n)',
		spaceComplexity: 'O(n)',
		notes: 'Needed hint about prefix and suffix products.',
		timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
	},
	{
		id: 'log5',
		problemId: '5',
		status: 'Failed',
		timeComplexity: undefined,
		spaceComplexity: undefined,
		notes: 'Could not solve. Need to review Kadane algorithm.',
		timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
	},
	{
		id: 'log6',
		problemId: '6',
		status: 'Solution',
		timeComplexity: 'O(n²)',
		spaceComplexity: 'O(1)',
		notes: 'Had to look at solution. Two pointer approach with sorting.',
		timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
	},
	{
		id: 'log7',
		problemId: '11',
		status: 'Optimal',
		timeComplexity: 'O(n)',
		spaceComplexity: 'O(n)',
		notes: 'Stack-based solution. Clean implementation.',
		timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000) // 6 days ago
	},
	{
		id: 'log8',
		problemId: '12',
		status: 'Suboptimal',
		timeComplexity: 'O(n + m)',
		spaceComplexity: 'O(n + m)',
		notes: 'Created new list. Could do in-place.',
		timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) // 8 days ago
	},
	{
		id: 'log9',
		problemId: '13',
		status: 'Optimal',
		timeComplexity: 'O(n)',
		spaceComplexity: 'O(1)',
		notes: 'Fibonacci pattern. DP with space optimization.',
		timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
	},
	{
		id: 'log10',
		problemId: '14',
		status: 'Hints',
		timeComplexity: 'O(n)',
		spaceComplexity: 'O(h)',
		notes: 'Needed hint about min/max bounds for BST validation.',
		timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
	}
];

// Helper function to get logs for a problem
export function getLogsForProblem(problemId: string, logs: Log[]): Log[] {
	return logs.filter((log) => log.problemId === problemId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Helper function to get last log for a problem
export function getLastLogForProblem(problemId: string, logs: Log[]): Log | undefined {
	const problemLogs = getLogsForProblem(problemId, logs);
	return problemLogs[0];
}

