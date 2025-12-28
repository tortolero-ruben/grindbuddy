import { describe, it, expect } from 'vitest';

describe('Package Resolution (Standalone Migration)', () => {
	// Note: grind-buddy is now standalone with its own local schema
	// These tests verify that imports resolve correctly after the migration from fee-fight

	it('should import local schema module successfully', async () => {
		const schema = await import('$lib/server/db/schema');
		expect(schema).toBeDefined();
		expect(schema.user).toBeDefined();
		expect(schema.session).toBeDefined();
		expect(schema.problems).toBeDefined();
		expect(schema.logs).toBeDefined();
	});

	it('should import local auth module', async () => {
		const auth = await import('$lib/server/auth');
		expect(auth).toBeDefined();
		expect(auth.getAuthClient).toBeDefined();
		expect(auth.createAuth).toBeDefined();
	});

	it('should import local auth-client module', async () => {
		const authClient = await import('$lib/auth-client');
		expect(authClient).toBeDefined();
		expect(authClient.getAuthClient).toBeDefined();
		expect(authClient.signIn).toBeDefined();
		expect(authClient.signUp).toBeDefined();
		expect(authClient.signOut).toBeDefined();
		expect(authClient.getSession).toBeDefined();
	});

	it('should resolve schema exports', async () => {
		const schema = await import('$lib/server/db/schema');
		// Verify key schema tables are exported
		const expectedTables = [
			'user',
			'session',
			'account',
			'verification',
			'problems',
			'companies',
			'companyProblems',
			'logs'
		];
		for (const tableName of expectedTables) {
			expect(schema[tableName as keyof typeof schema]).toBeDefined();
		}
	});

	it('should resolve drizzle relations', async () => {
		const schema = await import('$lib/server/db/schema');
		// Verify relations are exported
		const expectedRelations = [
			'userRelations',
			'sessionRelations',
			'accountRelations',
			'problemsRelations',
			'logsRelations',
			'companiesRelations',
			'companyProblemsRelations'
		];
		for (const relationName of expectedRelations) {
			expect(schema[relationName as keyof typeof schema]).toBeDefined();
		}
	});
});
