"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";
import { Zipcode, UpdateZipcodePayload } from "@/lib/types/postal-codes-type";
import { useAddZipcode, useUpdateZipcode } from "@/lib/react-query/queries/postal-codes/postal-codes";
import { useFilteredCountries } from "@/lib/react-query/queries/countries/countries";

type CountryOption = { id: number; name: string; code: string };

type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  t: (k: string) => string;
  DataItem?: Zipcode | null;
};

function useDebouncedValue<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

type CountrySelectProps = {
  label: string;
  placeholder: string;
  valueId: number | "";
  valueLabel: string;
  query: string;
  setQuery: (v: string) => void;
  onSelect: (opt: CountryOption) => void;
  onClear: () => void;
  loading?: boolean;
  error?: boolean;
  errorMessage?: string;
  options: CountryOption[];
  disabled?: boolean;
};

function CountrySelect({
  label,
  placeholder,
  valueId,
  valueLabel,
  query,
  setQuery,
  onSelect,
  onClear,
  options,
  loading,
  error,
  errorMessage,
  disabled,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const showLabel = valueId !== "" && valueLabel;

  const list = useMemo(
    () =>
      (options ?? []).map((o) => ({
        ...o,
        _label: `${o.name}${o.code ? ` (${String(o.code).toUpperCase()})` : ""}`,
      })),
    [options]
  );

  return (
    <div className="w-full relative" ref={boxRef}>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          disabled={disabled}
          className={`w-full rounded-md border px-3 py-2 text-sm outline-none transition ${
            error ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-300 focus:border-slate-400 focus:ring-1 focus:ring-slate-300"
          } ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
          placeholder={placeholder}
          value={showLabel ? valueLabel : query}
          onChange={(e) => {
            const v = e.target.value;
            if (showLabel) {
              onClear();
              setQuery(v);
            } else {
              setQuery(v);
            }
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
        />
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center gap-2">
          {loading && <span className="pointer-events-auto h-4 w-4 animate-spin rounded-full border border-slate-400 border-t-transparent" />}
        </div>
        {valueId !== "" && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-1 text-xs text-slate-500 hover:bg-slate-100"
          >
            Clear
          </button>
        )}
        {open && !showLabel && !disabled && (
          <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-auto rounded-md border border-slate-200 bg-white shadow-lg">
            {loading ? (
              <div className="px-3 py-2 text-sm text-slate-500">Searching…</div>
            ) : list.length === 0 ? (
              <div className="px-3 py-2 text-sm text-slate-500">No results</div>
            ) : (
              <ul>
                {list.map((opt) => (
                  <li
                    key={String(opt.id)}
                    className="cursor-pointer px-3 py-2 text-sm hover:bg-slate-50"
                    onClick={() => {
                      onSelect(opt);
                      setOpen(false);
                    }}
                  >
                    {opt._label}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}
    </div>
  );
}

export default function PostalCodeUpsertModal({ isOpen, setIsOpen, t, DataItem }: Props) {
  const isEdit = Boolean(DataItem?.id);
  const [countryId, setCountryId] = useState<number | "">("");
  const [countryLabel, setCountryLabel] = useState<string>("");
  const [countryQuery, setCountryQuery] = useState<string>("");
  const [zipcode, setZipcode] = useState<string>("");
  const [street, setStreet] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const [errors, setErrors] = useState<{
    countryId?: string;
    zipcode?: string;
    street?: string;
    city?: string;
    state?: string;
    latitude?: string;
    longitude?: string;
  }>({});

  const addData = useAddZipcode();
  const updateData = useUpdateZipcode();
  const submitting = addData.isPending || updateData.isPending;

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, submitting, setIsOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (isEdit && DataItem) {
      setCountryId(DataItem.country_id !== undefined && DataItem.country_id !== null ? Number(DataItem.country_id) : "");
      const itemCountryName = (DataItem as any)?.country_name ?? "";
      const itemCountryCode = String((DataItem as any)?.country_code ?? "").toUpperCase();
      setCountryLabel([itemCountryName, itemCountryCode ? `(${itemCountryCode})` : ""].filter(Boolean).join(" "));
      setCountryQuery("");
      setZipcode(String(DataItem.zipcode ?? ""));
      setStreet(String(DataItem.street ?? ""));
      setCity(String(DataItem.city ?? ""));
      setState(String(DataItem.state ?? ""));
      setLatitude(DataItem.latitude !== undefined && DataItem.latitude !== null ? String(DataItem.latitude) : "");
      setLongitude(DataItem.longitude !== undefined && DataItem.longitude !== null ? String(DataItem.longitude) : "");
      setErrors({});
    } else {
      setCountryId("");
      setCountryLabel("");
      setCountryQuery("");
      setZipcode("");
      setStreet("");
      setCity("");
      setState("");
      setLatitude("");
      setLongitude("");
      setErrors({});
    }
  }, [isOpen, isEdit, DataItem]);

  const tOr = (k: string, fallback: string) => t(k) ?? fallback;
  const isNumber = (v: string) => /^-?\d+(\.\d+)?$/.test(v);
  const inRange = (n: number, min: number, max: number) => n >= min && n <= max;

  const q = useDebouncedValue(countryQuery.trim(), 250);
  const countryFilters = useMemo(
    () => ({
      q: q || undefined,
      name: q || undefined,
      search: q || undefined,
      page: 1,
      page_size: 5,
    }),
    [q]
  );

  const { data: countryData, isLoading: countryLoading } = useFilteredCountries(countryFilters);

  const countryArray: any[] = useMemo(() => {
    const d: any = countryData;
    if (!d) return [];
    if (Array.isArray(d)) return d;
    if (Array.isArray(d.items)) return d.items;
    if (Array.isArray(d.data)) return d.data;
    const dd = d.data;
    if (dd) {
      if (Array.isArray(dd.items)) return dd.items;
      if (Array.isArray(dd.data)) return dd.data;
      if (Array.isArray(dd.results)) return dd.results;
    }
    if (Array.isArray(d.results)) return d.results;
    return [];
  }, [countryData]);

  const countryOptions: CountryOption[] = useMemo(
    () =>
      countryArray
        .map((c) => ({
          id: Number(c.id),
          name: c.name ?? c.country_name ?? "",
          code: (c.code ?? c.country_code ?? "").toString(),
        }))
        .filter((c) => Number.isFinite(c.id) && c.name),
    [countryArray]
  );

  const validate = () => {
    const e: typeof errors = {};
    if (countryId === "" || countryId === null || countryId === undefined) e.countryId = tOr("postal.form.countryId.error", "Country is required");
    const z = zipcode.trim();
    if (!z) e.zipcode = tOr("postal.form.zipcode.error", "Zip/Postal code is required");
    else if (!/^[A-Za-z0-9 -]{2,20}$/.test(z)) e.zipcode = tOr("postal.form.zipcode.invalid", "Enter a valid postal code");
    if (!street.trim()) e.street = tOr("postal.form.street.error", "Street is required");
    if (!city.trim()) e.city = tOr("postal.form.city.error", "City is required");
    if (!state.trim()) e.state = tOr("postal.form.state.error", "State/Region is required");
    const latS = latitude.trim();
    const lonS = longitude.trim();
    if (!latS) e.latitude = tOr("postal.form.latitude.error", "Latitude is required");
    else if (!isNumber(latS) || !inRange(Number(latS), -90, 90)) e.latitude = tOr("postal.form.latitude.invalid", "Latitude must be between -90 and 90");
    if (!lonS) e.longitude = tOr("postal.form.longitude.error", "Longitude is required");
    else if (!isNumber(lonS) || !inRange(Number(lonS), -180, 180)) e.longitude = tOr("postal.form.longitude.invalid", "Longitude must be between -180 and 180");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payloadBase = {
      country_id: countryId as number,
      zipcode: zipcode.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      latitude: latitude.trim(),
      longitude: longitude.trim(),
    };

    if (isEdit && DataItem?.id != null) {
      const id: string | number =
        typeof DataItem.id === "string" || typeof DataItem.id === "number"
          ? DataItem.id
          : Number((DataItem as any)?.id?.valueOf?.() ?? (DataItem as any)?.id);

      const current = {
        country_id: Number((DataItem as any).country_id),
        zipcode: String(DataItem.zipcode ?? ""),
        street: String(DataItem.street ?? ""),
        city: String(DataItem.city ?? ""),
        state: String(DataItem.state ?? ""),
        latitude: DataItem.latitude !== undefined && DataItem.latitude !== null ? String(DataItem.latitude) : "",
        longitude: DataItem.longitude !== undefined && DataItem.longitude !== null ? String(DataItem.longitude) : "",
      };

      const updatePayload: UpdateZipcodePayload = { id };
      if ((payloadBase.country_id as number) !== current.country_id) updatePayload.country_id = payloadBase.country_id;
      if (payloadBase.zipcode !== current.zipcode) updatePayload.zipcode = payloadBase.zipcode;
      if (payloadBase.street !== current.street) updatePayload.street = payloadBase.street;
      if (payloadBase.city !== current.city) updatePayload.city = payloadBase.city;
      if (payloadBase.state !== current.state) updatePayload.state = payloadBase.state;
      if (payloadBase.latitude !== String(current.latitude ?? "")) updatePayload.latitude = payloadBase.latitude;
      if (payloadBase.longitude !== String(current.longitude ?? "")) updatePayload.longitude = payloadBase.longitude;

      if (Object.keys(updatePayload).length === 1) {
        setIsOpen(false);
        return;
      }

      updateData.mutate(updatePayload, {
        onSuccess: () => {
          toast.success(tOr("postal.update.success", "Postal code updated successfully"));
          setIsOpen(false);
        },
        onError: (e: any) => {
          const msg = e?.response?.data?.message || e?.message || tOr("postal.update.error", "Cannot update postal code");
          toast.error(msg);
        },
      });
    } else {
      addData.mutate(payloadBase, {
        onSuccess: () => {
          toast.success(tOr("postal.create.success", "Postal code created successfully"));
          setIsOpen(false);
        },
        onError: (e: any) => {
          const msg = e?.response?.data?.errors?.zipcode || e?.response?.data?.message || e?.message || tOr("postal.create.error", "Cannot create postal code");
          toast.error(msg);
        },
      });
    }
  };

  if (!isOpen) return null;

  const modal = (
    <div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) setIsOpen(false);
      }}
    >
      <div className="flex min-h-screen w-screen items-center justify-center p-4">
        <div className="relative mx-auto w-full max-w-[32rem] rounded-xl bg-white text-slate-700 shadow-md">
          <div className="flex flex-col p-6">
            <h4 className="mb-1 text-2xl font-semibold text-slate-700">
              {isEdit ? tOr("postal.update.title", "Edit Postal Code") : tOr("postal.create.title", "Add Postal Code")}
            </h4>
            <p className="mb-3 mt-1 text-slate-400">
              {isEdit ? tOr("postal.update.description", "Update postal code details") : tOr("postal.create.description", "Add a new postal code")}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <CountrySelect
                label={tOr("postal.form.countryId.label", "Country")}
                placeholder={tOr("postal.form.countryId.placeholder", "Search country…")}
                valueId={countryId}
                valueLabel={countryLabel}
                query={countryQuery}
                setQuery={setCountryQuery}
                options={countryOptions}
                loading={countryLoading || submitting}
                error={Boolean(errors.countryId)}
                errorMessage={errors.countryId}
                disabled={submitting}
                onSelect={(opt) => {
                  setCountryId(Number(opt.id));
                  setCountryLabel(`${opt.name}${opt.code ? ` (${String(opt.code).toUpperCase()})` : ""}`);
                  setErrors((prev) => ({ ...prev, countryId: undefined }));
                }}
                onClear={() => {
                  setCountryId("");
                  setCountryLabel("");
                  setCountryQuery("");
                }}
              />

              <InputField
                label={tOr("postal.form.zipcode.label", "Zip/Postal Code")}
                placeholder={tOr("postal.form.zipcode.placeholder", "e.g., 94043 or SW1A 1AA")}
                value={zipcode}
                onChange={(e: any) => {
                  const v = (e.target.value as string).toUpperCase();
                  setZipcode(v.replace(/[^A-Za-z0-9 -]/g, "").slice(0, 20));
                }}
                onBlur={() => setZipcode((z) => z.trim().toUpperCase())}
                name="postal-zipcode"
                error={Boolean(errors.zipcode)}
                errorMessage={errors.zipcode}
                disabled={submitting}
              />

              <InputField
                label={tOr("postal.form.street.label", "Street")}
                placeholder={tOr("postal.form.street.placeholder", "e.g., 1600 Amphitheatre Pkwy")}
                value={street}
                onChange={(e: any) => {
                  const v = e.target.value as string;
                  setStreet(v);
                  setErrors((prev) => ({
                    ...prev,
                    street: v.trim() ? undefined : tOr("postal.form.street.error", "Street is required"),
                  }));
                }}
                name="postal-street"
                error={Boolean(errors.street)}
                errorMessage={errors.street}
                disabled={submitting}
              />

              <InputField
                label={tOr("postal.form.city.label", "City")}
                placeholder={tOr("postal.form.city.placeholder", "e.g., Mountain View")}
                value={city}
                onChange={(e: any) => {
                  const v = e.target.value as string;
                  setCity(v);
                  setErrors((prev) => ({
                    ...prev,
                    city: v.trim() ? undefined : tOr("postal.form.city.error", "City is required"),
                  }));
                }}
                name="postal-city"
                error={Boolean(errors.city)}
                errorMessage={errors.city}
                disabled={submitting}
              />

              <InputField
                label={tOr("postal.form.state.label", "State/Region")}
                placeholder={tOr("postal.form.state.placeholder", "e.g., CA")}
                value={state}
                onChange={(e: any) => {
                  const v = e.target.value as string;
                  setState(v);
                  setErrors((prev) => ({
                    ...prev,
                    state: v.trim() ? undefined : tOr("postal.form.state.error", "State/Region is required"),
                  }));
                }}
                onBlur={() => setState((s) => s.trim())}
                name="postal-state"
                error={Boolean(errors.state)}
                errorMessage={errors.state}
                disabled={submitting}
              />

              <InputField
                label={tOr("postal.form.latitude.label", "Latitude")}
                placeholder={tOr("postal.form.latitude.placeholder", "e.g., 37.422")}
                value={latitude}
                onChange={(e: any) => {
                  const v = (e.target.value as string).replace(/[^0-9.\-]/g, "");
                  setLatitude(v);
                }}
                onBlur={() => setLatitude((v) => v.trim())}
                name="postal-latitude"
                error={Boolean(errors.latitude)}
                errorMessage={errors.latitude}
                disabled={submitting}
              />

              <InputField
                label={tOr("postal.form.longitude.label", "Longitude")}
                placeholder={tOr("postal.form.longitude.placeholder", "e.g., -122.084")}
                value={longitude}
                onChange={(e: any) => {
                  const v = (e.target.value as string).replace(/[^0-9.\-]/g, "");
                  setLongitude(v);
                }}
                onBlur={() => setLongitude((v) => v.trim())}
                name="postal-longitude"
                error={Boolean(errors.longitude)}
                errorMessage={errors.longitude}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="p-6 pt-0">
            <div className="flex space-x-2">
              <button
                className="w-full select-none rounded border border-red-600 px-4 py-2 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white disabled:opacity-50"
                type="button"
                disabled={submitting}
                onClick={() => setIsOpen(false)}
              >
                {tOr("postal.form.button.cancel", "Cancel")}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full select-none rounded bg-slate-800 px-4 py-2 text-center text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50"
                type="button"
              >
                {submitting
                  ? isEdit
                    ? tOr("postal.update.button.updating", "Updating…")
                    : tOr("postal.create.button.creating", "Creating…")
                  : isEdit
                  ? tOr("postal.update.button.update", "Update")
                  : tOr("postal.create.button.create", "Create")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
