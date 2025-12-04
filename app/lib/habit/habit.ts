type Habit = {
    id: string;
    userId: string;
    name: string;
    description?: string;
    duration: number;
    durationUnit: "minutes" | "hours" | "days" | "weeks";
    frequency: "daily" | "weekly" | "monthly" | "custom";
    timesPerPeriod?: number; // e.g. 3 times per week
    startDate: Date;
    archived: boolean;
    createdAt: Date;
    updatedAt: Date;
};

type HabitEntry = {
    id: string;
    habitId: string;
    startTime: Date;
    endTime: Date;
    notes: string;
};
