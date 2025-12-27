import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use vi.hoisted to make mockDb and createMockDb available to mocks
const { mockDb, createMockDb } = vi.hoisted(() => {
	const innerCreateMockDb = () => {
		const m = {
			select: vi.fn(),
			from: vi.fn(),
			where: vi.fn(),
			orderBy: vi.fn()
		};
		m.select.mockReturnValue(m);
		m.from.mockReturnValue(m);
		m.where.mockReturnValue(m);
		m.orderBy.mockResolvedValue([]);
		return m;
	};
	return {
		mockDb: innerCreateMockDb(),
		createMockDb: innerCreateMockDb
	};
});

// Mock drizzle function to return our mock db
vi.mock('drizzle-orm/neon-serverless', () => ({
	drizzle: vi.fn(() => mockDb)
}));

// Mock other drizzle-orm exports
vi.mock('drizzle-orm', () => ({
	eq: vi.fn((table, value) => ({ table, value })),
	desc: vi.fn((column) => ({ column, order: 'desc' })),
	relations: vi.fn((schema: any, fn: any) => fn)
}));

// Mock @neondatabase/serverless Pool
vi.mock('@neondatabase/serverless', () => ({
	Pool: vi.fn(),
	neonConfig: { webSocketConstructor: null }
}));

// Mock dotenv
vi.mock('dotenv', () => ({
	config: vi.fn()
}));

// Import after mocks are set up
import { getProblems, getLogs } from './index';

describe('Database Helpers', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Reset chain
		const freshMock = createMockDb();
		Object.assign(mockDb, freshMock);
	});

	describe('getProblems', () => {
		it('should fetch all problems', async () => {
			const mockProblems = [{ id: '1', title: 'Two Sum' }];
			mockDb.from.mockResolvedValue(mockProblems);

			const result = await getProblems();

			expect(mockDb.select).toHaveBeenCalled();
			expect(result).toEqual(mockProblems);
		});
	});

	describe('getLogs', () => {
		it('should fetch logs for a specific user ordered by timestamp', async () => {
			const userId = 'user-123';
			const mockLogs = [{ id: 'log-1', userId, status: 'Optimal' }];
			mockDb.orderBy.mockResolvedValue(mockLogs);

			const result = await getLogs(userId);

			expect(mockDb.select).toHaveBeenCalled();
			expect(mockDb.orderBy).toHaveBeenCalled();
			expect(result).toEqual(mockLogs);
		});
	});
});
