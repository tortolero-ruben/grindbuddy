import { relations } from "drizzle-orm";
import { pgTable, text, integer, timestamp, boolean, index, serial } from "drizzle-orm/pg-core";

// --- Auth Schema ---

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").default(false).notNull(),
    image: text("image"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date())
        .notNull(),
});

export const session = pgTable(
    "session",
    {
        id: text("id").primaryKey(),
        expiresAt: timestamp("expires_at").notNull(),
        token: text("token").notNull().unique(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
        ipAddress: text("ip_address"),
        userAgent: text("user_agent"),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
    },
    (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
    "account",
    {
        id: text("id").primaryKey(),
        accountId: text("account_id").notNull(),
        providerId: text("provider_id").notNull(),
        userId: text("user_id")
            .notNull()
            .references(() => user.id, { onDelete: "cascade" }),
        accessToken: text("access_token"),
        refreshToken: text("refresh_token"),
        idToken: text("id_token"),
        accessTokenExpiresAt: timestamp("access_token_expires_at"),
        refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
        scope: text("scope"),
        password: text("password"),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
    "verification",
    {
        id: text("id").primaryKey(),
        identifier: text("identifier").notNull(),
        value: text("value").notNull(),
        expiresAt: timestamp("expires_at").notNull(),
        createdAt: timestamp("created_at").defaultNow().notNull(),
        updatedAt: timestamp("updated_at")
            .defaultNow()
            .$onUpdate(() => new Date())
            .notNull(),
    },
    (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const userRelations = relations(user, ({ many }) => ({
    sessions: many(session),
    accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
    user: one(user, {
        fields: [session.userId],
        references: [user.id],
    }),
}));

export const accountRelations = relations(account, ({ one }) => ({
    user: one(user, {
        fields: [account.userId],
        references: [user.id],
    }),
}));

// --- Application Schema ---

export const problems = pgTable('problems', {
    id: text('id').primaryKey(),
    number: integer('number').notNull(),
    title: text('title').notNull(),
    difficulty: text('difficulty').notNull(),
    patterns: text('patterns').array().notNull(),
    neetcodeUrl: text('neetcode_url'),
    leetcodeUrl: text('leetcode_url').notNull()
});

export const companies = pgTable('companies', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
    color: text('color')
});

export const companyProblems = pgTable('company_problems', {
    id: serial('id').primaryKey(),
    companyId: text('company_id').references(() => companies.id).notNull(),
    problemId: text('problem_id').references(() => problems.id).notNull(),
    frequency: integer('frequency').default(0),
    timeframe: text('timeframe').notNull() // '30 days', '3 months', '6 months', 'all'
});

export const logs = pgTable('logs', {
    id: text('id').primaryKey(),
    userId: text('user_id').references(() => user.id).notNull(),
    problemId: text('problem_id').references(() => problems.id).notNull(),
    status: text('status').notNull(),
    timeComplexity: text('time_complexity'),
    spaceComplexity: text('space_complexity'),
    notes: text('notes'),
    timestamp: timestamp('timestamp').notNull()
});

export const problemsRelations = relations(problems, ({ many }) => ({
    logs: many(logs)
}));

export const logsRelations = relations(logs, ({ one }) => ({
    problem: one(problems, {
        fields: [logs.problemId],
        references: [problems.id]
    }),
    user: one(user, {
        fields: [logs.userId],
        references: [user.id]
    })
}));

export const companiesRelations = relations(companies, ({ many }) => ({
    companyProblems: many(companyProblems)
}));

export const companyProblemsRelations = relations(companyProblems, ({ one }) => ({
    company: one(companies, {
        fields: [companyProblems.companyId],
        references: [companies.id]
    }),
    problem: one(problems, {
        fields: [companyProblems.problemId],
        references: [problems.id]
    })
}));
