import type { Pattern } from '$lib/types';

export interface CompanyProfile {
    name: string;
    slug: string;
    color: string;
    patterns: Partial<Record<Pattern, number>>;
}

export const COMPANY_PROFILES: CompanyProfile[] = [
    {
        name: 'Google',
        slug: 'google',
        color: 'rgb(234, 67, 53)', // Google Red
        patterns: {
            'Graphs': 95,
            'Advanced Graphs': 90,
            'Trees': 85,
            '2-D Dynamic Programming': 80,
            '1-D Dynamic Programming': 75,
            'Recursion': 90, // Mapped to Backtracking roughly if needed, or ad-hoc
            'Backtracking': 70,
            'Arrays & Hashing': 60,
            'Greedy': 65
        }
    },
    {
        name: 'Meta',
        slug: 'meta',
        color: 'rgb(6, 104, 225)', // Meta Blue
        patterns: {
            'Arrays & Hashing': 95,
            'Two Pointers': 90,
            'Trees': 85,
            'Graphs': 80,
            'Sliding Window': 85,
            'String': 80, // Not in Pattern type, fitting into Arrays mostly
            'Heap/Priority Queue': 75,
            'Backtracking': 70
        }
    },
    {
        name: 'Amazon',
        slug: 'amazon',
        color: 'rgb(255, 153, 0)', // Amazon Orange
        patterns: {
            'Arrays & Hashing': 90,
            'Trees': 85,
            'Graphs': 80,
            'Sliding Window': 75,
            'Heap/Priority Queue': 70,
            'Object-Oriented Design': 85, // Special case, might need handling
            'Linked List': 60
        }
    },
    {
        name: 'Microsoft',
        slug: 'microsoft',
        color: 'rgb(0, 164, 239)', // Microsoft Blue
        patterns: {
            'Arrays & Hashing': 85,
            'Trees': 80,
            'Linked List': 75,
            'Blind 75': 80, // General coverage
            'Backtracking': 60
        }
    },
    {
        name: 'Netflix',
        slug: 'netflix',
        color: 'rgb(229, 9, 20)', // Netflix Red
        patterns: {
            'Advanced Graphs': 90,
            'System Design': 95, // Not a pattern but key
            'Concurrency': 85,
            'Arrays & Hashing': 70
        }
    }
];
