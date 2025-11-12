"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";
import { useAddCategories, useGenerateCategorySlug, useUpdateCategory } from "@/lib/react-query/queries/categories/categories";
import { JobCategories } from "@/lib/types/job-categories";
import { Localization } from "@/lib/types/localization-type";
import { useT } from "@/app/[locale]/layout";

type Props = {
  localization: Localization[]
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  category?: JobCategories | null;
};

export default function CategoryUpsertModal({ isOpen, setIsOpen, category, localization }: Props) {
  const t = useT("categories");
  const isEdit = Boolean(category?.id);

  const [name, setName] = useState<Record<string, string>>({});
  const [slug, setSlug] = useState<string>("");
  const [errors, setErrors] = useState<{ name?: Record<string, string>; slug?: string }>({});
  const [slugEdited, setSlugEdited] = useState(false);

  const genSlug = useGenerateCategorySlug();
  const addCategory = useAddCategories();
  const updateCategory = useUpdateCategory();

  const submitting = addCategory.isPending || updateCategory.isPending;


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

    if (isEdit && category) {
      setName(category.name ?? {});
      setSlug(String(category.slug ?? ""));
      setSlugEdited(true);
      setErrors({});
    } else {
      setName({});
      setSlug("");
      setSlugEdited(false);
      setErrors({});
    }
  }, [isOpen, isEdit, category]);

  const validate = () => {
    const e: typeof errors = {};
    localization.forEach(l => {
      if (!name[l.code]) {
        e.name = e.name || {}
        e.name[l.code] = t("create.form.name.error", { code: t(l.code) });
      }
    })
    if (!slug.trim()) e.slug = t("create.form.slug.error");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChangeName = (v: string, code: string) => {
    setName({
      ...name,
      [code]: v
    });
    setErrors((prev) => ({ ...prev, name: { ...prev.name, [code]: v.trim() ? undefined : t("create.form.name.error", { code: t(code) }) } }));

    if (!slugEdited && code == 'en') {
      const trimmed = v.trim();
      if (!trimmed) {
        setSlug("");
        return;
      }
      genSlug.mutate(trimmed, {
        onSuccess: (res) => setSlug(res.slug),
      });
    }
  };

  const onChangeSlug = (v: string) => {
    setSlugEdited(true);
    setSlug(v);
    setErrors((prev) => ({ ...prev, slug: v.trim() ? undefined : t("create.form.slug.error") }));
  };

  const onRegenerate = () => {
    const trimmed = name.en.trim();
    if (!trimmed) {
      setErrors((e) => ({ ...e, name: { en: t("create.form.name.error", { code: t('en') })} }));
      return;
    }
    setSlugEdited(false);
    genSlug.mutate(trimmed, {
      onSuccess: (res) => setSlug(res.slug),
    });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (isEdit && category?.id != null) {
      const id: string | number =
        typeof category.id === "string" || typeof category.id === "number"
          ? category.id
          : Number((category as any)?.id?.valueOf?.() ?? (category as any)?.id);

      updateCategory.mutate(
        { id, name: name, slug: slug.trim() },
        {
          onSuccess: () => {
            toast.success(t("update.success"));
            setIsOpen(false);
          },
          onError: (e: any) => {
            const status = e?.response?.status;
            const msg = e?.response?.data?.message || e?.message || t("update.error");

            if (status === 409) {
              const base = slug.replace(/-\d+$/, "");
              const suggestion = `${base}-2`;
              setSlug(suggestion);
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
      addCategory.mutate(
        { name, slug: slug.trim() },
        {
          onSuccess: () => {
            toast.success(t("create.success") ?? "Category created");
            setIsOpen(false);
          },
          onError: (e: any) => {
            const status = e?.response?.status;
            const msg = e?.response?.data?.message || e?.message || t("create.error");

            if (status === 409) {
              const base = slug.replace(/-\d+$/, "");
              const suggestion = `${base}-2`;
              setSlug(suggestion);
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
              {isEdit ? (t("update.title") ?? "Edit category") : t("create.title")}
            </h4>
            <p className="mb-3 mt-1 text-slate-400">
              {isEdit ? (t("update.description") ?? "Update the category details.") : t("create.description")}
            </p>

            {
              localization.map(l => {
                return (
                  <InputField
                    key={l.id}
                    label={`${t("create.form.name.label", { code: t(l.code) })}`}
                    placeholder={t("create.form.name.placeholder", { code: t(l.code) })}
                    value={name[l.code] ?? ''}
                    onChange={(e: any) => onChangeName(e.target.value, l.code)}
                    error={Boolean(errors.name ? errors.name[l.code] : false)}
                    errorMessage={errors.name ? errors.name[l.code] : ``}
                    name="category-name"
                    disabled={submitting}
                  />
                )
              })
            }

            <div className="mt-3">
              <InputField
                label={t("create.form.slug.label")}
                placeholder={t("create.form.slug.placeholder")}
                value={slug}
                onChange={(e: any) => onChangeSlug(e.target.value)}
                error={Boolean(errors.slug)}
                errorMessage={errors.slug}
                name="category-slug"
                disabled={submitting}
                rightElement={
                  <button
                    type="button"
                    onClick={onRegenerate}
                    className="text-xs text-slate-500 underline hover:text-slate-700 px-2 py-1 disabled:opacity-60"
                    disabled={genSlug.isPending || !name || submitting}
                  >
                    {genSlug.isPending
                      ? (t("common.generating") ?? "Generating…")
                      : (t("create.form.slug.regenerate") ?? "Regenerate")}
                  </button>
                }
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
                {t("create.form.button.cancel")}
              </button>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full select-none rounded bg-slate-800 px-4 py-2 text-center text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-50"
                type="button"
              >
                {submitting
                  ? (isEdit
                    ? (t("update.form.button.updating") ?? "Updating…")
                    : (t("create.form.button.creating") ?? "Creating…"))
                  : (isEdit
                    ? (t("update.form.button.update") ?? "Update")
                    : (t("create.form.button.create") ?? "Create"))}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
