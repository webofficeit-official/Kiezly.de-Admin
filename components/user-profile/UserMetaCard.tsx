"use client";

import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "../../lib/custom-hook/useModal";
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

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const t = useT("profile");

  // auth hook (assumes it provides user, loading and loadUser())
  const auth = useAuth();
  const { user, loading, loadUser } = auth ?? { user: null, loading: true };
  const { push } = useLocalizedRouter();

  // local "initial" state for the modal
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

  // track last uploaded file signature to avoid re-upload
  const lastUploadedSigRef = useRef<string | null>(null);
  const fileSig = (f: File) => `${f.name}:${f.size}:${f.lastModified}`;

  // prevent double submit
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

  const uploadPic = uploadProfilePic(); // exposes mutate/mutateAsync
  const updProfile = updateProfile();   // exposes mutate/mutateAsync

  // Save handler for ProfileEditModal (multipart with optional avatar)
  const onSave = async ({ values, avatarFile }: OnSaveArgs) => {
    if (saving) return;
    setSaving(true);
    try {
      let avatar_url: string | undefined;

      // Only upload if a new file was chosen AND it's different from the last uploaded file
      if (avatarFile) {
        const sig = fileSig(avatarFile);
        const isNewFile = sig !== lastUploadedSigRef.current;

        if (isNewFile) {
          const uploadRes = await uploadPic.mutateAsync({ file: avatarFile });
          avatar_url = uploadRes?.data?.filePath;
          lastUploadedSigRef.current = sig; 
        }
      }

      // Build payload (only include avatar_url if we actually uploaded a new one)
      const payload: any = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone ?? "",
        bio: values.bio ?? "",
        ...(avatar_url ? { avatar_url } : {}),
      };

      const res: any = await updProfile.mutateAsync(payload);

      // Some APIs return { user, message }, others return the user directly
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
          avatar_url ?? // fall back to the one we just uploaded (if any)
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

  const avatarSrc = initial?.avatarUrl
    ? initial.avatarUrl
    : getInitialsAvatar(`${initial?.first_name ?? ""} ${initial?.last_name ?? ""}`, 80);

  return (
    <>
      {loading ? (
        <div className="p-5 border rounded-2xl">
          <Loader />
        </div>
      ) : (
        <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
              <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                {/* use plain img so data-URL works reliably */}
                <img
                  src={avatarSrc}
                  alt={`${initial?.first_name ?? ""} ${initial?.last_name ?? ""}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="order-3 xl:order-2">
                <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                  {initial ? `${initial.first_name} ${initial.last_name}` : ""}
                </h4>
                <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {initial?.is_super_admin
                      ? "Super Admin"
                      : initial?.role
                      ? initial.role.charAt(0).toUpperCase() + initial.role.slice(1)
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <button
               onClick={openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
              disabled={saving}
            >
               <Pencil className="h-4 w-4" strokeWidth={2} />
          <span>{t("metaCard.edit") ?? "Edit"}</span>
            </button>
          </div>
        </div>
      )}
      {/* render modal only when we have initial values */}
      {initial && (
        <ProfileEditModal
          isOpen={isOpen}
          setIsOpen={closeModal}
          initialValues={initial}
          onSave={onSave}
          t={t}
          // no changes needed inside the modal for this approach
        />
      )}
    </>
  );
}
