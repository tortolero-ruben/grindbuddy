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
        frequency: companyProblems.frequency
    })
        .from(companyProblems)
        .innerJoin(problems, eq(companyProblems.problemId, problems.id))
        .where(eq(companyProblems.companyId, company.id));

    const patternCounts: Record<string, number> = {};
    mappings.forEach(m => {
        m.patterns.forEach(p => {
            patternCounts[p] = (patternCounts[p] || 0) + 1;
        });
    });

    const maxCount = Math.max(...Object.values(patternCounts), 0);
    const patterns: Record<string, number> = {};

    if (maxCount > 0) {
        Object.entries(patternCounts).forEach(([pattern, count]) => {
            // Normalize so the most frequent pattern is 100%
            patterns[pattern] = Math.round((count / maxCount) * 100);
        });
    }

    return json({
        ...company,
        patterns
    });
}
