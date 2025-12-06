import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createSpot, getSpots, getSpotById, updateSpot, deleteSpot } from './spots';
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

describe('Spots CRUD', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('should create a spot', async () => {
        const mockSpot = { name: 'Test Spot', lat: 10, lng: 10 };
        const returningMock = vi.fn().mockResolvedValue([mockSpot]);
        const valuesMock = vi.fn().mockReturnValue({ returning: returningMock });

        (db.insert as any).mockReturnValue({ values: valuesMock });

        const result = await createSpot(mockSpot as any);

        expect(db.insert).toHaveBeenCalled();
        expect(valuesMock).toHaveBeenCalledWith(mockSpot);
        expect(result).toEqual(mockSpot);
    });

    it('should get all spots', async () => {
        const mockSpots = [{ id: 1, name: 'Spot 1' }];
        // db.select().from() chain
        const fromMock = vi.fn().mockResolvedValue(mockSpots);
        (db.select as any).mockReturnValue({ from: fromMock });

        const result = await getSpots();

        expect(db.select).toHaveBeenCalled();
        expect(result).toEqual(mockSpots);
    });

    it('should get spot by id', async () => {
        const mockSpot = { id: 1, name: 'Spot 1' };
        // db.select().from().where() chain
        const whereMock = vi.fn().mockResolvedValue([mockSpot]);
        const fromMock = vi.fn().mockReturnValue({ where: whereMock });
        (db.select as any).mockReturnValue({ from: fromMock });

        const result = await getSpotById(1);

        expect(result).toEqual(mockSpot);
    });
});
