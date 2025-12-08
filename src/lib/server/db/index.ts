import { db, schema } from '@repo/db';
import { eq, desc } from 'drizzle-orm';

const { problems, logs } = schema;

export { db };

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
