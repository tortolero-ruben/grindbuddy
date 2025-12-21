// import * as schema from '@repo/db/schema'; 
import * as schema from '../../../../packages/db/src/schema';
// Better: imports from @repo/db which is in dependencies.

import { config } from 'dotenv';
import ws from 'ws';

// Load .env from monorepo root
config({ path: '../../.env' });

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) {
    throw new Error('DATABASE_URL is not set');
}


// Config for Node env
neonConfig.webSocketConstructor = ws;

console.log('Connecting to database...'); // DEBUG
const pool = new Pool({ connectionString });
const db = drizzle(pool, { schema });
console.log('Database client initialized.'); // DEBUG

// Define data
// Note: We need to match the schema definitions.
// Inspecting schema: 
// user.emailVerified is mapped to "email_verified" in DB.
// problems and logs tables.

const mockProblems = [
    {
        id: '1',
        number: 1,
        title: 'Two Sum',
        difficulty: 'Easy',
        patterns: ['Arrays & Hashing'],
        leetcodeUrl: 'https://leetcode.com/problems/two-sum/'
    },
    // ... add a few more for smoke test
    {
        id: '2',
        number: 2,
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        patterns: ['Arrays & Hashing', '1-D Dynamic Programming'],
        leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/'
    }
];

const mockLogs = [
    {
        id: 'log1',
        problemId: '1',
        status: 'Optimal',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        notes: 'Used hash map to store complements.',
        timestamp: new Date()
    }
];

async function seed() {
    try {
        console.log('Seeding database...');

        // 1. Clean up
        console.log('Cleaning existing data...');
        // Order matters for foreign keys
        await db.delete(schema.logs);
        await db.delete(schema.problems);
        // We might want to keep users, or at least be careful. 
        // For a full reset, we can clear users too, but let's see. 
        // User asked to "start from scratch", so wiping is probably expected.
        // But maybe we just ensure the admin user exists.

        // 2. Insert User
        let targetUser = await db.query.user.findFirst({
            where: (users, { eq }) => eq(users.email, 'admin@example.com')
        });

        if (!targetUser) {
            console.log('Creating admin user...');
            const [newUser] = await db.insert(schema.user).values({
                id: 'admin-user',
                name: 'Admin User',
                email: 'admin@example.com',
                email_verified: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }).returning();
            targetUser = newUser;
        } else {
            console.log('Admin user exists.');
        }

        // 3. Insert Problems
        console.log('Inserting problems...');
        await db.insert(schema.problems).values(
            mockProblems.map(p => ({
                id: p.id,
                number: p.number,
                title: p.title,
                difficulty: p.difficulty,
                patterns: p.patterns,
                leetcodeUrl: p.leetcodeUrl
            }))
        );

        // 4. Insert Logs
        console.log('Inserting logs...');
        await db.insert(schema.logs).values(
            mockLogs.map(l => ({
                id: l.id,
                userId: targetUser!.id,
                problemId: l.problemId,
                status: l.status,
                timeComplexity: l.timeComplexity,
                spaceComplexity: l.spaceComplexity,
                notes: l.notes,
                timestamp: l.timestamp
            }))
        );

        console.log('Seeding complete!');
        process.exit(0);

    } catch (e) {
        console.error('Seeding failed:', e);
        process.exit(1);
    }
}

seed();
