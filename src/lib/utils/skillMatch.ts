/**
 * Skill Match Algorithm Utilities
 * Implements confidence-adjusted + difficulty-weighted scoring
 */

import type { Difficulty, Pattern } from '$lib/types';

export interface DifficultyProfile {
	easy: number;
	medium: number;
	hard: number;
}

export interface SkillMatchResult {
	score: number;
	baseScore: number;
	confidenceFactor: number;
	confidenceAdjusted: number;
	difficultyAlignment: number;
	breakdown: {
		userSolved: number;
		companyTotal: number;
		sampleSize: number;
	};
}

/**
 * Calculate confidence factor based on sample size
 * Uses logarithmic scale: full confidence at 10+ samples
 */
export function calculateConfidenceFactor(
	sampleSize: number,
	minSamplesForConfidence: number = 10
): number {
	if (sampleSize >= minSamplesForConfidence) {
		return 1.0;
	}
	// Logarithmic confidence: log(n+1) / log(min_samples+1)
	return Math.log(sampleSize + 1) / Math.log(minSamplesForConfidence + 1);
}

/**
 * Calculate difficulty alignment score
 * Returns 0-1 score where 1 = perfect alignment
 */
export function calculateDifficultyAlignment(
	userProfile: DifficultyProfile,
	companyProfile: DifficultyProfile
): number {
	const userTotal = userProfile.easy + userProfile.medium + userProfile.hard;
	const companyTotal = companyProfile.easy + companyProfile.medium + companyProfile.hard;

	if (userTotal === 0 || companyTotal === 0) {
		return 0.5; // Neutral if no data
	}

	const userDist = {
		easy: userProfile.easy / userTotal,
		medium: userProfile.medium / userTotal,
		hard: userProfile.hard / userTotal
	};

	const companyDist = {
		easy: companyProfile.easy / companyTotal,
		medium: companyProfile.medium / companyTotal,
		hard: companyProfile.hard / companyTotal
	};

	// Weighted alignment: Hard problems are more important
	const weights = { easy: 0.3, medium: 1.0, hard: 1.5 };

	let alignment = 0;
	let totalWeight = 0;

	// Easy alignment
	if (userDist.easy > companyDist.easy) {
		// User solved more easy than company asks - not good alignment
		alignment += companyDist.easy * weights.easy * 0.7;
	} else {
		// Good alignment
		alignment += userDist.easy * weights.easy;
	}
	totalWeight += companyDist.easy * weights.easy;

	// Medium alignment
	if (userDist.medium < companyDist.medium) {
		// User solved fewer medium than company asks
		alignment += userDist.medium * weights.medium * 0.8;
	} else {
		// Good alignment (over-prepared is fine)
		alignment += companyDist.medium * weights.medium;
	}
	totalWeight += companyDist.medium * weights.medium;

	// Hard alignment
	if (userDist.hard < companyDist.hard) {
		// User solved fewer hard than company asks - not good alignment
		alignment += userDist.hard * weights.hard * 0.7;
	} else {
		// Good alignment (over-prepared is fine)
		alignment += companyDist.hard * weights.hard;
	}
	totalWeight += companyDist.hard * weights.hard;

	return totalWeight > 0 ? alignment / totalWeight : 0.5;
}

/**
 * Get quality weight for a solution status
 * Higher quality solutions contribute more to skill match
 */
export function getQualityWeight(status: string): number {
	switch (status) {
		case 'Optimal':
			return 1.0; // Full credit
		case 'Suboptimal':
			return 0.7; // 70% credit
		case 'Hints':
			return 0.5; // 50% credit
		case 'Solution':
			return 0.3; // 30% credit (looked at solution)
		case 'Failed':
			return 0.1; // 10% credit (attempted but failed)
		default:
			return 0.5; // Default neutral weight
	}
}

/**
 * Calculate realistic skill match score using composite algorithm
 * Now includes quality weighting based on solution status
 */
export function calculateSkillMatchScore(
	userSolved: number,
	companyTotal: number,
	userDifficultyProfile: DifficultyProfile,
	companyDifficultyProfile: DifficultyProfile,
	minSamplesForConfidence: number = 10,
	qualityWeightedScore?: number // Optional: quality-weighted equivalent score (0-1)
): SkillMatchResult {
	if (companyTotal === 0) {
		return {
			score: 0,
			baseScore: 0,
			confidenceFactor: 0,
			confidenceAdjusted: 0,
			difficultyAlignment: 0.5,
			breakdown: {
				userSolved: 0,
				companyTotal: 0,
				sampleSize: 0
			}
		};
	}

	// 1. Base percentage - use quality-weighted score if provided, otherwise use raw count
	const baseScore = qualityWeightedScore !== undefined
		? qualityWeightedScore * 100
		: (userSolved / companyTotal) * 100;

	// 2. Confidence adjustment
	const confidenceFactor = calculateConfidenceFactor(companyTotal, minSamplesForConfidence);
	let confidenceAdjusted = baseScore * confidenceFactor;

	// 3. Additional penalty for very small samples
	if (companyTotal < 5) {
		confidenceAdjusted *= 0.5; // Heavy penalty for tiny samples
	}

	// 4. Difficulty alignment
	const difficultyAlignment = calculateDifficultyAlignment(
		userDifficultyProfile,
		companyDifficultyProfile
	);

	// 5. Composite score: weighted combination
	// 70% weight on confidence-adjusted base, 30% on difficulty-aligned base
	const finalScore =
		confidenceAdjusted * 0.7 + (baseScore * difficultyAlignment) * 0.3;

	// 6. Additional penalties for very small samples
	let adjustedFinalScore = finalScore;
	if (companyTotal < 5) {
		adjustedFinalScore *= 0.6; // Extra penalty for tiny samples
	}

	return {
		score: Math.max(0, Math.min(100, Math.round(adjustedFinalScore))),
		baseScore: Math.round(baseScore),
		confidenceFactor: Math.round(confidenceFactor * 100) / 100,
		confidenceAdjusted: Math.round(confidenceAdjusted),
		difficultyAlignment: Math.round(difficultyAlignment * 100) / 100,
		breakdown: {
			userSolved,
			companyTotal,
			sampleSize: companyTotal
		}
	};
}

