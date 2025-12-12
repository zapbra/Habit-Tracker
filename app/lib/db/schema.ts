// lib/db/schema.ts
import {
    pgTable,
    uuid,
    varchar,
    text,
    integer,
    timestamp,
    boolean,
    pgEnum,
} from "drizzle-orm/pg-core";
import type { InferSelectModel, InferInsertModel } from "drizzle-orm";

/**
 * Enums
 * Create Postgres enums so the DB enforces valid units/frequencies.
 */
export const durationUnitEnum = pgEnum("duration_unit", [
    "minutes",
    "hours",
    "days",
    "weeks",
]);

export const frequencyEnum = pgEnum("frequency_enum", [
    "daily",
    "weekly",
    "monthly",
    "custom",
]);

/**
 * Users table (generic)
 */
export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    email: varchar("email", { length: 256 }).notNull(),
    name: varchar("name", { length: 128 }).default("").notNull(),
    password_hash: varchar("password_hash", { length: 255}).notNull(),
    // add more auth fields as needed (e.g. provider ID, hashed password) depending on your auth solution
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Habits table
 */
export const habits = pgTable("habits", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id), // FK -> users.id
    name: varchar("name", { length: 200 }).notNull(),
    description: text("description").default(""),
    duration: integer("duration").notNull(), // stored as integer (e.g. 30)
    durationUnit: durationUnitEnum("duration_unit").notNull(),
    frequency: frequencyEnum("frequency").notNull(),
    timesPerPeriod: integer("times_per_period"), // optional
    startDate: timestamp("start_date").notNull(), // store as timestamp; convert Date <-> DB
    archived: boolean("archived").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Habit entries (logs of completed sessions)
 */
export const habitEntries = pgTable("habit_entries", {
    id: uuid("id").defaultRandom().primaryKey(),
    habitId: uuid("habit_id")
        .notNull()
        .references(() => habits.id), // FK -> habits.id
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    notes: text("notes").default(""),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * TypeScript types inferred from the schema
 */

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export type Habit = InferSelectModel<typeof habits>;
export type NewHabit = InferInsertModel<typeof habits>;

export type HabitEntry = InferSelectModel<typeof habitEntries>;
export type NewHabitEntry = InferInsertModel<typeof habitEntries>;
