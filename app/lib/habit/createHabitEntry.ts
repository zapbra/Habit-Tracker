"use server";

import { db } from "../lib/db/drizzle";
import { habitEntries } from "../lib/db/schema";
import { HabitEntryFormValues } from "../validation/habits";

export async function createHabitEntry(data: HabitEntryFormValues) {
    await db.insert(habitEntries).values({
        habitId: data.habitId,
        startTime: new Date(data.startTime),
        endTime: new Date(data.endTime),
        notes: data.notes ?? "",
    });
}
