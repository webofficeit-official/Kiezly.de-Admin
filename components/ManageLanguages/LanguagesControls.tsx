"use client";

import { useEffect, useState, useRef } from "react";
import { Listbox, Portal, Transition } from "@headlessui/react";
import { Search, X, ChevronDown, Check } from "lucide-react";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function LanguagesControls({
  q,
  pageSize,
  onQueryChange,
  onPageSizeChange,
  t,
}) {
  const [localQ, setLocalQ] = useState(q);
  useEffect(() => setLocalQ(q), [q]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (localQ !== q) onQueryChange(localQ);
    }, 300);
    return () => clearTimeout(id);
  }, [localQ]); 

  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((n) => ({ value: n, label: String(n) }));
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const [btnRect, setBtnRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    const update = () => setBtnRect(btnRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        
        <div className="w-full sm:max-w-sm">
          <label className="block mb-1 text-sm text-slate-700">
            {t("list.search_label")}
          </label>
          <div className="relative">
            <input
              type="text"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onQueryChange(localQ)}
              placeholder={t("list.search_placeholder")}
              aria-label={t("list.search_aria")}
              className="rounded-xl w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-gray-300 px-9 py-2 shadow-sm focus:shadow-md outline-none"
            />
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            {!!localQ && (
              <button
                type="button"
                onClick={() => { setLocalQ(""); onQueryChange(""); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                aria-label={t("list.clearSearch")}
              >
                <X className="h-3.5 w-3.5" />
                {t("common.clear")}
              </button>
            )}
          </div>
        </div>

     
        <div className="w-full sm:w-44">
          <label className="block mb-1 text-sm text-slate-700">
            {t("list.per_page")}
          </label>

          <Listbox value={pageSize} onChange={onPageSizeChange}>
            {({ open }) => (
              <div className="relative">
                <Listbox.Button
                  ref={btnRef}
                  className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black"
                >
                  {pageSizeOptions.find((o) => o.value === pageSize)?.label ?? "Select"}
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </Listbox.Button>

                <Portal>
                  <Transition
                    show={open}
                    enter="transition ease-out duration-100"
                    enterFrom="opacity-0 scale-95"
                    enterTo="opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="opacity-100 scale-100"
                    leaveTo="opacity-0 scale-95"
                  >
                    {btnRect && (
                      <Listbox.Options
                        static
                        className="z-[1000] max-h-44 w-[--width] overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg focus:outline-none"
                       
                        style={{
                          position: "fixed",
                          top: btnRect.bottom + 6,          // small gap below button
                          left: btnRect.left,
                          width: btnRect.width,
                        } as React.CSSProperties}
                      >
                        {pageSizeOptions.map((o) => (
                          <Listbox.Option
                            key={o.value}
                            value={o.value}
                            className="cursor-pointer select-none px-3 py-2 text-sm text-gray-700 ui-active:bg-gray-100"
                          >
                            {({ selected }) => (
                              <div className="flex items-center justify-between">
                                <span>{o.label}</span>
                                {selected && <Check className="h-4 w-4 text-gray-600" />}
                              </div>
                            )}
                          </Listbox.Option>
                        ))}
                      </Listbox.Options>
                    )}
                  </Transition>
                </Portal>
              </div>
            )}
          </Listbox>
        </div>
      </div>
    </div>
  );
}
