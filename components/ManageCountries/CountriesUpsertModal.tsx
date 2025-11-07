"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";
import { Country, UpdateCountryPayload } from "@/lib/types/country-type";
import { useAddCountries, useUpdateCountry } from "@/lib/react-query/queries/countries/countries";

type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  t: (k: string) => string;
  DataItem?: Country | null;
};

export default function CountriesUpsertModal({
  isOpen,
  setIsOpen,
  t,
  DataItem,
}: Props) {
  const isEdit = Boolean(DataItem?.id);

  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [currency, setCurrency] = useState<string>("");

  const [errors, setErrors] = useState<{ name?: string; code?: string; currency?: string }>({});

  const addData = useAddCountries();
  const updateData = useUpdateCountry();
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
      setName(String(DataItem.name ?? ""));
      setCode(String(DataItem.code ?? "").toUpperCase());
      setCurrency(String(DataItem.currency ?? "").toUpperCase());
      setErrors({});
    } else {
      setName("");
      setCode("");
      setCurrency("");
      setErrors({});
    }
  }, [isOpen, isEdit, DataItem]);

  const tOr = (k: string, fallback: string) => t(k) ?? fallback;

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = tOr("create.form.name.error", "Name is required");

    const codeTrim = code.trim().toUpperCase();
    if (!codeTrim) e.code = tOr("create.form.code.error", "Code is required");
    else if (!/^[A-Z]{2}$/.test(codeTrim)) e.code = tOr("create.form.code.invalid", "Code must be 2 letters (ISO alpha-2)");

    const currTrim = currency.trim().toUpperCase();
    if (!currTrim) e.currency = tOr("create.form.currency.error", "Currency is required");
    else if (!/^[A-Z]{3}$/.test(currTrim)) e.currency = tOr("create.form.currency.invalid", "Currency must be 3 letters (ISO 4217)");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const nameTrim = name.trim();
    const codeUp = code.trim().toUpperCase();
    const currencyUp = currency.trim().toUpperCase();

    if (isEdit && DataItem?.id != null) {
      const id: string | number =
        typeof DataItem.id === "string" || typeof DataItem.id === "number"
          ? DataItem.id
          : Number((DataItem as any)?.id?.valueOf?.() ?? (DataItem as any)?.id);

      const updatePayload: UpdateCountryPayload = { id };

      const currentName = String(DataItem.name ?? "");
      const currentCode = String(DataItem.code ?? "").toUpperCase();
      const currentCurrency = String(DataItem.currency ?? "").toUpperCase();

      if (nameTrim !== currentName) updatePayload.name = nameTrim;
      if (codeUp !== currentCode) updatePayload.code = codeUp;
      if (currencyUp !== currentCurrency) updatePayload.currency = currencyUp;

      if (Object.keys(updatePayload).length === 1) {
        setIsOpen(false);
        return;
      }

      updateData.mutate(updatePayload, {
        onSuccess: () => {
          toast.success(tOr("update.success", "Country updated successfully"));
          setIsOpen(false);
        },
        onError: (e: any) => {
          const msg = e?.response?.data?.message || e?.message || tOr("update.error", "Cannot update country");
          toast.error(msg);
        },
      });
    } else {
      addData.mutate(
        { name: nameTrim, code: codeUp, currency: currencyUp },
        {
          onSuccess: () => {
            toast.success(tOr("create.success", "Country created successfully"));
            setIsOpen(false);
          },
          onError: (e: any) => {
            const msg = e?.response?.data?.errors?.name||e?.response?.data?.errors?.code || e?.message || tOr("create.error", "Cannot create country");
            toast.error(msg);
          },
        }
      );
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
        <div className="relative mx-auto w-full max-w-[28rem] rounded-xl bg-white text-slate-700 shadow-md">
          <div className="flex flex-col p-6">
            <h4 className="mb-1 text-2xl font-semibold text-slate-700">
              {isEdit ? tOr("update.title", "Edit Country") : tOr("create.title", "Add Country")}
            </h4>
            <p className="mb-3 mt-1 text-slate-400">
              {isEdit ? tOr("update.description", "Update country details") : tOr("create.description", "Add a new country")}
            </p>

            <InputField
              label={tOr("create.form.name.label", "Country Name")}
              placeholder={tOr("create.form.name.placeholder", "Enter country name")}
              value={name}
              onChange={(e: any) => {
                const v = e.target.value as string;
                setName(v);
                setErrors((prev) => ({
                  ...prev,
                  name: v.trim() ? undefined : tOr("create.form.name.error", "Name is required"),
                }));
              }}
              error={Boolean(errors.name)}
              errorMessage={errors.name}
              name="country-name"
              disabled={submitting}
            />

            <div className="mt-3">
              <InputField
                label={tOr("create.form.code.label", "Country Code (ISO alpha-2)")}
                placeholder={tOr("create.form.code.placeholder", "e.g., US")}
                value={code}
                onChange={(e: any) => {
                  const v = (e.target.value as string).toUpperCase();
                  setCode(v.replace(/[^A-Za-z]/g, "").slice(0, 2));
                }}
                onBlur={() => setCode((c) => c.trim().toUpperCase())}
                error={Boolean(errors.code)}
                errorMessage={errors.code}
                name="country-code"
                disabled={submitting}
              />
            </div>

            <div className="mt-3">
              <InputField
                label={tOr("create.form.currency.label", "Currency (ISO 4217)")}
                placeholder={tOr("create.form.currency.placeholder", "e.g., USD")}
                value={currency}
                onChange={(e: any) => {
                  const v = (e.target.value as string).toUpperCase();
                  setCurrency(v.replace(/[^A-Za-z]/g, "").slice(0, 3));
                }}
                onBlur={() => setCurrency((c) => c.trim().toUpperCase())}
                error={Boolean(errors.currency)}
                errorMessage={errors.currency}
                name="country-currency"
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
                {tOr("create.form.button.cancel", "Cancel")}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full select-none rounded bg-slate-800 px-4 py-2 text-center text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50"
                type="button"
              >
                {submitting
                  ? isEdit
                    ? tOr("update.form.button.updating", "Updating…")
                    : tOr("create.form.button.creating", "Creating…")
                  : isEdit
                  ? tOr("update.form.button.update", "Update")
                  : tOr("create.form.button.create", "Create")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
