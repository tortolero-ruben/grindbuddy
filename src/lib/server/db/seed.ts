import { db } from './index';
import { problems } from './schema';
import { problemsData } from '../../data/problems';
import { sql } from 'drizzle-orm';

async function main() {
    console.log('Seeding database with problems...');

    try {
        // Use upsert to avoid duplicates and update existing entries
        for (const problem of problemsData) {
            await db.insert(problems)
                .values({
                    id: problem.id,
                    number: problem.number,
                    title: problem.title,
                    difficulty: problem.difficulty,
                    patterns: problem.patterns,
                    neetcodeUrl: problem.neetcodeUrl,
                    leetcodeUrl: problem.leetcodeUrl,
                })
                .onConflictDoUpdate({
                    target: problems.id,
                    set: {
                        number: problem.number,
                        title: problem.title,
                        difficulty: problem.difficulty,
                        patterns: problem.patterns,
                        neetcodeUrl: problem.neetcodeUrl,
                        leetcodeUrl: problem.leetcodeUrl,
                    }
                });
        }

        console.log(`Successfully seeded ${problemsData.length} problems.`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

main();
