import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay } from "date-fns";
import { Popover } from "@headlessui/react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

export function FilterJobDateInput({
    label,
    value,
    onChange,
    required,
    placeholder = "Select date"
}: {
    label: string;
    value: string | null;
    onChange: (v: string) => void;
    required?: boolean;
    placeholder?: string;
}) {
    const [month, setMonth] = useState(new Date());

    const days = eachDayOfInterval({
        start: startOfMonth(month),
        end: endOfMonth(month),
    });

    const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i); // Last 100 years
    const months = Array.from({ length: 12 }, (_, i) => format(new Date(2024, i, 1), "MMMM"));

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = new Date(month);
        newMonth.setMonth(parseInt(e.target.value));
        setMonth(newMonth);
    };

    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newMonth = new Date(month);
        newMonth.setFullYear(parseInt(e.target.value));
        setMonth(newMonth);
    };

    return (
        <div className="block text-sm w-full mt-5">
            <span className="mb-1 block text-gray-700">
                {label}
                {required && <span className="text-red-600">*</span>}
            </span>

            <Popover className="relative">
                <Popover.Button className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-left shadow-sm focus:border-black">
                    {value ? format(new Date(value), "yyyy-MM-dd") : placeholder}
                    <CalendarIcon className="h-4 w-4 text-gray-400" />
                </Popover.Button>

                <Popover.Panel className="absolute z-10 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-3 shadow-lg">
                    {/* Month navigation with dropdowns */}
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => setMonth(subMonths(month, 1))}
                            className="rounded p-1 hover:bg-gray-100"
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <div className="flex space-x-2">
                            <select
                                value={month.getMonth()}
                                onChange={handleMonthChange}
                                className="rounded-md bg-background text-sm px-1 py-0.5"
                            >
                                {months.map((m, i) => (
                                    <option key={m} value={i}>
                                        {m}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={month.getFullYear()}
                                onChange={handleYearChange}
                                className="rounded-md bg-background text-sm px-1 py-0.5"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>
                                        {y}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="button"
                            onClick={() => setMonth(addMonths(month, 1))}
                            className="rounded p-1 hover:bg-gray-100"
                        >
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                            <div key={d} className="font-medium text-gray-500">
                                {d}
                            </div>
                        ))}
                        {days.map((day) => (
                            <button
                                key={day.toISOString()}
                                onClick={() => onChange(format(day, "yyyy-MM-dd"))}
                                className={`rounded-lg px-2 py-1 text-sm hover:bg-gray-100 ${value && isSameDay(new Date(value), day)
                                    ? "bg-black text-white"
                                    : "text-gray-700"
                                    }`}
                            >
                                {format(day, "d")}
                            </button>
                        ))}
                    </div>
                </Popover.Panel>
            </Popover>
        </div>
    );
}