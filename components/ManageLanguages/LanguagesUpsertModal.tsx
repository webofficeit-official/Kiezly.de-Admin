"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";
import { Languages } from "@/lib/types/languages";
import { useAddLanguages, useUpdateLanguages } from "@/lib/react-query/queries/languages/languages";

type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  t: (k: string) => string;
  DataItem?: Languages | null; // edit mode if present
};

export default function LanguagesUpsertModal({
  isOpen,
  setIsOpen,
  t,
  DataItem,
}: Props) {
  const isEdit = Boolean(DataItem?.id);

  const [name, setName] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: string }>({});

  const addData = useAddLanguages();
  const updateData = useUpdateLanguages();

  const submitting = addData.isPending || updateData.isPending;

  // Lock body scroll when open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // ⎋ Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, submitting, setIsOpen]);

  // Prefill on open (edit) or reset (create)
  useEffect(() => {
    if (!isOpen) return;
    if (isEdit && DataItem) {
      setName(String(DataItem.name ?? ""));
      setErrors({});
    } else {
      setName("");
      setErrors({});
    }
  }, [isOpen, isEdit, DataItem]);

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t("create.form.name.error");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && DataItem?.id != null) {
      const id: string | number =
        typeof DataItem.id === "string" || typeof DataItem.id === "number"
          ? DataItem.id
          : Number(
              (DataItem as any)?.id?.valueOf?.() ?? (DataItem as any)?.id
            );

      updateData.mutate(
        { id, name: name.trim() }, // ✅ only name
        {
          onSuccess: () => {
            toast.success(t("update.success"));
            setIsOpen(false);
          },
          onError: (e: any) => {
            const msg =
              e?.response?.data?.message || e?.message || t("update.error");
            toast.error(msg);
          },
        }
      );
    } else {
      addData.mutate(
        { name: name.trim() }, // ✅ only name
        {
          onSuccess: () => {
            toast.success(t("create.success"));
            setIsOpen(false);
          },
          onError: (e: any) => {
            const msg =
              e?.response?.data?.message || e?.message || t("create.error");
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
        <div className="relative mx-auto w-full max-w-[24rem] rounded-xl bg-white text-slate-700 shadow-md">
          <div className="flex flex-col p-6">
            <h4 className="mb-1 text-2xl font-semibold text-slate-700">
              {isEdit ? t("update.title") : t("create.title")}
            </h4>
            <p className="mb-3 mt-1 text-slate-400">
              {isEdit ? t("update.description") : t("create.description")}
            </p>

            <InputField
              label={t("create.form.name.label")}
              placeholder={t("create.form.name.placeholder")}
              value={name}
              onChange={(e: any) => {
                const v = e.target.value as string;
                setName(v);
                setErrors((prev) => ({
                  ...prev,
                  name: v.trim() ? undefined : t("create.form.name.error"),
                }));
              }}
              error={Boolean(errors.name)}
              errorMessage={errors.name}
              name="language-name"
              disabled={submitting}
            />
          </div>

          <div className="p-6 pt-0">
            <div className="flex space-x-2">
              <button
                className="w-full select-none rounded border border-red-600 px-4 py-2 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white disabled:opacity-50"
                type="button"
                disabled={submitting}
                onClick={() => setIsOpen(false)}
              >
                {t("create.form.button.cancel")}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full select-none rounded bg-slate-800 px-4 py-2 text-center text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50"
                type="button"
              >
                {submitting
                  ? isEdit
                    ? t("update.form.button.updating") ?? "Updating…"
                    : t("create.form.button.creating") ?? "Creating…"
                  : isEdit
                    ? t("update.form.button.update") ?? "Update"
                    : t("create.form.button.create") ?? "Create"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
