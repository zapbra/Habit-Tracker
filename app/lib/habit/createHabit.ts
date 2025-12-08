"use server";

import { db } from "../lib/db/drizzle";
import { habits } from "../lib/db/schema";
import { HabitFormValues } from "../validation/habits";

export async function createHabit(userId: string, data: HabitFormValues) {
    const now = new Date();

    await db.insert(habits).values({
        userId,
        name: data.name,
        description: data.description || null,
        duration: data.duration,
        durationUnit: data.durationUnit,
        frequency: data.frequency,
        timesPerPeriod: data.timesPerPeriod ?? null,
        startDate: new Date(data.startDate),
        archived: false,
        createdAt: now,
        updatedAt: now,
    });
}
