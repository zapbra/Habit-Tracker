"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    habitFormSchema,
    type HabitFormValues,
    durationUnits,
    frequencies,
} from "../lib/validation/habits";

type HabitFormProps = {
    // You can change this to a server action or mutation function
    onSubmitHabit: (values: HabitFormValues) => Promise<void> | void;
};

export function HabitForm({ onSubmitHabit }: HabitFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
    } = useForm<HabitFormValues>({
        resolver: zodResolver(habitFormSchema),
        defaultValues: {
            name: "",
            description: "",
            duration: 30,
            durationUnit: "minutes",
            frequency: "daily",
            startDate: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
        },
    });

    const onSubmit = async (data: HabitFormValues) => {
        await onSubmitHabit(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
            {/* Name */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Name</label>
                <input
                    type="text"
                    {...register("name")}
                    className="border rounded px-2 py-1"
                />
                {errors.name && (
                    <p className="text-sm text-red-600">
                        {errors.name.message}
                    </p>
                )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Description</label>
                <textarea
                    rows={3}
                    {...register("description")}
                    className="border rounded px-2 py-1"
                />
                {errors.description && (
                    <p className="text-sm text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            {/* Duration + Unit */}
            <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                    <label className="font-medium">Duration</label>
                    <input
                        type="number"
                        {...register("duration", { valueAsNumber: true })}
                        className="border rounded px-2 py-1"
                        min={1}
                    />
                    {errors.duration && (
                        <p className="text-sm text-red-600">
                            {errors.duration.message}
                        </p>
                    )}
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium">Unit</label>
                    <select
                        {...register("durationUnit")}
                        className="border rounded px-2 py-1"
                    >
                        {durationUnits.map((unit) => (
                            <option key={unit} value={unit}>
                                {unit}
                            </option>
                        ))}
                    </select>
                    {errors.durationUnit && (
                        <p className="text-sm text-red-600">
                            {errors.durationUnit.message}
                        </p>
                    )}
                </div>
            </div>

            {/* Frequency */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Frequency</label>
                <select
                    {...register("frequency")}
                    className="border rounded px-2 py-1"
                >
                    {frequencies.map((freq) => (
                        <option key={freq} value={freq}>
                            {freq}
                        </option>
                    ))}
                </select>
                {errors.frequency && (
                    <p className="text-sm text-red-600">
                        {errors.frequency.message}
                    </p>
                )}
            </div>

            {/* Times per period (for weekly/monthly/custom) */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Times per period</label>
                <input
                    type="number"
                    {...register("timesPerPeriod", { valueAsNumber: true })}
                    className="border rounded px-2 py-1"
                    min={1}
                />
                {errors.timesPerPeriod && (
                    <p className="text-sm text-red-600">
                        {errors.timesPerPeriod.message}
                    </p>
                )}
            </div>

            {/* Start date */}
            <div className="flex flex-col gap-1">
                <label className="font-medium">Start date</label>
                <input
                    type="date"
                    {...register("startDate")}
                    className="border rounded px-2 py-1"
                />
                {errors.startDate && (
                    <p className="text-sm text-red-600">
                        {errors.startDate.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded bg-black text-white disabled:opacity-60"
            >
                {isSubmitting ? "Saving..." : "Create Habit"}
            </button>
        </form>
    );
}
