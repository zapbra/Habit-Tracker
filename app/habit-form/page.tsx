"use client";
import { HabitForm } from "../components/HabitForm";
import { createHabit } from "../lib/habit/createHabit";
import { HabitFormValues } from "../lib/validation/habits";

export default function HabitsPage() {
    // TODO: replace this with real user id from auth/session
    const userId = "TEMP_USER_ID";

    async function handleSubmitHabit(values: HabitFormValues) {
        await createHabit(userId, values);
    }

    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Create Habit</h1>
            <HabitForm onSubmitHabit={handleSubmitHabit} />
        </div>
    );
}
