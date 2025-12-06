import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSession, getSessionsByUser, getSessionsBySpot, updateSession, deleteSession } from './sessions';
import { db } from './index';

// Mock the db module
vi.mock('./index', () => ({
    db: {
        insert: vi.fn(),
        select: vi.fn(),
        update: vi.fn(),
        delete: vi.fn()
    }
}));

describe('Sessions CRUD', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should create a session', async () => {
        const mockSession = {
            startTime: new Date(),
            userId: 'user-1',
            spotId: 1
        };
        const returningMock = vi.fn().mockResolvedValue([mockSession]);
        const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });

        (db.insert as any).mockReturnValue({ values: valuesMock });

        const result = await createSession(mockSession as any);

        expect(db.insert).toHaveBeenCalled();
        expect(valuesMock).toHaveBeenCalledWith(mockSession);
        expect(result).toEqual(mockSession);
    });

    it('should get sessions by user', async () => {
        const mockSessions = [{ id: 1, userId: 'user-1' }];
        // db.select().from().where()
        const whereMock = vi.fn().mockResolvedValue(mockSessions);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        (db.select as any).mockReturnValue({ from: fromMock });

        const result = await getSessionsByUser('user-1');

        expect(db.select).toHaveBeenCalled();
        expect(result).toEqual(mockSessions);
    });

    it('should get sessions by spot', async () => {
        const mockSessions = [{ id: 1, spotId: 1 }];
        const whereMock = vi.fn().mockResolvedValue(mockSessions);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        (db.select as any).mockReturnValue({ from: fromMock });

        const result = await getSessionsBySpot(1);

        expect(result).toEqual(mockSessions);
    });
});
