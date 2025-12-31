"""
Detailed visualization of skill match algorithm comparison
Shows multiple perspectives: side-by-side, difference, and breakdown
"""

import matplotlib.pyplot as plt
import numpy as np
from skill_match_analysis import (
    current_approach,
    recommended_approach,
    DifficultyProfile
)

def create_detailed_visualizations():
    """Create comprehensive visualization suite"""
    
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
    
    # Collect data
    current_scores = []
    recommended_scores = []
    breakdowns = []
    scenario_names = []
    
    for scenario in scenarios:
        current = current_approach(scenario["user_solved"], scenario["company_total"])
        recommended, breakdown = recommended_approach(
            scenario["user_solved"],
            scenario["company_total"],
            scenario["user_profile"],
            scenario["company_profile"]
        )
        
        current_scores.append(current)
        recommended_scores.append(recommended)
        breakdowns.append(breakdown)
        scenario_names.append(scenario["name"])
    
    # Create comprehensive figure
    fig = plt.figure(figsize=(16, 10))
    
    # 1. Side-by-side comparison (top)
    ax1 = plt.subplot(2, 2, 1)
    x = np.arange(len(scenario_names))
    width = 0.35
    
    bars1 = ax1.bar(x - width/2, current_scores, width, label='Current Approach', 
                    color='#3b82f6', alpha=0.8, edgecolor='black', linewidth=1)
    bars2 = ax1.bar(x + width/2, recommended_scores, width, label='Recommended Approach', 
                    color='#10b981', alpha=0.8, edgecolor='black', linewidth=1)
    
    ax1.set_ylabel('Skill Match Score (%)', fontsize=11, fontweight='bold')
    ax1.set_title('Current vs Recommended: Side-by-Side Comparison', fontsize=13, fontweight='bold', pad=15)
    ax1.set_xticks(x)
    ax1.set_xticklabels(scenario_names, rotation=15, ha='right', fontsize=9)
    ax1.set_ylim(0, 100)
    ax1.grid(axis='y', alpha=0.3, linestyle='--')
    ax1.axhline(y=50, color='orange', linestyle=':', alpha=0.5, linewidth=2, label='50% threshold')
    ax1.legend(loc='upper right', fontsize=9)
    
    # Add value labels
    for bars in [bars1, bars2]:
        for bar in bars:
            height = bar.get_height()
            ax1.text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.1f}%',
                    ha='center', va='bottom', fontsize=8, fontweight='bold')
    
    # 2. Difference chart (top right)
    ax2 = plt.subplot(2, 2, 2)
    differences = [rec - curr for curr, rec in zip(current_scores, recommended_scores)]
    colors = ['#ef4444' if d < -15 else '#f59e0b' if d < -5 else '#10b981' for d in differences]
    
    bars = ax2.bar(x, differences, width=0.6, color=colors, alpha=0.8, edgecolor='black', linewidth=1)
    ax2.set_ylabel('Score Difference (%)', fontsize=11, fontweight='bold')
    ax2.set_title('Impact of New Algorithm\n(Negative = More Conservative)', 
                 fontsize=13, fontweight='bold', pad=15)
    ax2.set_xticks(x)
    ax2.set_xticklabels(scenario_names, rotation=15, ha='right', fontsize=9)
    ax2.axhline(y=0, color='black', linestyle='-', linewidth=2)
    ax2.grid(axis='y', alpha=0.3, linestyle='--')
    
    # Add value labels
    for bar in bars:
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:+.1f}%',
                ha='center', va='bottom' if height > 0 else 'top', 
                fontsize=9, fontweight='bold')
    
    # 3. Breakdown visualization (bottom left) - Confidence factors
    ax3 = plt.subplot(2, 2, 3)
    confidence_factors = [b['confidence_factor'] for b in breakdowns]
    sample_sizes = [scenarios[i]['company_total'] for i in range(len(scenarios))]
    
    bars3 = ax3.bar(x, confidence_factors, width=0.6, color='#8b5cf6', alpha=0.8, 
                    edgecolor='black', linewidth=1)
    ax3.set_ylabel('Confidence Factor', fontsize=11, fontweight='bold')
    ax3.set_title('Confidence Factor by Sample Size', fontsize=13, fontweight='bold', pad=15)
    ax3.set_xticks(x)
    ax3.set_xticklabels(scenario_names, rotation=15, ha='right', fontsize=9)
    ax3.set_ylim(0, 1.1)
    ax3.grid(axis='y', alpha=0.3, linestyle='--')
    ax3.axhline(y=1.0, color='green', linestyle='--', alpha=0.5, label='Full confidence')
    
    # Add sample size labels
    for i, (bar, size) in enumerate(zip(bars3, sample_sizes)):
        height = bar.get_height()
        ax3.text(bar.get_x() + bar.get_width()/2., height + 0.05,
                f'n={size}',
                ha='center', va='bottom', fontsize=8, style='italic')
        ax3.text(bar.get_x() + bar.get_width()/2., height/2,
                f'{height:.2f}',
                ha='center', va='center', fontsize=9, fontweight='bold', color='white')
    
    ax3.legend(fontsize=8)
    
    # 4. Difficulty alignment scores (bottom right)
    ax4 = plt.subplot(2, 2, 4)
    difficulty_alignments = [b['difficulty_alignment'] for b in breakdowns]
    
    bars4 = ax4.bar(x, difficulty_alignments, width=0.6, color='#f59e0b', alpha=0.8,
                     edgecolor='black', linewidth=1)
    ax4.set_ylabel('Difficulty Alignment Score', fontsize=11, fontweight='bold')
    ax4.set_title('Difficulty Alignment (0 = Mismatch, 1 = Perfect Match)', 
                 fontsize=13, fontweight='bold', pad=15)
    ax4.set_xticks(x)
    ax4.set_xticklabels(scenario_names, rotation=15, ha='right', fontsize=9)
    ax4.set_ylim(0, 1.1)
    ax4.grid(axis='y', alpha=0.3, linestyle='--')
    ax4.axhline(y=1.0, color='green', linestyle='--', alpha=0.5, label='Perfect alignment')
    ax4.axhline(y=0.5, color='orange', linestyle='--', alpha=0.5, label='Neutral')
    
    # Add value labels
    for bar in bars4:
        height = bar.get_height()
        ax4.text(bar.get_x() + bar.get_width()/2., height/2,
                f'{height:.2f}',
                ha='center', va='center', fontsize=9, fontweight='bold', color='white')
    
    ax4.legend(fontsize=8)
    
    plt.tight_layout()
    plt.savefig('analysis/detailed_comparison.png', dpi=200, bbox_inches='tight')
    print("Detailed comparison chart saved to analysis/detailed_comparison.png")
    
    # Create a focused chart for your specific example
    fig2, ((ax5, ax6), (ax7, ax8)) = plt.subplots(2, 2, figsize=(14, 10))
    
    # Focus on "Your Example" scenario (index 0)
    example_idx = 0
    example = scenarios[example_idx]
    example_current = current_scores[example_idx]
    example_recommended = recommended_scores[example_idx]
    example_breakdown = breakdowns[example_idx]
    
    # Chart 1: Before/After for your example
    categories = ['Current\nApproach', 'Recommended\nApproach']
    values = [example_current, example_recommended]
    colors_ex = ['#3b82f6', '#10b981']
    
    bars_ex = ax5.bar(categories, values, color=colors_ex, alpha=0.8, edgecolor='black', linewidth=2)
    ax5.set_ylabel('Skill Match Score (%)', fontsize=12, fontweight='bold')
    ax5.set_title(f'Your Example: {example["name"]}\n1 Solved / 3 Total (Easy vs Hard)', 
                  fontsize=14, fontweight='bold', pad=15)
    ax5.set_ylim(0, 40)
    ax5.grid(axis='y', alpha=0.3, linestyle='--')
    
    for bar in bars_ex:
        height = bar.get_height()
        ax5.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}%',
                ha='center', va='bottom', fontsize=14, fontweight='bold')
    
    # Chart 2: Score breakdown
    breakdown_labels = ['Base\nScore', 'Confidence\nAdjusted', 'Final\nScore']
    breakdown_values = [
        example_breakdown['base_score'],
        example_breakdown['confidence_adjusted'],
        example_breakdown['final_score']
    ]
    
    bars_breakdown = ax6.bar(breakdown_labels, breakdown_values, 
                            color=['#6366f1', '#8b5cf6', '#10b981'], 
                            alpha=0.8, edgecolor='black', linewidth=2)
    ax6.set_ylabel('Score (%)', fontsize=12, fontweight='bold')
    ax6.set_title('Score Breakdown: How We Get to 4.0%', fontsize=14, fontweight='bold', pad=15)
    ax6.set_ylim(0, 40)
    ax6.grid(axis='y', alpha=0.3, linestyle='--')
    
    for bar in bars_breakdown:
        height = bar.get_height()
        ax6.text(bar.get_x() + bar.get_width()/2., height,
                f'{height:.1f}%',
                ha='center', va='bottom', fontsize=12, fontweight='bold')
    
    # Chart 3: Confidence factor explanation
    sample_sizes_range = np.arange(1, 21)
    confidence_curve = [min(1.0, np.log(n + 1) / np.log(11)) for n in sample_sizes_range]
    
    ax7.plot(sample_sizes_range, confidence_curve, linewidth=3, color='#8b5cf6', marker='o', markersize=4)
    ax7.axvline(x=3, color='red', linestyle='--', linewidth=2, alpha=0.7, label='Your example (n=3)')
    ax7.axvline(x=10, color='green', linestyle='--', linewidth=2, alpha=0.7, label='Full confidence (n=10)')
    ax7.fill_between(sample_sizes_range, 0, confidence_curve, alpha=0.2, color='#8b5cf6')
    ax7.set_xlabel('Sample Size (Number of Questions)', fontsize=11, fontweight='bold')
    ax7.set_ylabel('Confidence Factor', fontsize=11, fontweight='bold')
    ax7.set_title('Confidence Factor by Sample Size\n(Logarithmic Scale)', 
                  fontsize=14, fontweight='bold', pad=15)
    ax7.set_ylim(0, 1.1)
    ax7.grid(alpha=0.3, linestyle='--')
    ax7.legend(fontsize=10)
    
    # Chart 4: Difficulty alignment explanation
    difficulty_scenarios = [
        'Perfect\nMatch',
        'Good\nMatch',
        'Partial\nMatch',
        'Poor\nMatch',
        'No\nMatch'
    ]
    alignment_scores = [1.0, 0.75, 0.5, 0.25, 0.0]
    alignment_colors = ['#10b981', '#84cc16', '#f59e0b', '#f97316', '#ef4444']
    
    bars_align = ax8.bar(difficulty_scenarios, alignment_scores, 
                        color=alignment_colors, alpha=0.8, edgecolor='black', linewidth=2)
    ax8.set_ylabel('Alignment Score', fontsize=12, fontweight='bold')
    ax8.set_title('Difficulty Alignment Examples\n(Your Example = No Match)', 
                 fontsize=14, fontweight='bold', pad=15)
    ax8.set_ylim(0, 1.1)
    ax8.grid(axis='y', alpha=0.3, linestyle='--')
    ax8.axhline(y=example_breakdown['difficulty_alignment'], color='red', 
               linestyle='--', linewidth=2, label=f'Your example ({example_breakdown["difficulty_alignment"]:.2f})')
    
    for bar in bars_align:
        height = bar.get_height()
        ax8.text(bar.get_x() + bar.get_width()/2., height/2,
                f'{height:.2f}',
                ha='center', va='center', fontsize=10, fontweight='bold', color='white')
    
    ax8.legend(fontsize=9)
    
    plt.tight_layout()
    plt.savefig('analysis/your_example_focused.png', dpi=200, bbox_inches='tight')
    print("Focused example chart saved to analysis/your_example_focused.png")
    
    print("\n" + "="*60)
    print("All visualizations generated successfully!")
    print("="*60)
    print("\nFiles created:")
    print("  1. analysis/comparison_chart.png - Side-by-side comparison")
    print("  2. analysis/difference_chart.png - Impact difference chart")
    print("  3. analysis/detailed_comparison.png - Comprehensive 4-panel view")
    print("  4. analysis/your_example_focused.png - Deep dive into your example")
    print("\nOpen these files to review the visualizations!")

if __name__ == "__main__":
    try:
        create_detailed_visualizations()
    except Exception as e:
        print(f"Error creating visualizations: {e}")
        import traceback
        traceback.print_exc()

