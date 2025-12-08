import { HabitEntryForm } from "../components/HabitEntryForm";
import { createHabitEntry } from "../lib/habit/createHabitEntry";

export default function HabitEntryPage() {
    const habits = [
        { id: "1", name: "Studying" },
        { id: "2", name: "Drawing" },
        { id: "3", name: "Working out" },
    ];
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Log Habit Entry</h1>
            <HabitEntryForm habits={habits} onSubmitEntry={createHabitEntry} />
        </div>
    );
}
