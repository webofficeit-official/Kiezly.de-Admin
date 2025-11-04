"use client";
import React, { useEffect, useState } from "react";
import { useModal } from "@/lib/custom-hook/useModal";
import ProfileEditModal from "./profile-edit-modal";
import { useT } from "@/app/[locale]/layout";
import { useAuth } from "@/lib/context/auth-context";

export default function UserInfoCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const t = useT("profile");

  
      const { user, loading } = useAuth();
  const [initial, setInitial] = useState(null);
  useEffect(() => {
    if (!loading && user) {
      setInitial(user);
    }
  }, [loading, user]);
  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            {t("infoCard.sectionTitle")}
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{t("infoCard.labels.firstName")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{initial?.first_name}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{t("infoCard.labels.lastName")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{initial?.last_name}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{t("infoCard.labels.email")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{initial?.email}</p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{t("infoCard.labels.phone")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{initial?.phone}</p>
            </div>

            <div className="lg:col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">{t("infoCard.labels.bio")}</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{initial?.bio}</p>
            </div>
          </div>
        </div>

       
      </div>

    </div>
  );
}
