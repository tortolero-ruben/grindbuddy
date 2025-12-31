"""
Skill Match Algorithm Analysis
Compares current simple percentage approach vs. confidence-adjusted + difficulty-weighted approach
"""

import math
from typing import Dict, Tuple
from dataclasses import dataclass
from enum import Enum

class Difficulty(Enum):
    EASY = "Easy"
    MEDIUM = "Medium"
    HARD = "Hard"

@dataclass
class DifficultyProfile:
    easy: int = 0
    medium: int = 0
    hard: int = 0
    
    @property
    def total(self) -> int:
        return self.easy + self.medium + self.hard
    
    def to_dict(self) -> Dict[str, int]:
        return {
            "Easy": self.easy,
            "Medium": self.medium,
            "Hard": self.hard
        }
    
    def get_distribution(self) -> Dict[str, float]:
        total = self.total
        if total == 0:
            return {"Easy": 0, "Medium": 0, "Hard": 0}
        return {
            "Easy": self.easy / total,
            "Medium": self.medium / total,
            "Hard": self.hard / total
        }

def current_approach(user_solved: int, company_total: int) -> float:
    """Current simple percentage: solved / total * 100"""
    if company_total == 0:
        return 0
    return (user_solved / company_total) * 100

def confidence_adjusted_score(
    user_solved: int,
    company_total: int,
    min_samples_for_confidence: int = 10
) -> Tuple[float, float]:
    """
    Confidence-adjusted scoring with sample size penalty
    
    Returns: (adjusted_score, confidence_factor)
    """
    if company_total == 0:
        return (0, 0)
    
    base_percentage = user_solved / company_total
    
    # Confidence factor: logarithmic scale, full confidence at min_samples_for_confidence
    # More samples = higher confidence
    if company_total >= min_samples_for_confidence:
        confidence_factor = 1.0
    else:
        # Logarithmic confidence: log(n+1) / log(min_samples+1)
        confidence_factor = math.log(company_total + 1) / math.log(min_samples_for_confidence + 1)
    
    # Apply confidence penalty
    adjusted_score = base_percentage * confidence_factor * 100
    
    # Additional penalty for very small samples
    if company_total < 5:
        adjusted_score *= 0.5  # Heavy penalty for tiny samples
    
    return (adjusted_score, confidence_factor)

def difficulty_alignment_score(
    user_profile: DifficultyProfile,
    company_profile: DifficultyProfile
) -> float:
    """
    Calculate how well user's solved problems match company's difficulty distribution
    
    Returns: 0-1 score where 1 = perfect alignment
    """
    if user_profile.total == 0 or company_profile.total == 0:
        return 0.5  # Neutral if no data
    
    user_dist = user_profile.get_distribution()
    company_dist = company_profile.get_distribution()
    
    # Weighted alignment: Hard problems are more important
    weights = {"Easy": 0.3, "Medium": 1.0, "Hard": 1.5}
    
    alignment = 0
    total_weight = 0
    
    for diff in ["Easy", "Medium", "Hard"]:
        # How close is user's distribution to company's?
        user_pct = user_dist.get(diff, 0)
        company_pct = company_dist.get(diff, 0)
        
        # Penalize if user has solved easier problems than company asks
        if user_pct > company_pct and diff == "Easy":
            # User solved more easy than company asks - not good alignment
            alignment += company_pct * weights[diff] * 0.7
        elif user_pct < company_pct and diff == "Hard":
            # User solved fewer hard than company asks - not good alignment
            alignment += user_pct * weights[diff] * 0.7
        else:
            # Good alignment
            alignment += min(user_pct, company_pct) * weights[diff]
        
        total_weight += company_pct * weights[diff]
    
    return alignment / total_weight if total_weight > 0 else 0.5

def recommended_approach(
    user_solved: int,
    company_total: int,
    user_profile: DifficultyProfile,
    company_profile: DifficultyProfile,
    min_samples_for_confidence: int = 10
) -> Tuple[float, Dict[str, float]]:
    """
    Recommended composite scoring algorithm
    
    Returns: (final_score, breakdown)
    """
    if company_total == 0:
        return (0, {"base": 0, "confidence": 0, "difficulty": 0})
    
    # 1. Base percentage
    base_score = (user_solved / company_total) * 100
    
    # 2. Confidence adjustment
    adjusted_score, confidence_factor = confidence_adjusted_score(
        user_solved, company_total, min_samples_for_confidence
    )
    
    # 3. Difficulty alignment
    difficulty_score = difficulty_alignment_score(user_profile, company_profile)
    
    # 4. Composite score: weighted combination
    # Base score weighted by confidence, then adjusted by difficulty alignment
    final_score = adjusted_score * 0.7 + (base_score * difficulty_score) * 0.3
    
    # 5. Additional penalties for very small samples
    if company_total < 5:
        final_score *= 0.6  # Extra penalty for tiny samples
    
    breakdown = {
        "base_score": base_score,
        "confidence_factor": confidence_factor,
        "confidence_adjusted": adjusted_score,
        "difficulty_alignment": difficulty_score,
        "final_score": final_score
    }
    
    return (final_score, breakdown)

def print_comparison(
    scenario_name: str,
    user_solved: int,
    company_total: int,
    user_profile: DifficultyProfile,
    company_profile: DifficultyProfile
):
    """Print before/after comparison for a scenario"""
    print(f"\n{'='*80}")
    print(f"SCENARIO: {scenario_name}")
    print(f"{'='*80}")
    print(f"Company has {company_total} questions for this pattern")
    print(f"User has solved {user_solved} of them")
    print(f"\nCompany Difficulty Distribution:")
    company_dist = company_profile.get_distribution()
    for diff, count in company_profile.to_dict().items():
        print(f"  {diff}: {count} ({company_dist[diff]*100:.1f}%)")
    print(f"\nUser Solved Difficulty Distribution:")
    user_dist = user_profile.get_distribution()
    for diff, count in user_profile.to_dict().items():
        if count > 0:
            print(f"  {diff}: {count} ({user_dist[diff]*100:.1f}%)")
    
    # Current approach
    current = current_approach(user_solved, company_total)
    
    # Recommended approach
    recommended, breakdown = recommended_approach(
        user_solved, company_total, user_profile, company_profile
    )
    
    print(f"\n{'─'*80}")
    print(f"CURRENT APPROACH:")
    print(f"  Score: {current:.1f}%")
    print(f"  Formula: {user_solved}/{company_total} * 100")
    
    print(f"\nRECOMMENDED APPROACH:")
    print(f"  Final Score: {recommended:.1f}%")
    print(f"  Breakdown:")
    print(f"    Base Score: {breakdown['base_score']:.1f}%")
    print(f"    Confidence Factor: {breakdown['confidence_factor']:.2f}")
    print(f"    Confidence-Adjusted: {breakdown['confidence_adjusted']:.1f}%")
    print(f"    Difficulty Alignment: {breakdown['difficulty_alignment']:.2f}")
    print(f"    Final (weighted): {recommended:.1f}%")
    
    print(f"\nDIFFERENCE: {recommended - current:+.1f}% points")
    if abs(recommended - current) > 10:
        print(f"  ⚠️  Significant difference - current approach is {'overly optimistic' if recommended < current else 'too conservative'}")
    else:
        print(f"  ✓ Reasonable alignment")

def main():
    """Run analysis with various realistic scenarios"""
    
    print("="*80)
    print("SKILL MATCH ALGORITHM ANALYSIS")
    print("Comparing Current vs. Recommended Approach")
    print("="*80)
    
    # Scenario 1: Your example - Google Arrays & Hashing
    # Company: 3 questions (all Hard), User: 1 solved (Easy)
    print_comparison(
        "Google Arrays & Hashing (Your Example)",
        user_solved=1,
        company_total=3,
        user_profile=DifficultyProfile(easy=1, medium=0, hard=0),  # User solved 1 Easy
        company_profile=DifficultyProfile(easy=0, medium=0, hard=3)  # Company asks all Hard
    )
    
    # Scenario 2: Small sample, good difficulty match
    print_comparison(
        "Small Sample, Good Difficulty Match",
        user_solved=2,
        company_total=4,
        user_profile=DifficultyProfile(easy=0, medium=1, hard=1),  # User solved Medium + Hard
        company_profile=DifficultyProfile(easy=0, medium=2, hard=2)  # Company: 50% Medium, 50% Hard
    )
    
    # Scenario 3: Large sample, perfect match
    print_comparison(
        "Large Sample, Perfect Match",
        user_solved=15,
        company_total=20,
        user_profile=DifficultyProfile(easy=2, medium=8, hard=5),  # User: 13% Easy, 53% Medium, 33% Hard
        company_profile=DifficultyProfile(easy=3, medium=10, hard=7)  # Company: 15% Easy, 50% Medium, 35% Hard
    )
    
    # Scenario 4: Medium sample, difficulty mismatch
    print_comparison(
        "Medium Sample, Difficulty Mismatch",
        user_solved=5,
        company_total=8,
        user_profile=DifficultyProfile(easy=4, medium=1, hard=0),  # User solved mostly Easy
        company_profile=DifficultyProfile(easy=1, medium=3, hard=4)  # Company asks mostly Hard
    )
    
    # Scenario 5: Very small sample (edge case)
    print_comparison(
        "Very Small Sample (Edge Case)",
        user_solved=1,
        company_total=2,
        user_profile=DifficultyProfile(easy=1, medium=0, hard=0),
        company_profile=DifficultyProfile(easy=0, medium=1, hard=1)
    )
    
    # Scenario 6: Large sample, user over-prepared
    print_comparison(
        "Large Sample, User Over-Prepared",
        user_solved=18,
        company_total=20,
        user_profile=DifficultyProfile(easy=2, medium=6, hard=10),  # User solved more Hard
        company_profile=DifficultyProfile(easy=5, medium=10, hard=5)  # Company asks more Medium
    )
    
    print(f"\n{'='*80}")
    print("SUMMARY")
    print(f"{'='*80}")
    print("""
KEY INSIGHTS:

1. CONFIDENCE PENALTY:
   - Small samples (< 5 questions) get heavy penalty (50% reduction)
   - Medium samples (5-9) get moderate penalty
   - Large samples (10+) get full confidence

2. DIFFICULTY ALIGNMENT:
   - Solving Easy problems when company asks Hard = lower score
   - Solving Hard problems when company asks Easy = still good (over-prepared)
   - Best alignment = matching company's difficulty distribution

3. COMPOSITE SCORING:
   - 70% weight on confidence-adjusted base score
   - 30% weight on difficulty-aligned score
   - Additional penalties for very small samples

4. REALISTIC EXPECTATIONS:
   - 1/3 solved with small sample ≠ 33% readiness
   - Algorithm provides more conservative, realistic estimates
   - Better reflects actual interview readiness
    """)

if __name__ == "__main__":
    main()

