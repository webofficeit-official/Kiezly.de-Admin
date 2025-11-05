import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export function FilterJobMultiSelectArray({
    label,
    options,
    values,
    onChange,
    placeholder = "Select...",
    t
}: {
    label: string;
    options: {label: string}[];
    values: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    t: any
}) {
    function toggle(val: string) {
        const set = new Set(values);
        set.has(val) ? set.delete(val) : set.add(val);
        onChange(Array.from(set));
    }

    return (
        <div className="text-sm mt-5 w-full">
            <span className="mb-1 block text-gray-700">{label}</span>
            <Listbox value={values} onChange={onChange} multiple>
                <div className="relative">
                    <Listbox.Button className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black/20">
                        {values?.length
                            ? `${values?.length} ${t("selected")}`
                            : placeholder}
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">
                        {options.map((opt, i) => (
                            <Listbox.Option key={i} value={opt.label}>
                                {({ selected }) => (
                                    <div className="flex items-center justify-between px-3 py-2 text-sm">
                                        <span>{opt.label}</span>
                                        {selected && <Check className="h-4 w-4 text-black" />}
                                    </div>
                                )}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </div>
            </Listbox>
        </div>
    );
}