"use client";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

type ProfileValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  bio: string;
  avatarUrl?: string;
};

type Props = {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  t?: (k: string) => string;
  initialValues: ProfileValues;
  onSave: (payload: { values: Omit<ProfileValues, "avatarUrl">; avatarFile: File | null }) => Promise<void>;
};

// ------------------ helper: create initials SVG data URL ------------------
function getInitialsAvatar(name?: string, size = 96) {
  const initials = (name || "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0].toUpperCase())
    .join("") || "?";

  const bgColors = ["#FDE68A", "#C7F9CC", "#FBCFE8", "#BFDBFE", "#FEE2E2", "#E9D5FF"];
  const bg = bgColors[(initials.charCodeAt(0) || 0) % bgColors.length];
  const fg = "#111827";

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
    <rect width='100%' height='100%' rx='20' fill='${bg}'/>
    <text x='50%' y='50%' dy='0.36em' text-anchor='middle' font-family='Inter, Roboto, system-ui, sans-serif' font-size='${Math.round(size / 2.6)}' fill='${fg}' font-weight='600'>${initials}</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// ------------------ component ------------------
export default function ProfileEditModal({
  isOpen,
  setIsOpen,
  t,
  initialValues,
  onSave,
}: Props) {
  const tt = (k: string, fallback: string) => (t ? t(k) : fallback);

  // Controlled defaults (always strings)
  const [firstName, setFirstName] = useState<string>(initialValues?.first_name ?? "");
  const [lastName, setLastName] = useState<string>(initialValues?.last_name ?? "");
  const [email, setEmail] = useState<string>(initialValues?.email ?? "");
  const [phone, setPhone] = useState<string>(initialValues?.phone ?? "");
  const [bio, setBio] = useState<string>(initialValues?.bio ?? "");

  // Avatar: server URL and local picked file + preview URL
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(initialValues?.avatarUrl ?? undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation
  const [error, setError] = useState({ firstName: false, lastName: false, email: false });
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = (e: string) => EMAIL_RE.test(e.trim());

  // Submitting state
  const [submitting, setSubmitting] = useState(false);

  // Sync local state when initialValues change (e.g., after fetch)
  useEffect(() => {
    setFirstName(initialValues?.first_name ?? "");
    setLastName(initialValues?.last_name ?? "");
    setEmail(initialValues?.email ?? "");
    setPhone(initialValues?.phone ?? "");
    setBio(initialValues?.bio ?? "");
    setAvatarUrl(initialValues?.avatarUrl ?? undefined);
    // do not override avatarFile (if user picked a file while editing)
  }, [initialValues]);

  // Generate preview URL when user picks a file, and cleanup
  useEffect(() => {
    if (!avatarFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setPreviewUrl(url);
    // cleanup on change/unmount
    return () => {
      URL.revokeObjectURL(url);
      setPreviewUrl(null);
    };
  }, [avatarFile]);

  // Close modal
  const close = () => setIsOpen(false);

  // File picker
  const pickFile = () => fileInputRef.current?.click();

  // Handle file selection
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error(tt("profile.avatar.invalid", "Please choose an image file."));
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      toast.error(tt("profile.avatar.size", "Image too large (max 5MB)."));
      return;
    }
    setAvatarFile(f);
    setAvatarUrl(undefined); // prefer local preview when file selected
  };

  // Handle submit
  const handleSubmit = async () => {
    const nextErr = {
      firstName: firstName.trim() === "",
      lastName: lastName.trim() === "",
      email: email.trim() === "" || !isEmailValid(email),
    };
    setError(nextErr);
    if (Object.values(nextErr).some(Boolean)) return;

    setSubmitting(true);
    try {
      await onSave({
        values: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          bio: bio.trim(),
        },
        avatarFile,
      });
      toast.success(tt("profile.save.success", "Profile updated!"));
      setSubmitting(false);
      close();
    } catch (err: any) {
      // Attempt to surface useful error messages from backend
      const msg =
        err?.message ||
        err?.response?.data?.message ||
        (typeof err === "string" ? err : null) ||
        tt("profile.save.error", "Couldn't save changes.");
      toast.error(msg);
      console.error("save error:", err);
      setSubmitting(false);
    }
  };

  // Determine what avatar src to show: preview -> server url -> initials svg
  const avatarSrc = previewUrl ?? avatarUrl ?? getInitialsAvatar(`${firstName ?? ""} ${lastName ?? ""}`, 96);

  return (
    <div
      data-dialog-backdrop="dialog"
      data-dialog-backdrop-close="true"
      className={`absolute ${isOpen ? "" : "hidden"} left-0 -top-5 inset-0 z-[999] grid h-screen w-screen place-items-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300`}
    >
      <div
        data-dialog="dialog"
        className="relative mx-auto flex w-full max-w-[800px] flex-col rounded-xl bg-white text-slate-700 shadow-md"
      >
        {/* Header */}
        <div className="p-6 pb-2">
          <h4 className="text-2xl font-semibold text-slate-700">{tt("profile.title", "Edit Personal Information")}</h4>
          <p className="mt-1 text-sm text-slate-400">{tt("profile.subtitle", "Update your details to keep your profile up-to-date.")}</p>
        </div>

        {/* Content */}
        <div className="p-6 pt-4">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* LEFT */}
            <div>
              {/* Avatar */}
              <div className="mb-6">
                <label className="mb-2 block text-sm text-slate-700">{tt("profile.avatar.label", "Profile Picture")}</label>
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full ring-1 ring-slate-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={avatarSrc} alt="avatar" className="h-full w-full object-cover" />
                  </div>

                  <div className="flex items-center gap-2">
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
                    <button
                      type="button"
                      onClick={pickFile}
                      className="select-none rounded border border-slate-300 py-2 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                      {tt("profile.avatar.choose", "Choose Image")}
                    </button>
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={() => setAvatarFile(null)}
                        className="select-none rounded py-2 px-3 text-sm font-medium text-slate-500 hover:bg-slate-100"
                      >
                        {tt("profile.avatar.remove", "Remove")}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* First Name */}
              <Field
                label={tt("profile.form.firstName.label", "First Name")}
                placeholder={tt("profile.form.firstName.placeholder", "Enter first name")}
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError((s) => ({ ...s, firstName: e.target.value.trim() === "" }));
                }}
                error={error.firstName}
                errorMessage={tt("profile.form.firstName.error", "First name is required")}
              />

              {/* Last Name */}
              <Field
                className="mt-4"
                label={tt("profile.form.lastName.label", "Last Name")}
                placeholder={tt("profile.form.lastName.placeholder", "Enter last name")}
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError((s) => ({ ...s, lastName: e.target.value.trim() === "" }));
                }}
                error={error.lastName}
                errorMessage={tt("profile.form.lastName.error", "Last name is required")}
              />
            </div>

            {/* RIGHT */}
            <div>
              {/* Email - DISABLED so user cannot edit it */}
              <Field
                label={tt("profile.form.email.label", "Email Address")}
                type="email"
                placeholder={tt("profile.form.email.placeholder", "your@email.com")}
                value={email}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmail(v);
                  setError((s) => ({ ...s, email: v.trim() === "" || !isEmailValid(v) }));
                }}
                error={error.email}
                errorMessage={tt("profile.form.email.error", "Enter a valid email")}
                disabled={true}
              />

              <Field
                className="mt-4"
                label={tt("profile.form.phone.label", "Phone")}
                placeholder={tt("profile.form.phone.placeholder", "+00 000 000 00")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <TextAreaField
                className="mt-4"
                label={tt("profile.form.bio.label", "Bio")}
                placeholder={tt("profile.form.bio.placeholder", "What do you do?")}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={6}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0">
          <div className="flex space-x-2">
            <button
              className="w-full mx-auto select-none rounded border border-red-600 py-2 px-4 text-center text-sm font-semibold text-red-600 transition-all hover:bg-red-600 hover:text-white hover:shadow-md hover:shadow-red-600/20 active:bg-red-700 active:text-white disabled:pointer-events-none disabled:opacity-50"
              type="button"
              disabled={submitting}
              onClick={close}
            >
              {tt("profile.form.button.cancel", "Cancel")}
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full mx-auto select-none rounded bg-slate-800 py-2 px-4 text-center text-sm font-semibold text-white shadow-md shadow-slate-900/10 transition-all hover:shadow-lg hover:shadow-slate-900/20 active:opacity-[0.85] disabled:pointer-events-none disabled:opacity-50"
              type="button"
            >
              {submitting ? tt("profile.form.button.saving", "Saving…") : tt("profile.form.button.save", "Save Changes")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- small input helpers ---------- */

function Field({
  label,
  placeholder = "",
  error = false,
  errorMessage = "",
  value,
  onChange,
  type = "text",
  className = "",
  disabled = false, // new prop
}: {
  label: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <div className={`w-full max-w-xl ${className}`}>
      <label className={`mb-1 block text-sm ${error ? "text-red-600" : "text-slate-700"}`}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        aria-disabled={disabled}
        className={`h-10 w-full rounded border ${error ? "border-red-400" : "border-slate-200"} bg-transparent px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-300 ease focus:shadow-md placeholder:text-slate-400 ${disabled ? "opacity-60 cursor-not-allowed" : ""}`}
      />
      {error && <p className="mt-2 text-sm font-sans text-red-600">{errorMessage}</p>}
    </div>
  );
}

function TextAreaField({
  label,
  placeholder = "",
  value,
  onChange,
  rows = 5,
  className = "",
}: {
  label: string;
  placeholder?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-xl ${className}`}>
      <label className="mb-1 block text-sm text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-300 ease focus:shadow-md placeholder:text-slate-400"
      />
    </div>
  );
}
