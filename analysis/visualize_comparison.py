"""
Visual comparison of Current vs Recommended Skill Match Algorithm
"""

import matplotlib.pyplot as plt
import numpy as np
from skill_match_analysis import (
    current_approach,
    recommended_approach,
    DifficultyProfile
)

def create_comparison_chart():
    """Create side-by-side bar chart comparison"""
    
    scenarios = [
        {
            "name": "Your Example\n(1/3, Easy vs Hard)",
            "user_solved": 1,
            "company_total": 3,
            "user_profile": DifficultyProfile(easy=1, medium=0, hard=0),
            "company_profile": DifficultyProfile(easy=0, medium=0, hard=3)
        },
        {
            "name": "Small Sample\nGood Match",
            "user_solved": 2,
            "company_total": 4,
            "user_profile": DifficultyProfile(easy=0, medium=1, hard=1),
            "company_profile": DifficultyProfile(easy=0, medium=2, hard=2)
        },
        {
            "name": "Large Sample\nPerfect Match",
            "user_solved": 15,
            "company_total": 20,
            "user_profile": DifficultyProfile(easy=2, medium=8, hard=5),
            "company_profile": DifficultyProfile(easy=3, medium=10, hard=7)
        },
        {
            "name": "Medium Sample\nDifficulty Mismatch",
            "user_solved": 5,
            "company_total": 8,
            "user_profile": DifficultyProfile(easy=4, medium=1, hard=0),
            "company_profile": DifficultyProfile(easy=1, medium=3, hard=4)
        },
        {
            "name": "Very Small\n(1/2, Easy vs Hard)",
            "user_solved": 1,
            "company_total": 2,
            "user_profile": DifficultyProfile(easy=1, medium=0, hard=0),
            "company_profile": DifficultyProfile(easy=0, medium=1, hard=1)
        }
    ]
    
    current_scores = []
    recommended_scores = []
    scenario_names = []
    
    for scenario in scenarios:
        current = current_approach(scenario["user_solved"], scenario["company_total"])
        recommended, _ = recommended_approach(
            scenario["user_solved"],
            scenario["company_total"],
            scenario["user_profile"],
            scenario["company_profile"]
        )
        
        current_scores.append(current)
        recommended_scores.append(recommended)
        scenario_names.append(scenario["name"])
    
    # Create figure
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    
    x = np.arange(len(scenario_names))
    width = 0.35
    
    # Left chart: Current approach
    bars1 = ax1.bar(x, current_scores, width, label='Current Score', color='#3b82f6', alpha=0.8)
    ax1.set_ylabel('Skill Match Score (%)', fontsize=12)
    ax1.set_title('Current Approach\n(Simple Percentage)', fontsize=14, fontweight='bold')
    ax1.set_xticks(x)
    ax1.set_xticklabels(scenario_names, rotation=15, ha='right', fontsize=9)
    ax1.set_ylim(0, 100)
    ax1.grid(axis='y', alpha=0.3, linestyle='--')
    ax1.axhline(y=50, color='orange', linestyle=':', alpha=0.5, label='50% threshold')
    ax1.legend()
    
    # Add value labels on bars
    for bar in bars1:
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}%',
                ha='center', va='bottom', fontsize=9)
    
    # Right chart: Recommended approach
    bars2 = ax2.bar(x, recommended_scores, width, label='Recommended Score', color='#10b981', alpha=0.8)
    ax2.set_ylabel('Skill Match Score (%)', fontsize=12)
    ax2.set_title('Recommended Approach\n(Confidence + Difficulty Adjusted)', fontsize=14, fontweight='bold')
    ax2.set_xticks(x)
    ax2.set_xticklabels(scenario_names, rotation=15, ha='right', fontsize=9)
    ax2.set_ylim(0, 100)
    ax2.grid(axis='y', alpha=0.3, linestyle='--')
    ax2.axhline(y=50, color='orange', linestyle=':', alpha=0.5, label='50% threshold')
    ax2.legend()
    
    # Add value labels on bars
    for bar in bars2:
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}%',
                ha='center', va='bottom', fontsize=9)
    
    plt.tight_layout()
    plt.savefig('analysis/comparison_chart.png', dpi=150, bbox_inches='tight')
    print("Chart saved to analysis/comparison_chart.png")
    
    # Create difference chart
    fig2, ax = plt.subplots(figsize=(12, 6))
    
    differences = [rec - curr for curr, rec in zip(current_scores, recommended_scores)]
    colors = ['#ef4444' if d < -10 else '#10b981' if d > 10 else '#f59e0b' for d in differences]
    
    bars = ax.bar(x, differences, width=0.6, color=colors, alpha=0.8)
    ax.set_ylabel('Score Difference (Recommended - Current)', fontsize=12)
    ax.set_title('Impact of New Algorithm\n(Negative = More Conservative, Positive = More Optimistic)', 
                 fontsize=14, fontweight='bold')
    ax.set_xticks(x)
    ax.set_xticklabels(scenario_names, rotation=15, ha='right', fontsize=10)
    ax.axhline(y=0, color='black', linestyle='-', linewidth=0.8)
    ax.grid(axis='y', alpha=0.3, linestyle='--')
    ax.legend(['Zero difference'])
    
    # Add value labels
    for bar in bars:
        height = bar.get_height()
        ax.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:+.1f}%',
                ha='center', va='bottom' if height > 0 else 'top', fontsize=10, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('analysis/difference_chart.png', dpi=150, bbox_inches='tight')
    print("Difference chart saved to analysis/difference_chart.png")

if __name__ == "__main__":
    try:
        create_comparison_chart()
    except ImportError:
        print("Matplotlib not available. Install with: pip install matplotlib")
    except Exception as e:
        print(f"Error creating charts: {e}")

