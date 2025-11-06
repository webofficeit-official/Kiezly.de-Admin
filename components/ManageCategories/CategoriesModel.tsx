"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { InputField } from "../ui/InputField/InputField";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/config/axios-client";
import { useGenerateCategorySlug } from "@/lib/react-query/queries/categories/categories";

type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  t: (k: string) => string;
};

// very small add-category mutation (you can swap for your existing useAddCategories)
function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { name: string; slug: string }) => {
      const res = await apiClient.post("/categories", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });
}

export default function CategoryModalSimple({ isOpen, setIsOpen, t }: Props) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [errors, setErrors] = useState<{ name?: string; slug?: string }>({});
  const [slugEdited, setSlugEdited] = useState(false);

  const genSlug = useGenerateCategorySlug();
  const addCategory = useAddCategory();

  const submitting = addCategory.isPending;

  const validate = () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t("create.form.name.error");
    if (!slug.trim()) e.slug = t("create.form.slug.error");
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChangeName = (v: string) => {
    setName(v);
    setErrors((prev) => ({ ...prev, name: v.trim() ? undefined : t("create.form.name.error") }));

    if (!slugEdited) {
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
    const trimmed = name.trim();
    if (!trimmed) {
      setErrors((e) => ({ ...e, name: t("create.form.name.error") }));
      return;
    }
    setSlugEdited(false);
    genSlug.mutate(trimmed, {
      onSuccess: (res) => setSlug(res.slug),
    });
  };

  const handleSubmit = () => {
    if (!validate()) return;

    addCategory.mutate(
      { name: name.trim(), slug: slug.trim() },
      {
        onSuccess: () => {
          toast.success(t("create.success") ?? "Category created");
          setName("");
          setSlug("");
          setSlugEdited(false);
          setErrors({});
          setIsOpen(false);
        },
        onError: (e: any) => {
          const status = e?.response?.status;
          const msg =
            e?.response?.data?.message ||
            e?.message ||
            t("create.error") ||
            "Failed to create category";

          if (status === 409) {
            // basic suggestion: add “-2”
            const base = slug.replace(/-\d+$/, "");
            const suggestion = `${base}-2`;
            setSlug(suggestion);
            setErrors((prev) => ({ ...prev, slug: t("create.slug_conflict") ?? "Slug already exists" }));
            return;
          }

          toast.error(msg);
        },
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="absolute inset-0 z-[999] grid h-screen w-screen place-items-center bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submitting) setIsOpen(false);
      }}
    >
      <div className="relative mx-auto flex w-full max-w-[24rem] flex-col rounded-xl bg-white text-slate-700 shadow-md">
        <div className="flex flex-col p-6">
          <h4 className="mb-1 text-2xl font-semibold text-slate-700">
            {t("create.title")}
          </h4>
          <p className="mb-3 mt-1 text-slate-400">{t("create.description")}</p>

          <InputField
            label={t("create.form.name.label")}
            placeholder={t("create.form.name.placeholder")}
            value={name}
            onChange={(e: any) => onChangeName(e.target.value)}
            error={Boolean(errors.name)}
            errorMessage={errors.name}
            name="category-name"
          />

          <div className="mt-3">
            <InputField
              label={t("create.form.slug.label")}
              placeholder={t("create.form.slug.placeholder")}
              value={slug}
              onChange={(e: any) => onChangeSlug(e.target.value)}
              error={Boolean(errors.slug)}
              errorMessage={errors.slug}
              name="category-slug"
              rightElement={
                <button
                  type="button"
                  onClick={onRegenerate}
                  className="text-xs text-slate-500 underline hover:text-slate-700 px-2 py-1 disabled:opacity-60"
                  disabled={genSlug.isPending || !name.trim()}
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
                ? (t("create.form.button.creating") ?? "Creating…")
                : (t("create.form.button.create") ?? "Create")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
