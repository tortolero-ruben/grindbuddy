import { db } from './index';
import { spots } from './schema';
import { eq } from 'drizzle-orm';

export type NewSpot = typeof spots.$inferInsert;
export type Spot = typeof spots.$inferSelect;

export const createSpot = async (spot: NewSpot) => {
    const [newSpot] = await db.insert(spots).values(spot).returning();
    return newSpot;
};

export const getSpots = async () => {
    return await db.select().from(spots);
};

export const getSpotById = async (id: number) => {
    const [spot] = await db.select().from(spots).where(eq(spots.id, id));
    return spot;
};

export const updateSpot = async (id: number, update: Partial<NewSpot>) => {
    const [updatedSpot] = await db
        .update(spots)
        .set({ ...update, updatedAt: new Date() })
        .where(eq(spots.id, id))
        .returning();
    return updatedSpot;
};

export const deleteSpot = async (id: number) => {
    await db.delete(spots).where(eq(spots.id, id));
};
