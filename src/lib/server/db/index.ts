import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import * as schema from './schema';
import ws from 'ws';
import { eq, desc } from 'drizzle-orm';
import { config } from 'dotenv';

config({ path: '.env' });

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

const { problems, logs } = schema;

export { schema };

export async function getProblems() {
    return await db.select().from(problems);
}

export async function getLogs(userId: string) {
    return await db
        .select()
        .from(logs)
        .where(eq(logs.userId, userId))
        .orderBy(desc(logs.timestamp));
}
