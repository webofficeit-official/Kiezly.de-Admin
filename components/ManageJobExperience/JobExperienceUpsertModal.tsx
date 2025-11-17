"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";
import { useT } from "@/app/[locale]/layout";
import { Localization } from "@/lib/types/localization-type";
import {
  useAddJobExperience,
  useUpdateJobExperience,
} from "@/lib/react-query/queries/job-experience/job-experience";
import { JobExperienceData } from "@/lib/types/job-experience-type";

type Props = {
  localization: Localization[];
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  DataItem?: JobExperienceData | null; // edit mode if present
};

export default function JobExperienceUpsertModal({
  isOpen,
  setIsOpen,
  localization = [],
  DataItem,
}: Props) {
  const t = useT("job-experience");
  const isEdit = Boolean(DataItem?.id);

  const [name, setName] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<{ name?: Record<string, string> }>({});

  const addData = useAddJobExperience();
  const updateData = useUpdateJobExperience();

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
      setName(DataItem.name ?? {});
      setErrors({});
    } else {
      setName({});
      setErrors({});
    }
  }, [isOpen, isEdit, DataItem]);

  const onChangeName = (v: string, code: string) => {
    setName({
      ...name,
      [code]: v,
    });
    setErrors((prev) => ({
      ...prev,
      name: {
        ...prev.name,
        [code]: v.trim()
          ? undefined
          : t("create.form.name.error", { code: t(code) }),
      },
    }));
  };

  const validate = () => {
    const e: typeof errors = {};
    localization.forEach((l) => {
      if (!name[l.code]) {
        e.name = e.name || {};
        e.name[l.code] = t("create.form.name.error", { code: t(l.code) });
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && DataItem?.id != null) {
      const id: string | number =
        typeof DataItem.id === "string" || typeof DataItem.id === "number"
          ? DataItem.id
          : Number((DataItem as any)?.id?.valueOf?.() ?? (DataItem as any)?.id);
      updateData.mutate(
        { id, name: name },
        {
          onSuccess: () => {
            toast.success(t("update.success"));
            setIsOpen(false);
          },
          onError: (e: any) => {
            const status = e?.response?.status;
            const msg =
              e?.response?.data?.message || e?.message || t("update.error");

            if (status === 409) {
              setErrors((prev) => ({
                ...prev,
                slug: t("create.slug_conflict") ?? "Slug already exists",
              }));
              return;
            }
            toast.error(msg);
          },
        }
      );
    } else {
      addData.mutate(
        { name }, // ✅ only name
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

            {localization.map((l) => {
              return (
                <InputField
                  key={l.id}
                  label={`${t("create.form.name.label", { code: t(l.code) })}`}
                  placeholder={t("create.form.name.placeholder", {
                    code: t(l.code),
                  })}
                  value={name[l.code] ?? ""}
                  onChange={(e: any) => onChangeName(e.target.value, l.code)}
                  error={Boolean(errors.name ? errors.name[l.code] : false)}
                  errorMessage={errors.name ? errors.name[l.code] : ``}
                  name="job-experience-name"
                  disabled={submitting}
                />
              );
            })}
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
