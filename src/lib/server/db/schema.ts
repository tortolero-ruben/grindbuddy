import { pgTable, serial, text, doublePrecision, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { user, session, account, verification } from '@repo/auth/schema';

export { user, session, account, verification };

export const spotTypeEnum = pgEnum('spot_type', ['street', 'park', 'diy', 'other']);
export const difficultyEnum = pgEnum('difficulty', ['beginner', 'intermediate', 'advanced', 'pro']);
export const securityLevelEnum = pgEnum('security_level', ['none', 'chill', 'high', 'bust']);

export const spots = pgTable('spots', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	description: text('description'),
	lat: doublePrecision('lat'),
	lng: doublePrecision('lng'),
	type: spotTypeEnum('type').default('street'),
	difficulty: difficultyEnum('difficulty').default('beginner'),
	securityLevel: securityLevelEnum('security_level').default('chill'),
	createdBy: text('created_by').references(() => (user.id as any)),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at').defaultNow().$onUpdate(() => new Date())
});

export const sessions = pgTable('sessions', {
	id: serial('id').primaryKey(),
	spotId: integer('spot_id').references(() => spots.id, { onDelete: 'cascade' }),
	userId: text('user_id').references(() => (user.id as any), { onDelete: 'cascade' }),
	startTime: timestamp('start_time').notNull(),
	endTime: timestamp('end_time'),
	notes: text('notes'),
	rating: integer('rating').default(0),
	createdAt: timestamp('created_at').defaultNow()
});
