import { db } from './index';
import { sessions } from './schema';
import { eq, and } from 'drizzle-orm';

export type NewSession = typeof sessions.$inferInsert;
export type Session = typeof sessions.$inferSelect;

export const createSession = async (session: NewSession) => {
    const [newSession] = await db.insert(sessions).values(session).returning();
    return newSession;
};

export const getSessionsByUser = async (userId: string) => {
    return await db.select().from(sessions).where(eq(sessions.userId, userId));
};

export const getSessionsBySpot = async (spotId: number) => {
    return await db.select().from(sessions).where(eq(sessions.spotId, spotId));
};

export const updateSession = async (id: number, update: Partial<NewSession>) => {
    const [updatedSession] = await db
        .update(sessions)
        .set(update)
        .where(eq(sessions.id, id))
        .returning();
    return updatedSession;
};

export const deleteSession = async (id: number) => {
    await db.delete(sessions).where(eq(sessions.id, id));
};
