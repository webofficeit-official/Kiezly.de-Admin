"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";
import { useAddLocalization } from "@/lib/react-query/queries/localization/localization";

type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  t: (k: string) => string;
};

export default function LocalizationCreateModal({
  isOpen,
  setIsOpen,
  t,
}: Props) {
  // Only create functionality — no editing
  const [name, setName] = useState<string>("");
  const [code, setCode] = useState<string>("");

  const [errors, setErrors] = useState<{ name?: string; code?: string }>({});
  const addData = useAddLocalization();
  const submitting = addData.isPending;

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
    // reset form when modal opens
    setName("");
    setCode("");
    setErrors({});
  }, [isOpen]);

  const tOr = (k: string, fallback: string) => {
    try {
      const res = t(k);
      return res ?? fallback;
    } catch {
      return fallback;
    }
  };

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim())
      e.name = tOr("create.form.name.error", "Name is required");

    const codeTrim = (code || "").trim().toLowerCase();
    if (!codeTrim) e.code = tOr("create.form.code.error", "Code is required");

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const nameTrim = name.trim();
    const codeNorm = code.trim().toLowerCase();

    addData.mutate(
      { name: nameTrim, code: codeNorm },
      {
        onSuccess: () => {
          toast.success(
            tOr("create.success", "Localization created successfully")
          );
          setIsOpen(false);
        },
        onError: (e: any) => {
          const apiErrors = e?.response?.data?.errors;
          if (apiErrors) {
            // map server validation into form errors
            setErrors({
              name: apiErrors.name,
              code: apiErrors.code,
            });
            toast.error(
              apiErrors.name ||
                apiErrors.code ||
                tOr("create.error", "Validation error")
            );
            return;
          }
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            tOr("create.error", "Cannot create localization");
          toast.error(msg);
        },
      }
    );
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
              {tOr("create.title", "Add Localization")}
            </h4>
            <p className="mb-3 mt-1 text-slate-400">
              {tOr("create.description", "Add a new localization entry")}
            </p>

            <InputField
              label={tOr("create.form.name.label", "Name")}
              placeholder={tOr(
                "create.form.name.placeholder",
                "Enter language name (e.g. English)"
              )}
              value={name}
              onChange={(e: any) => {
                const v = e.target.value as string;
                setName(v);
                setErrors((prev) => ({
                  ...prev,
                  name: v.trim()
                    ? undefined
                    : tOr("create.form.name.error", "Name is required"),
                }));
              }}
              error={Boolean(errors.name)}
              errorMessage={errors.name}
              name="localization-name"
              disabled={submitting}
            />

            <div className="mt-3">
              <InputField
                label={tOr("create.form.code.label", "Code")}
                placeholder={tOr(
                  "create.form.code.placeholder",
                  "e.g., en, ml"
                )}
                value={code}
                onChange={(e: any) => {
                  const v = (e.target.value as string).toLowerCase();
                  setCode(v);
                }}
                onBlur={() => setCode((c) => c.trim().toLowerCase())}
                error={Boolean(errors.code)}
                errorMessage={errors.code}
                name="code"
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
                  ? tOr("create.form.button.creating", "Creating…")
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
