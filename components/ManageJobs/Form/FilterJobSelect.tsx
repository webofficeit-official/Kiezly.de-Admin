import { Listbox } from "@headlessui/react";
import { Check, ChevronDown } from "lucide-react";

export function FilterJobSelect({
    label,
    value,
    onChange,
    options,
    placeholder = "Select"
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: {
        value: string
        label: string
    }[];
    placeholder?: string
}) {
    return (
        <div className="text-sm mt-5 w-full">
            <span className="mb-1 block text-gray-700">{label}</span>

            <Listbox value={value} onChange={onChange}>
                <div className="relative">
                    <Listbox.Button className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black">
                        {value ? options.find(o => (o.value == value))?.label : placeholder}
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </Listbox.Button>

                    <Listbox.Options className="absolute z-10 mt-2 max-h-36 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none cursor-pointer">
                        {options.map((o) => (
                            <Listbox.Option
                                key={o.value}
                                value={o.value}
                                className="cursor-pointer select-none px-3 py-2 text-sm text-gray-700 ui-active:bg-gray-100"
                            >
                                {({ selected }) => (
                                    <div className="flex items-center justify-between cursor-pointer">
                                        <span className="cursor-pointer" key={o.value}>{o.label}</span>
                                        {selected && <Check className="h-4 w-4 text-gray-600" />}
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