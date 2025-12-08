import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProblems, getLogs } from './index';
import { db } from '@repo/db';
import { schema } from '@repo/db';

const { problems, logs } = schema;

// Create a mock DB object that returns itself for chaining
const mockDb = {
    select: vi.fn(),
    from: vi.fn(),
    where: vi.fn(),
    orderBy: vi.fn()
};
mockDb.select.mockReturnValue(mockDb);
mockDb.from.mockReturnValue(mockDb);
mockDb.where.mockReturnValue(mockDb);
mockDb.orderBy.mockResolvedValue([]); // Default resolved value

// Use vi.hoisted to ensure mockDb can be used in vi.mock if needed, 
// OR just define it inside. But defining outside and referencing requires vi.hoisted if strictly following hoist rules.
// However, in this simple case, we can define the mock implementation inside validly if we don't depend on closure.
// But validly, since we import 'db', we can just spy on it? imports are live bindings.
// But better to use vi.mock factory correctly.

vi.mock('@repo/db', () => {
    const mockDbInner = {
        select: vi.fn(),
        from: vi.fn(),
        where: vi.fn(),
        orderBy: vi.fn()
    };
    mockDbInner.select.mockReturnValue(mockDbInner);
    mockDbInner.from.mockReturnValue(mockDbInner);
    mockDbInner.where.mockReturnValue(mockDbInner);

    return {
        db: mockDbInner,
        schema: {
            problems: { id: 'problems_table' },
            logs: { id: 'logs_table', userId: 'user_id_col', timestamp: 'timestamp_col' }
        }
    };
});

// Mock drizzle-orm
vi.mock('drizzle-orm', () => ({
    eq: vi.fn(),
    desc: vi.fn()
}));

describe('Database Helpers', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Reset chain return values to default
        (db.select as any).mockReturnValue(db);
        (db.from as any).mockReturnValue(db);
        (db.where as any).mockReturnValue(db);
    });

    describe('getProblems', () => {
        it('should fetch all problems', async () => {
            const mockProblems = [{ id: '1', title: 'Two Sum' }];

            // db.select().from() should resolve to mockProblems
            // But db.from returns 'db'. And in getProblems, it awaits the result of .from()
            // wait, await db.select().from(problems)
            // So .from() must contain a 'then' method or return a Promise-like?
            // Drizzle QueryBuilder is thenable.
            // So my mockDb object needs to have a 'then' method or the last method called needs to return a Promise.

            // In getProblems: return await db.select().from(problems);
            // So .from() must return a Promise (or be awaited).
            (db.from as any).mockResolvedValue(mockProblems);

            const result = await getProblems();

            expect(db.select).toHaveBeenCalled();
            expect(db.from).toHaveBeenCalledWith(problems);
            expect(result).toEqual(mockProblems);
        });
    });

    describe('getLogs', () => {
        it('should fetch logs for a specific user ordered by timestamp', async () => {
            const userId = 'user-123';
            const mockLogs = [{ id: 'log-1', userId, status: 'Optimal' }];

            // In getLogs: return await db.select().from(logs).where(...).orderBy(...);
            // So .orderBy() must return the promise.

            // We need to ensure the chain works before returning the promise.
            // Re-setup chain for this test to be safe
            (db.select as any).mockReturnValue(db);
            (db.from as any).mockReturnValue(db);
            (db.where as any).mockReturnValue(db);
            (db.orderBy as any).mockResolvedValue(mockLogs);

            const result = await getLogs(userId);

            expect(db.select).toHaveBeenCalled();
            expect(db.from).toHaveBeenCalledWith(logs);
            expect(db.where).toHaveBeenCalled();
            expect(db.orderBy).toHaveBeenCalled();
            expect(result).toEqual(mockLogs);
        });
    });
});
