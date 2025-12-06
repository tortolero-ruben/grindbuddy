import type { Problem, Pattern, Difficulty } from '$lib/types';

// Sample problems from Neetcode 150 + Blind 75
export const mockProblems: Problem[] = [
	{
		id: '1',
		number: 1,
		title: 'Two Sum',
		difficulty: 'Easy',
		patterns: ['Arrays & Hashing'],
		leetcodeUrl: 'https://leetcode.com/problems/two-sum/'
	},
	{
		id: '2',
		number: 2,
		title: 'Best Time to Buy and Sell Stock',
		difficulty: 'Easy',
		patterns: ['Arrays & Hashing', '1-D Dynamic Programming'],
		leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
	},
	{
		id: '3',
		number: 3,
		title: 'Contains Duplicate',
		difficulty: 'Easy',
		patterns: ['Arrays & Hashing'],
		leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/'
	},
	{
		id: '4',
		number: 4,
		title: 'Product of Array Except Self',
		difficulty: 'Medium',
		patterns: ['Arrays & Hashing'],
		leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/'
	},
	{
		id: '5',
		number: 5,
		title: 'Maximum Subarray',
		difficulty: 'Medium',
		patterns: ['Arrays & Hashing', '1-D Dynamic Programming'],
		leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/'
	},
	{
		id: '6',
		number: 15,
		title: '3Sum',
		difficulty: 'Medium',
		patterns: ['Arrays & Hashing', 'Two Pointers'],
		leetcodeUrl: 'https://leetcode.com/problems/3sum/'
	},
	{
		id: '7',
		number: 53,
		title: 'Maximum Subarray',
		difficulty: 'Medium',
		patterns: ['Arrays & Hashing', '1-D Dynamic Programming'],
		leetcodeUrl: 'https://leetcode.com/problems/maximum-subarray/'
	},
	{
		id: '8',
		number: 121,
		title: 'Best Time to Buy and Sell Stock',
		difficulty: 'Easy',
		patterns: ['Arrays & Hashing', '1-D Dynamic Programming'],
		leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
	},
	{
		id: '9',
		number: 217,
		title: 'Contains Duplicate',
		difficulty: 'Easy',
		patterns: ['Arrays & Hashing'],
		leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/'
	},
	{
		id: '10',
		number: 238,
		title: 'Product of Array Except Self',
		difficulty: 'Medium',
		patterns: ['Arrays & Hashing'],
		leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/'
	},
	{
		id: '11',
		number: 20,
		title: 'Valid Parentheses',
		difficulty: 'Easy',
		patterns: ['Stack'],
		leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/'
	},
	{
		id: '12',
		number: 21,
		title: 'Merge Two Sorted Lists',
		difficulty: 'Easy',
		patterns: ['Linked List'],
		leetcodeUrl: 'https://leetcode.com/problems/merge-two-sorted-lists/'
	},
	{
		id: '13',
		number: 70,
		title: 'Climbing Stairs',
		difficulty: 'Easy',
		patterns: ['1-D Dynamic Programming'],
		leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/'
	},
	{
		id: '14',
		number: 98,
		title: 'Validate Binary Search Tree',
		difficulty: 'Medium',
		patterns: ['Trees'],
		leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/'
	},
	{
		id: '15',
		number: 206,
		title: 'Reverse Linked List',
		difficulty: 'Easy',
		patterns: ['Linked List'],
		leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/'
	},
	{
		id: '16',
		number: 226,
		title: 'Invert Binary Tree',
		difficulty: 'Easy',
		patterns: ['Trees'],
		leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/'
	},
	{
		id: '17',
		number: 104,
		title: 'Maximum Depth of Binary Tree',
		difficulty: 'Easy',
		patterns: ['Trees'],
		leetcodeUrl: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/'
	},
	{
		id: '18',
		number: 100,
		title: 'Same Tree',
		difficulty: 'Easy',
		patterns: ['Trees'],
		leetcodeUrl: 'https://leetcode.com/problems/same-tree/'
	},
	{
		id: '19',
		number: 572,
		title: 'Subtree of Another Tree',
		difficulty: 'Easy',
		patterns: ['Trees'],
		leetcodeUrl: 'https://leetcode.com/problems/subtree-of-another-tree/'
	},
	{
		id: '20',
		number: 235,
		title: 'Lowest Common Ancestor of a Binary Search Tree',
		difficulty: 'Medium',
		patterns: ['Trees'],
		leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/'
	}
];

// Helper function to search problems
export function searchProblems(query: string, problems: Problem[]): Problem[] {
	if (!query.trim()) return problems;
	const lowerQuery = query.toLowerCase();
	return problems.filter(
		(p) =>
			p.title.toLowerCase().includes(lowerQuery) ||
			p.number.toString().includes(query) ||
			p.patterns.some((pattern) => pattern.toLowerCase().includes(lowerQuery))
	);
}

