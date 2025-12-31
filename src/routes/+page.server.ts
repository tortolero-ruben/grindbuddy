import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { db, schema } from '$lib/server/db';
import { eq, and } from 'drizzle-orm';
import { randomUUID } from 'crypto';

const { logs } = schema;

export const actions: Actions = {
    createLog: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }
        const session = { user: locals.user };

        const data = await request.formData();
        const problemId = data.get('problemId') as string;
        const status = data.get('status') as string;
        const timeComplexity = data.get('timeComplexity') as string;
        const spaceComplexity = data.get('spaceComplexity') as string;
        const notes = data.get('notes') as string;

        if (!problemId || !status) {
            return fail(400, { message: 'Missing required fields' });
        }

        try {
            const logId = randomUUID();
            const timestamp = new Date();
            
            await db.insert(logs).values({
                id: logId,
                userId: session.user.id,
                problemId,
                status,
                timeComplexity: timeComplexity || undefined,
                spaceComplexity: spaceComplexity || undefined,
                notes,
                timestamp
            });
            
            // Return the created log so the client can update the store
            // Note: userId is excluded as it's not part of the client-side Log type
            return {
                success: true,
                log: {
                    id: logId,
                    problemId,
                    status,
                    timeComplexity: timeComplexity || undefined,
                    spaceComplexity: spaceComplexity || undefined,
                    notes: notes || '',
                    timestamp
                }
            };
        } catch (e) {
            console.error('Failed to create log:', e);
            return fail(500, { message: 'Failed to create log' });
        }
    },

    deleteLog: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }
        const session = { user: locals.user };

        const data = await request.formData();
        const logId = data.get('logId') as string;

        if (!logId) {
            return fail(400, { message: 'Missing logId' });
        }

        try {
            // Ensure user owns the log
            const [log] = await db.select().from(logs).where(and(eq(logs.id, logId), eq(logs.userId, session.user.id)));

            if (!log) {
                return fail(404, { message: 'Log not found or unauthorized' });
            }

            await db.delete(logs).where(eq(logs.id, logId));
        } catch (e) {
            console.error('Failed to delete log:', e);
            return fail(500, { message: 'Failed to delete log' });
        }
    },

    updateLog: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { message: 'Unauthorized' });
        }
        const session = { user: locals.user };

        const data = await request.formData();
        const logId = data.get('logId') as string;
        const status = data.get('status') as string;
        const timeComplexity = data.get('timeComplexity') as string;
        const spaceComplexity = data.get('spaceComplexity') as string;
        const notes = data.get('notes') as string;

        if (!logId || !status) {
            return fail(400, { message: 'Missing required fields' });
        }

        try {
            // Ensure user owns the log
            const [existingLog] = await db.select().from(logs).where(and(eq(logs.id, logId), eq(logs.userId, session.user.id)));

            if (!existingLog) {
                return fail(404, { message: 'Log not found or unauthorized' });
            }

            await db.update(logs).set({
                status,
                timeComplexity: timeComplexity || undefined,
                spaceComplexity: spaceComplexity || undefined,
                notes
            }).where(eq(logs.id, logId));
        } catch (e) {
            console.error('Failed to update log:', e);
            return fail(500, { message: 'Failed to update log' });
        }
    }
};
