"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Listbox, Portal, Transition } from "@headlessui/react";
import { Search, X, ChevronDown, Check } from "lucide-react";
import { useFilteredCountries } from "@/lib/react-query/queries/countries/countries";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

type Props = {
  q: string;
  pageSize: number;
  countryId: number | "";
  onQueryChange: (val: string) => void;
  onPageSizeChange: (val: number) => void;
  onCountryChange: (val: number | "") => void;
  t: (k: string, vars?: any) => string;
};

function useDebounced<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export default function PostalCodeControls({
  q,
  pageSize,
  countryId,
  onQueryChange,
  onPageSizeChange,
  onCountryChange,
  t,
}: Props) {
  const [localQ, setLocalQ] = useState(q);
  useEffect(() => setLocalQ(q), [q]);
  useEffect(() => {
    const id = setTimeout(() => {
      if (localQ !== q) onQueryChange(localQ);
    }, 300);
    return () => clearTimeout(id);
  }, [localQ, q, onQueryChange]);

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

  const [countryOpen, setCountryOpen] = useState(false);
  const [countryQuery, setCountryQuery] = useState("");
  const countryInputRef = useRef<HTMLInputElement | null>(null);
  const debouncedQ = useDebounced(countryQuery.trim(), 250);

  const countryBtnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [countryBtnRect, setCountryBtnRect] = useState<DOMRect | null>(null);
  useEffect(() => {
    const update = () =>
      setCountryBtnRect(countryBtnRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  // Close only if click is outside BOTH the trigger and the panel
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!countryOpen) return;
      const target = e.target as Node;
      const inBtn = countryBtnRef.current?.contains(target);
      const inPanel = panelRef.current?.contains(target);
      if (!inBtn && !inPanel) setCountryOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [countryOpen]);

  // Autofocus the search input when opening
  useEffect(() => {
    if (countryOpen) {
      setTimeout(() => countryInputRef.current?.focus(), 0);
    }
  }, [countryOpen]);

  const filters = useMemo(
    () => ({
      q: debouncedQ || undefined,
      page: 1,
      page_size: 10,
      sort: undefined,
    }),
    [debouncedQ]
  );

  const { data: countryData, isLoading: countryLoading } = useFilteredCountries(filters);

  // Robustly normalize your API shapes:
  // - { items: [] }               (direct)
  // - { data: { items: [] } }     (wrapped)
  // - { data: [] }                (direct list in data)
  const countryItems: Array<{ id: number; name: string; code?: string }> = useMemo(() => {
    const d: any = countryData;
    let arr: any[] = [];
    if (Array.isArray(d?.data?.items)) arr = d.data.items;
    else if (Array.isArray(d?.items)) arr = d.items;
    else if (Array.isArray(d?.data)) arr = d.data;
    return arr
      .map((c) => ({
        id: Number(c.id),
        name: c.name ?? c.country_name ?? "",
        code: (c.code ?? c.country_code ?? "") || undefined,
      }))
      .filter((c) => Number.isFinite(c.id) && c.name);
  }, [countryData]);

  const selectedCountry = useMemo(
    () => (typeof countryId === "number" ? countryItems.find((c) => c.id === countryId) : undefined),
    [countryItems, countryId]
  );

  return (
    <div className="px-4 pt-3 pb-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full sm:w-72">
          <label className="block mb-1 text-sm text-slate-700">{t("list.country_label", { defaultValue: "Country" })}</label>
          <div className="relative">
            <button
              ref={countryBtnRef}
              type="button"
              onClick={() => setCountryOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-black"
            >
              <span className="truncate">
                {selectedCountry
                  ? `${selectedCountry.name}${selectedCountry.code ? ` (${selectedCountry.code.toUpperCase()})` : ""}`
                  : t("list.country_placeholder", { defaultValue: "Select country" })}
              </span>
              <div className="flex items-center gap-1">
                {countryId !== "" && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onCountryChange("");
                      setCountryQuery("");
                    }}
                    className="rounded px-1 text-xs text-slate-500 hover:bg-slate-100"
                  >
                    {t("common.clear")}
                  </button>
                )}
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </button>

            <Portal>
              <Transition
                show={countryOpen}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                {countryBtnRect && (
                  <div
                    ref={panelRef}
                    className="z-[1000] max-h-64 w-[--width] overflow-auto rounded-xl border border-gray-200 bg-white shadow-lg"
                    style={{
                      position: "fixed",
                      top: countryBtnRect.bottom + 6,
                      left: countryBtnRect.left,
                      width: countryBtnRect.width,
                    } as React.CSSProperties}
                  >
                    <div className="p-2 border-b border-gray-100">
                      <div className="relative">
                        <input
                          ref={countryInputRef}
                          value={countryQuery}
                          onChange={(e) => setCountryQuery(e.target.value)}
                          placeholder={t("list.country_search_placeholder", { defaultValue: "Search country…" })}
                          className="w-full rounded-md border border-gray-300 px-8 py-2 text-sm outline-none"
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setCountryOpen(false);
                          }}
                        />
                        <Search className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        {!!countryQuery && (
                          <button
                            type="button"
                            onClick={() => setCountryQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-slate-500 hover:bg-slate-100"
                          >
                            {t("common.clear")}
                          </button>
                        )}
                      </div>
                    </div>

                    {countryLoading ? (
                      <div className="px-3 py-2 text-sm text-slate-500">{t("common.loading", { defaultValue: "Loading…" })}</div>
                    ) : countryItems.length === 0 ? (
                      <div className="px-3 py-2 text-sm text-slate-500">{t("list.no_results", { defaultValue: "No results" })}</div>
                    ) : (
                      <ul className="py-1">
                        {countryItems.map((c) => {
                          const label = `${c.name}${c.code ? ` (${c.code.toUpperCase()})` : ""}`;
                          const selected = typeof countryId === "number" && countryId === c.id;
                          return (
                            <li
                              key={c.id}
                              className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 ${
                                selected ? "font-medium text-slate-900" : "text-gray-700"
                              }`}
                              onClick={() => {
                                onCountryChange(c.id);
                                setCountryOpen(false);
                              }}
                            >
                              <span className="truncate">{label}</span>
                              {selected && <Check className="h-4 w-4" />}
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                )}
              </Transition>
            </Portal>
          </div>
        </div>
        <div className="w-full sm:max-w-sm">
          <label className="block mb-1 text-sm text-slate-700">{t("list.search_label")}</label>
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
                onClick={() => {
                  setLocalQ("");
                  onQueryChange("");
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-slate-600 hover:bg-slate-100"
                aria-label={t("list.clearSearch")}
              >
                <X className="h-3.5 w-3.5" />
                {t("common.clear")}
              </button>
            )}
          </div>
        </div>

        <PageSizeBox
          pageSize={pageSize}
          onChange={onPageSizeChange}
          t={t}
          btnRef={btnRef}
          btnRect={btnRect}
          setBtnRect={setBtnRect}
        />

    
      </div>
    </div>
  );
}

function PageSizeBox({
  pageSize,
  onChange,
  t,
  btnRef,
  btnRect,
  setBtnRect,
}: {
  pageSize: number;
  onChange: (n: number) => void;
  t: (k: string, vars?: any) => string;
  btnRef: React.RefObject<HTMLButtonElement>;
  btnRect: DOMRect | null;
  setBtnRect: (r: DOMRect | null) => void;
}) {
  const pageSizeOptions = PAGE_SIZE_OPTIONS.map((n) => ({ value: n, label: String(n) }));

  useEffect(() => {
    const update = () => setBtnRect(btnRef.current?.getBoundingClientRect() ?? null);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [btnRef, setBtnRect]);

  return (
    <div className="w-full sm:w-44">
      <label className="block mb-1 text-sm text-slate-700">{t("list.per_page")}</label>
      <Listbox value={pageSize} onChange={onChange}>
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
                      top: btnRect.bottom + 6,
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
  );
}
