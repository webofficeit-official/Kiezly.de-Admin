"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useModal } from "../../lib/custom-hook/useModal";
import ProfileEditModal from "./profile-edit-modal";
import { useT } from "@/app/[locale]/layout";
import { useAuth } from "@/lib/context/auth-context";
import {
  updateProfile,
  uploadProfilePic,
} from "@/lib/react-query/queries/user/profile";
import { useMutation } from "@tanstack/react-query";
import { Loader } from "../ui/loader";
import { useLocalizedRouter } from "@/lib/useLocalizedRouter";

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

  const bgColors = [
    "#FDE68A",
    "#C7F9CC",
    "#FBCFE8",
    "#BFDBFE",
    "#FEE2E2",
    "#E9D5FF",
  ];
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
  const { user, loading,loadUser } = auth ?? { user: null, loading: true };
   const { push } = useLocalizedRouter();

  // initial in the shape expected by ProfileEditModal
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

    // if not loading and no user, clear
    if (!loading && !user) {
      setInitial(null);
    }
  }, [loading, user]);
  const uploadPic = uploadProfilePic(); 
  const updProfile = updateProfile(); 

  // Save handler for ProfileEditModal (multipart with optional avatar)
  const onSave = async ({ values, avatarFile }: OnSaveArgs) => {
    try {
      let avatar_url: string | undefined;

      if (avatarFile) {
        const uploadRes = await uploadPic.mutateAsync({ file: avatarFile });
        avatar_url = uploadRes?.data?.filePath;
      }

      const payload = {
        first_name: values.first_name,
        last_name: values.last_name,
        phone: values.phone ?? "",
        bio: values.bio ?? "",
        ...(avatar_url ? { avatar_url } : {}),
      };

      updProfile.mutateAsync(payload, {
        onSuccess: (res: any) => {
          setInitial((prev: any) => ({
            ...(prev ?? {}),
            first_name: res?.first_name ?? values.first_name,
            last_name: res?.last_name ?? values.last_name,
            email: res?.email ?? values.email,
            phone: res?.phone ?? values.phone,
            bio: res?.bio ?? values.bio,
            avatarUrl:
              res?.avatar_url ?? avatar_url ?? prev?.avatarUrl ?? null,
          }));

          toast.success(res?.message || "Profile updated",{ id: "profile-updated" });
          loadUser(); // refresh auth user data
          push(`/my-profile`);
          closeModal();
          
        },
      });
    } catch (err: any) {
      toast.error(err?.message || "Save failed");
    }
  };

  const avatarSrc = initial?.avatarUrl
    ? initial.avatarUrl
    : getInitialsAvatar(
        `${initial?.first_name ?? ""} ${initial?.last_name ?? ""}`,
        80
      );

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
                  alt={`${initial?.first_name ?? ""} ${
                    initial?.last_name ?? ""
                  }`}
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
                      ? initial.role.charAt(0).toUpperCase() +
                        initial.role.slice(1)
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={openModal}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
            >
              <svg
                className="fill-current"
                width="18"
                height="18"
                viewBox="0 0 18 18"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                />
              </svg>
              {t("metaCard.edit")}
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
        />
      )}
    </>
  );
}
