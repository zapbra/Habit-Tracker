// lib/validation/habits.ts
import { z } from "zod";

export const durationUnits = ["minutes", "hours", "days", "weeks"] as const;
export const frequencies = ["daily", "weekly", "monthly", "custom"] as const;

export const habitFormSchema = z
    .object({
        name: z
            .string()
            .min(1, "Name is required")
            .max(100, "Name must be at most 100 characters"),
        description: z
            .string()
            .max(500, "Description must be at most 500 characters")
            .optional()
            .or(z.literal("")),
        duration: z
            .number()
            .int("Duration must be an integer")
            .positive("Duration must be greater than zero"),
        durationUnit: z.enum(durationUnits),
        frequency: z.enum(frequencies),
        timesPerPeriod: z
            .number()
            .int("Times per period must be an integer")
            .positive("Times per period must be greater than zero")
            .optional(),
        startDate: z
            .string()
            .min(1, "Start date is required")
            // very light check, real validation can be more strict
            .refine((val) => !Number.isNaN(Date.parse(val)), {
                message: "Invalid date",
            }),
    })
    .refine(
        (data) => {
            // only require timesPerPeriod for non-daily frequencies
            if (data.frequency === "daily") return true;
            return typeof data.timesPerPeriod === "number";
        },
        {
            message: "Times per period is required for this frequency",
            path: ["timesPerPeriod"],
        }
    );

export type HabitFormValues = z.infer<typeof habitFormSchema>;

// For HabitEntry, we'll take strings for datetime-local fields:
export const habitEntryFormSchema = z
    .object({
        habitId: z.string().min(1, "Habit is required"),
        startTime: z
            .string()
            .min(1, "Start time is required")
            .refine((val) => !Number.isNaN(Date.parse(val)), {
                message: "Invalid start time",
            }),
        endTime: z
            .string()
            .min(1, "End time is required")
            .refine((val) => !Number.isNaN(Date.parse(val)), {
                message: "Invalid end time",
            }),
        notes: z
            .string()
            .max(1000, "Notes must be at most 1000 characters")
            .optional()
            .or(z.literal("")),
    })
    .refine(
        (data) => {
            const start = new Date(data.startTime);
            const end = new Date(data.endTime);
            return end > start;
        },
        {
            message: "End time must be after start time",
            path: ["endTime"],
        }
    );

export type HabitEntryFormValues = z.infer<typeof habitEntryFormSchema>;
