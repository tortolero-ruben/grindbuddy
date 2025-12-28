import { describe, it, expect } from 'vitest';

describe('Package Resolution (Standalone Migration)', () => {
	// Note: grind-buddy is now standalone with its own local schema
	// These tests verify that imports resolve correctly after the migration from fee-fight
	// and that we're using local grind-buddy schema, not the workspace packages/db

	it('should import local schema module successfully', async () => {
		const schema = await import('$lib/server/db/schema');
		expect(schema).toBeDefined();
		expect(typeof schema === 'object').toBe(true);

		// Verify specific tables exist and are objects
		expect(schema.user).toBeDefined();
		expect(typeof schema.user).toBe('object');
		expect(schema.session).toBeDefined();
		expect(typeof schema.session).toBe('object');
		expect(schema.problems).toBeDefined();
		expect(typeof schema.problems).toBe('object');
		expect(schema.logs).toBeDefined();
		expect(typeof schema.logs).toBe('object');
	});

	it('should import local auth module', async () => {
		const auth = await import('$lib/server/auth');
		expect(auth).toBeDefined();
		expect(typeof auth === 'object').toBe(true);

		// Verify auth exports are functions
		expect(auth.getAuthClient).toBeDefined();
		expect(typeof auth.getAuthClient).toBe('function');
		expect(auth.createAuth).toBeDefined();
		expect(typeof auth.createAuth).toBe('function');
	});

	it('should import local auth-client module', async () => {
		const authClient = await import('$lib/auth-client');
		expect(authClient).toBeDefined();
		expect(typeof authClient === 'object').toBe(true);

		// Verify auth-client exports are functions
		expect(authClient.getAuthClient).toBeDefined();
		expect(typeof authClient.getAuthClient).toBe('function');
		expect(authClient.signIn).toBeDefined();
		expect(typeof authClient.signIn).toBe('function');
		expect(authClient.signUp).toBeDefined();
		expect(typeof authClient.signUp).toBe('function');
		expect(authClient.signOut).toBeDefined();
		expect(typeof authClient.signOut).toBe('function');
		expect(authClient.getSession).toBeDefined();
		expect(typeof authClient.getSession).toBe('function');
	});

	it('should use local grind-buddy schema not workspace package', async () => {
		const schemaModule = await import('$lib/server/db/schema');

		// These tables are specific to grind-buddy's local schema
		// packages/db has different tables (restaurants, users, sessions, etc.)
		// If problems/logs exist, it confirms we're using the grind-buddy schema
		expect(schemaModule.problems).toBeDefined();
		expect(typeof schemaModule.problems).toBe('object');
		expect(schemaModule.logs).toBeDefined();
		expect(typeof schemaModule.logs).toBe('object');

		// Verify grind-buddy specific company tables
		expect(schemaModule.companies).toBeDefined();
		expect(typeof schemaModule.companies).toBe('object');
		expect(schemaModule.companyProblems).toBeDefined();
		expect(typeof schemaModule.companyProblems).toBe('object');
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
			const table = schema[tableName as keyof typeof schema];
			expect(table).toBeDefined();
			expect(typeof table).toBe('object');
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
			const relation = schema[relationName as keyof typeof schema];
			expect(relation).toBeDefined();
			expect(typeof relation).toBe('object');
		}
	});
});
