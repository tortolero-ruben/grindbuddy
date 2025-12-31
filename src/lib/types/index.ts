export type Status = 'Optimal' | 'Suboptimal' | 'Hints' | 'Solution' | 'Failed';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Pattern =
	| 'Arrays & Hashing'
	| 'Two Pointers'
	| 'Sliding Window'
	| 'Stack'
	| 'Binary Search'
	| 'Linked List'
	| 'Trees'
	| 'Tries'
	| 'Backtracking'
	| 'Heap/Priority Queue'
	| 'Graphs'
	| 'Advanced Graphs'
	| '1-D Dynamic Programming'
	| '2-D Dynamic Programming'
	| 'Greedy'
	| 'Intervals'
	| 'Math & Geometry'
	| 'Bit Manipulation'
	| 'Recursion'
	| 'String'
	| 'Object-Oriented Design'
	| 'Blind 75'
	| 'System Design'
	| 'Concurrency';


export interface Problem {
	id: string;
	number: number;
	title: string;
	difficulty: Difficulty;
	patterns: Pattern[];
	leetcodeUrl: string;
	neetcodeUrl?: string;
}

export interface Log {
	id: string;
	problemId: string;
	status: Status;
	timeComplexity?: string;
	spaceComplexity?: string;
	notes: string;
	timestamp: Date;
}

export interface ProblemWithLogs extends Problem {
	logs: Log[];
	lastLog?: Log;
}

