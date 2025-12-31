import type { Log, Problem, ProblemWithLogs } from '$lib/types/index';

class LogsStore {
    logs = $state<Log[]>([]);
    problems = $state<Problem[]>([]);
    isSearchModalOpen = $state(false);
    isLogModalOpen = $state(false);
    isDetailsModalOpen = $state(false);
    selectedProblem = $state<Problem | null>(null);
    selectedDetailsProblem = $state<ProblemWithLogs | null>(null);

    problemsWithLogs = $derived.by(() => {
        // Create a map of logs by problemId for O(1) lookup
        const logsByProblemId = new Map<string, Log[]>();
        this.logs.forEach(log => {
            if (!logsByProblemId.has(log.problemId)) {
                logsByProblemId.set(log.problemId, []);
            }
            logsByProblemId.get(log.problemId)!.push(log);
        });
        
        // Sort logs once per problem
        logsByProblemId.forEach((logs, problemId) => {
            logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        });
        
        return this.problems.map(problem => {
            const problemLogs = logsByProblemId.get(problem.id) || [];
            return {
                ...problem,
                logs: problemLogs,
                lastLog: problemLogs[0] || undefined
            };
        });
    });

    reviewQueue = $derived.by(() => {
        return this.problemsWithLogs.filter(problem => {
            if (!problem.lastLog) return false;
            if (problem.lastLog.status === 'Failed') return true;
            const daysSinceLastLog = (Date.now() - new Date(problem.lastLog.timestamp).getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceLastLog >= 1;
        });
    });

    initialize(data: { problems: Problem[]; logs: Log[] }) {
        // Only initialize if stores are empty (first load)
        if (this.logs.length === 0) {
            // Normalize timestamps - convert strings to Date objects
            this.logs = data.logs.map(log => ({
                ...log,
                timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp)
            })) as Log[];
            this.problems = data.problems as Problem[];
        }
    }

    addLog(log: Log) {
        // Check if log already exists (by id) to avoid duplicates
        if (!this.logs.find(l => l.id === log.id)) {
            this.logs.push(log);
            // Sort by timestamp (newest first) to maintain order
            this.logs.sort((a, b) => 
                new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            );
        }
    }

    updateLogs(newLogs: Log[]) {
        // Early return if no new logs
        if (!newLogs || newLogs.length === 0) return;
        
        // Normalize timestamps - convert strings to Date objects
        const normalizedLogs = newLogs.map(log => ({
            ...log,
            timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp)
        }));
        
        // Create a map of existing log IDs for fast lookup
        const existingIds = new Set(this.logs.map(l => l.id));
        const newLogIds = new Set(normalizedLogs.map(l => l.id));
        
        // Check if we actually have new logs to add
        const hasNewLogs = normalizedLogs.some(l => !existingIds.has(l.id));
        const hasUpdatedLogs = normalizedLogs.some(l => {
            const existing = this.logs.find(el => el.id === l.id);
            return existing && (
                existing.status !== l.status ||
                existing.timeComplexity !== l.timeComplexity ||
                existing.spaceComplexity !== l.spaceComplexity ||
                existing.notes !== l.notes ||
                existing.timestamp.getTime() !== l.timestamp.getTime()
            );
        });
        
        // Only update if there are actual changes
        if (!hasNewLogs && !hasUpdatedLogs) return;
        
        // Keep existing logs that aren't in the new data (optimistic updates)
        const logsToKeep = this.logs.filter(l => !newLogIds.has(l.id));
        
        // Combine: existing optimistic logs + fresh server data
        this.logs = [...logsToKeep, ...normalizedLogs].sort((a, b) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
    }

    openSearchModal() {
        this.isSearchModalOpen = true;
    }
    closeSearchModal() {
        this.isSearchModalOpen = false;
    }
    openLogModal(problem: Problem) {
        this.selectedProblem = problem;
        this.isLogModalOpen = true;
    }
    closeLogModal() {
        this.isLogModalOpen = false;
        this.selectedProblem = null;
    }
    openDetailsModal(problem: ProblemWithLogs) {
        this.selectedDetailsProblem = problem;
        this.isDetailsModalOpen = true;
    }
    closeDetailsModal() {
        this.isDetailsModalOpen = false;
        this.selectedDetailsProblem = null;
    }
}

export const logsStore = new LogsStore();

export function getLogsForProblem(problemId: string, logs: Log[]) {
    return logs
        .filter(log => log.problemId === problemId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function getProblemById(id: string, problems: Problem[]) {
    return problems.find(p => p.id === id);
}
