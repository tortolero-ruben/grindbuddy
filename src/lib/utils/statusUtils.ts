import type { Status, Difficulty } from '$lib/types';

export function getStatusColor(status: Status): string {
	switch (status) {
		case 'Optimal':
			return 'bg-emerald-600 dark:bg-emerald-400 text-white';
		case 'Suboptimal':
			return 'bg-amber-500 dark:bg-amber-400 text-white';
		case 'Hints':
			return 'bg-blue-500 dark:bg-blue-400 text-white';
		case 'Solution':
			return 'bg-purple-500 dark:bg-purple-400 text-white';
		case 'Failed':
			return 'bg-rose-600 dark:bg-rose-500 text-white';
		default:
			return 'bg-slate-500 text-white';
	}
}

export function getDifficultyColor(difficulty: Difficulty): string {
	switch (difficulty) {
		case 'Easy':
			return 'bg-emerald-600 dark:bg-emerald-400 text-white';
		case 'Medium':
			return 'bg-amber-500 dark:bg-amber-400 text-white';
		case 'Hard':
			return 'bg-rose-600 dark:bg-rose-500 text-white';
		default:
			return 'bg-slate-500 text-white';
	}
}

export function getStatusIcon(status: Status): string {
	switch (status) {
		case 'Optimal':
			return 'Zap';
		case 'Suboptimal':
			return 'CheckCircle';
		case 'Hints':
			return 'HelpCircle';
		case 'Solution':
			return 'Eye';
		case 'Failed':
			return 'AlertTriangle';
		default:
			return 'Circle';
	}
}

