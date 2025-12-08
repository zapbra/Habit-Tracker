"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    habitEntryFormSchema,
    type HabitEntryFormValues,
} from "../lib/validation/habits";

type HabitOption = {
    id: string;
    name: string;
};

type HabitEntryFormProps = {
    habits: HabitOption[];
    onSubmitEntry: (values: HabitEntryFormValues) => Promise<void> | void;
};

export function HabitEntryForm({ habits, onSubmitEntry }: HabitEntryFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<HabitEntryFormValues>({
        resolver: zodResolver(habitEntryFormSchema),
        defaultValues: {
            habitId: habits[0]?.id ?? "",
            startTime: "",
            endTime: "",
            notes: "",
        },
    });

    const onSubmit = async (data: HabitEntryFormValues) => {
        await onSubmitEntry(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            {/* Habit select */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Habit</label>
                <select
                    {...register("habitId")}
                    className="border rounded px-2 py-1"
                >
                    <option value="">Select habit</option>
                    {habits.map((h) => (
                        <option key={h.id} value={h.id}>
                            {h.name}
                        </option>
                    ))}
                </select>
                {errors.habitId && (
                    <p className="text-sm text-red-600">
                        {errors.habitId.message}
                    </p>
                )}
            </div>

            {/* Start time */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Start time</label>
                <input
                    type="datetime-local"
                    {...register("startTime")}
                    className="border rounded px-2 py-1"
                />
                {errors.startTime && (
                    <p className="text-sm text-red-600">
                        {errors.startTime.message}
                    </p>
                )}
            </div>

            {/* End time */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">End time</label>
                <input
                    type="datetime-local"
                    {...register("endTime")}
                    className="border rounded px-2 py-1"
                />
                {errors.endTime && (
                    <p className="text-sm text-red-600">
                        {errors.endTime.message}
                    </p>
                )}
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Notes</label>
                <textarea
                    rows={3}
                    {...register("notes")}
                    className="border rounded px-2 py-1"
                />
                {errors.notes && (
                    <p className="text-sm text-red-600">
                        {errors.notes.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Create Entry"}
            </button>
        </form>
    );
}
