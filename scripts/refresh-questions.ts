import { db } from '../src/lib/server/db';
import { companies, companyProblems, problems } from '../src/lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_URL = 'https://github.com/liquidslr/leetcode-company-wise-problems.git';
const TEMP_DIR = path.join(__dirname, 'temp_repo');

async function main() {
    console.log('--- Target Company Question Refresh ---');

    // 1. Clone/Update Repo
    if (fs.existsSync(TEMP_DIR)) {
        console.log('Updating repository...');
        execSync('git pull', { cwd: TEMP_DIR });
    } else {
        console.log('Cloning repository...');
        execSync(`git clone ${REPO_URL} ${TEMP_DIR}`);
    }

    // 2. Iterate through company folders
    const companyFolders = fs.readdirSync(TEMP_DIR).filter(folder => {
        const fullPath = path.join(TEMP_DIR, folder);
        return fs.statSync(fullPath).isDirectory() && !folder.startsWith('.');
    });

    console.log(`Found ${companyFolders.length} company folders.`);

    // Get all existing problems for mapping
    const allProblems = await db.select().from(problems);
    const problemMap = new Map<string, string>(); // urlSlug -> problemId

    allProblems.forEach(p => {
        // Extract slug from https://leetcode.com/problems/two-sum/
        const slugMatch = p.leetcodeUrl.match(/problems\/([^/]+)/);
        if (slugMatch) {
            problemMap.set(slugMatch[1], p.id);
        }
    });

    for (const companyName of companyFolders) {
        const slug = companyName.toLowerCase().replace(/\s+/g, '-');
        const csvPath = path.join(TEMP_DIR, companyName, '5. All.csv');

        if (!fs.existsSync(csvPath)) continue;

        console.log(`Processing ${companyName}...`);

        // Insert/Update Company
        const [company] = await db.insert(companies).values({
            id: slug,
            name: companyName,
            slug: slug,
            color: '#6366f1' // Default indigo
        }).onConflictDoUpdate({
            target: companies.slug,
            set: { name: companyName }
        }).returning();

        // Clear existing mappings for this company to refresh
        await db.delete(companyProblems).where(eq(companyProblems.companyId, company.id));

        // Parse CSV
        const content = fs.readFileSync(csvPath, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim() !== '');

        // Skip header
        const dataLines = lines.slice(1);

        const mappings = [];

        for (const line of dataLines) {
            // Very basic CSV parsing (Title,Link,Difficulty,Acceptance,Frequency)
            // Note: Leetcode titles can have commas, but GitHub CSVs usually quote or handle this.
            // For simplicity in this spike, we'll split by common patterns.
            const parts = line.split(',');
            if (parts.length < 5) continue;

            const link = parts[parts.length - 4]; // Link is usually 4th from last
            const frequencyStr = parts[parts.length - 1]; // Frequency is last

            const slugMatch = link.match(/problems\/([^/]+)/);
            if (slugMatch) {
                const pSlug = slugMatch[1];
                const problemId = problemMap.get(pSlug);

                if (problemId) {
                    mappings.push({
                        companyId: company.id,
                        problemId: problemId,
                        frequency: parseInt(frequencyStr) || 0,
                        timeframe: 'all'
                    });
                }
            }
        }

        if (mappings.length > 0) {
            await db.insert(companyProblems).values(mappings);
            console.log(`  Added ${mappings.length} problem mappings.`);
        }
    }

    console.log('--- Done ---');
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
