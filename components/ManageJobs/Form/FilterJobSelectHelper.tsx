import { Listbox } from "@headlessui/react";
import { Check, ChevronDown, X } from "lucide-react";
import { useState, useMemo } from "react";

export function FilterJobSelectHelper({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  enableSearch = false,
  onSearchChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: {
    id: string;
    display_name: string;
  }[];
  placeholder?: string;
  enableSearch?: boolean;
  onSearchChange?: (v: string) => void;
}) {
  const [search, setSearch] = useState("");

  const selectedOption = options.find((o) => o.id === value);

  const filteredOptions = useMemo(() => {
    if (!enableSearch) return options;

    if (onSearchChange) return options;

    return options.filter((o) =>
      o.display_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, enableSearch, onSearchChange]);

  return (
    <div className="text-sm mt-5 w-full">
      <span className="mb-1 block text-gray-700">{label}</span>

      <Listbox value={value} onChange={onChange}>
        <div className="relative">

          {/* 🔹 Main Button */}
          <Listbox.Button className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black pr-10">
            
            <span className="truncate">
              {selectedOption ? (
                selectedOption.display_name
              ) : (
                <span className="text-gray-400">{placeholder}</span>
              )}
            </span>

            {!selectedOption && (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </Listbox.Button>

          {/*  Clear Button (OUTSIDE Listbox.Button logic) */}
          {selectedOption && (
            <button
              type="button"
              onClick={() => {
                onChange("");
                setSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Options */}
          <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none">

            {enableSearch && (
              <div className="p-2 sticky top-0 bg-white border-b border-gray-200">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSearch(val);
                    if (onSearchChange) {
                      onSearchChange(val);
                    }
                  }}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:border-black"
                />
              </div>
            )}

            {filteredOptions.length > 0 ? (
              filteredOptions.map((o) => (
                <Listbox.Option
                  key={o.id}
                  value={o.id}
                  className="cursor-pointer select-none px-3 py-2 text-sm text-gray-700 ui-active:bg-gray-100"
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span>{o.display_name}</span>
                      {selected && (
                        <Check className="h-4 w-4 text-gray-600" />
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">
                No results found
              </div>
            )}
          </Listbox.Options>

        </div>
      </Listbox>
    </div>
  );
}
