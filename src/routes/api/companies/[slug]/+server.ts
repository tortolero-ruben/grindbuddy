import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { companies, companyProblems, problems } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function GET({ params }) {
    const { slug } = params;

    const [company] = await db.select().from(companies).where(eq(companies.slug, slug));

    if (!company) {
        return json({ error: 'Company not found' }, { status: 404 });
    }

    const mappings = await db.select({
        patterns: problems.patterns,
        difficulty: problems.difficulty,
        frequency: companyProblems.frequency
    })
        .from(companyProblems)
        .innerJoin(problems, eq(companyProblems.problemId, problems.id))
        .where(eq(companyProblems.companyId, company.id));

    const patternCounts: Record<string, number> = {};
    const patternDifficulty: Record<string, { Easy: number; Medium: number; Hard: number }> = {};
    
    mappings.forEach(m => {
        m.patterns.forEach(p => {
            // Count patterns
            patternCounts[p] = (patternCounts[p] || 0) + 1;
            
            // Count difficulty distribution per pattern
            if (!patternDifficulty[p]) {
                patternDifficulty[p] = { Easy: 0, Medium: 0, Hard: 0 };
            }
            const difficulty = m.difficulty as 'Easy' | 'Medium' | 'Hard';
            if (difficulty in patternDifficulty[p]) {
                patternDifficulty[p][difficulty]++;
            }
        });
    });

    // Calculate total number of problems for this company
    const totalProblems = mappings.length;
    const patterns: Record<string, number> = {};
    const patternCountsData: Record<string, number> = {};

    if (totalProblems > 0) {
        Object.entries(patternCounts).forEach(([pattern, count]) => {
            // Calculate actual percentage: count / total problems * 100
            patterns[pattern] = Math.round((count / totalProblems) * 100);
            patternCountsData[pattern] = count;
        });
    }

    return json({
        ...company,
        patterns,
        patternCounts: patternCountsData,
        patternDifficulty,
        totalProblems
    });
}
