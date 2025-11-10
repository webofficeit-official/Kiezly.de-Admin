"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "@/lib/custom-hook/useModal";
import ProfileEditModal from "./profile-edit-modal";
import { useT } from "@/app/[locale]/layout";
import { useAuth } from "@/lib/context/auth-context";
import { updateProfile, uploadProfilePic } from "@/lib/react-query/queries/user/profile";
import { Loader } from "../ui/loader";
import { useLocalizedRouter } from "@/lib/useLocalizedRouter";
import { Pencil } from "lucide-react";

type OnSaveArgs = {
  values: {
    first_name: string;
    last_name: string;
    email: string; // optional on server
    phone: string;
    bio: string;
  };
  avatarFile: File | null;
};

function getInitialsAvatar(name?: string, size = 96) {
  const initials =
    (name || "")
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join("") || "?";

  const bgColors = ["#FDE68A", "#C7F9CC", "#FBCFE8", "#BFDBFE", "#FEE2E2", "#E9D5FF"];
  const bg = bgColors[(initials.charCodeAt(0) || 0) % bgColors.length];
  const fg = "#111827";

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
    <rect width='100%' height='100%' rx='999' fill='${bg}'/>
    <text x='50%' y='50%' dy='0.36em' text-anchor='middle' font-family='Inter, Roboto, system-ui, sans-serif' font-size='${Math.round(
      size / 2.6
    )}' fill='${fg}' font-weight='600'>${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function Field({
  label,
  value,
  onCopy,
}: {
  label: string;
  value: string | React.ReactNode;
  onCopy?: () => void;
}) {
  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-3.5 transition hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900">
      <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <div className="flex items-center justify-between gap-3">
        <p className="truncate text-sm font-medium text-gray-900 dark:text-white/90">{value || "—"}</p>
        {onCopy && (
          <button
            onClick={onCopy}
            className="invisible whitespace-nowrap rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100 dark:border-gray-700 dark:text-white/90"
            aria-label="Copy"
            title="Copy"
            type="button"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden>
              <path d="M16 1H4a2 2 0 0 0-2 2v12h2V3h12V1Zm3 4H8a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Zm0 17H8V7h11v15Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const t = useT("profile");

  const auth = useAuth();
  const { user, loading, loadUser } = (auth as any) ?? { user: null, loading: true };
  const { push } = useLocalizedRouter();

  const [initial, setInitial] = useState<{
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    bio: string;
    avatarUrl?: string | null;
    role?: string | null;
    is_super_admin?: boolean;
  } | null>(null);

  
  const lastUploadedSigRef = useRef<string | null>(null);
  const fileSig = (f: File) => `${f.name}:${f.size}:${f.lastModified}`;

  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      setInitial({
        first_name: (user as any).first_name ?? (user as any).firstName ?? "",
        last_name: (user as any).last_name ?? (user as any).lastName ?? "",
        email: (user as any).email ?? "",
        phone: (user as any).phone ?? "",
        bio: (user as any).bio ?? (user as any).about ?? "",
        avatarUrl: (user as any).avatar_url ?? (user as any).photoUrl ?? null,
        role: (user as any).role ?? null,
        is_super_admin: (user as any).is_super_admin ?? false,
      });
    }
    if (!loading && !user) setInitial(null);
  }, [loading, user]);

  const uploadPic = uploadProfilePic();
  const updProfile = updateProfile();

  // Save handler for ProfileEditModal (multipart with optional avatar)
  const onSave = async ({ values, avatarFile }: OnSaveArgs) => {
    if (saving) return;
    setSaving(true);
    try {
      let avatar_url: string | undefined;

      if (avatarFile) {
        const sig = fileSig(avatarFile);
        const isNewFile = sig !== lastUploadedSigRef.current;
        if (isNewFile) {
          const uploadRes = await uploadPic.mutateAsync({ file: avatarFile });
          avatar_url = uploadRes?.data?.filePath;
          lastUploadedSigRef.current = sig;
        }
      }

      const payload: any = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone ?? "",
        bio: values.bio ?? "",
        ...(avatar_url ? { avatar_url } : {}),
      };

      const res: any = await updProfile.mutateAsync(payload);
      const updated = res?.user ?? res ?? {};

      // optimistic UI update
      setInitial((prev: any) => ({
        ...(prev ?? {}),
        first_name: updated?.first_name ?? values.first_name,
        last_name: updated?.last_name ?? values.last_name,
        email: updated?.email ?? values.email,
        phone: updated?.phone ?? values.phone,
        bio: updated?.bio ?? values.bio,
        avatarUrl:
          updated?.avatar_url ??
          updated?.avatarUrl ??
          avatar_url ??
          prev?.avatarUrl ??
          null,
        role: updated?.role ?? prev?.role ?? null,
        is_super_admin: updated?.is_super_admin ?? prev?.is_super_admin ?? false,
      }));

      toast.success(t("profile.save.success"));
      loadUser?.();
      push(`/my-profile`);
      closeModal();
    } catch (err: any) {
      toast.error(err?.message || t("profile.save.error"), { id: "profile-error" });
    } finally {
      setSaving(false);
    }
  };

  const fullName = useMemo(() => {
    const f = initial?.first_name?.trim?.();
    const l = initial?.last_name?.trim?.();
    return [f, l].filter(Boolean).join(" ") || "—";
  }, [initial]);

  const avatarSrc = initial?.avatarUrl
    ? initial.avatarUrl
    : getInitialsAvatar(`${initial?.first_name ?? ""} ${initial?.last_name ?? ""}`, 80);

  const copy = async (text?: string | null) => {
    if (!text) return;
    try { await navigator.clipboard.writeText(text); } catch {}
  };

  if (loading) {
    return (
      <div className="p-5 border rounded-2xl">
        <Loader />
      </div>
    );
  }

  return (
    <>
    <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white/80 shadow-sm backdrop-blur dark:border-gray-800 dark:bg-gray-900/60 lg:p-0">
   
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gray-300 via-gray-100 to-white dark:from-gray-700 dark:via-gray-800 dark:to-gray-900" />

      {/* Header */}
      <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center xl:justify-between lg:p-6">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 dark:border-gray-800">
            {/* use plain img so data-URL works reliably */}
            <img
              src={avatarSrc}
              alt={fullName}
              width={80}
              height={80}
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h4 className="mb-1 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {fullName}
            </h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center xl:text-left">
              {initial?.is_super_admin
                ? "Super Admin"
                : (initial?.role ? initial.role.charAt(0).toUpperCase() + initial.role.slice(1) : "")}
            </p>
          </div>
        </div>

        <button
          onClick={openModal}
         className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.05]"
          disabled={saving}
          type="button"
        >
        <Pencil className="h-4 w-4" strokeWidth={2} />
          <span>{t("metaCard.edit") ?? "Edit"}</span>
        </button>
      </div>

      {/* Divider */}
      <div className="mx-5 border-t border-dashed border-gray-200 dark:border-gray-800" />

      {/* Details grid */}
      <div className="p-5 lg:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-6 2xl:gap-x-24">
          <Field label={t("infoCard.labels.firstName")} value={initial?.first_name || "—"} />
          <Field label={t("infoCard.labels.lastName")} value={initial?.last_name || "—"} />
          <Field label={t("infoCard.labels.email")} value={initial?.email || "—"} onCopy={() => copy(initial?.email)} />
          <Field label={t("infoCard.labels.phone")} value={initial?.phone || "—"} onCopy={() => copy(initial?.phone)} />
        </div>

        {/* Bio */}
        <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-gray-800/60 dark:bg-gray-900/60">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("infoCard.labels.bio")}
          </p>
          <p className="text-sm leading-relaxed text-gray-800 dark:text-white/90">
            {initial?.bio?.trim?.() || <span className="opacity-70">{t("placeholders.noBio") ?? "No bio added yet."}</span>}
          </p>
        </div>
      </div>

      {/* Modal: match Props (no onClose prop) */}
     
    </div>
     {isOpen && initial && (
        <ProfileEditModal
          isOpen={isOpen}
          setIsOpen={closeModal}
          initialValues={initial}
          onSave={onSave}
          t={t}
        />
      )}
    </>
  );
}
