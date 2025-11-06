"use client";

import React, { forwardRef } from "react";

type InputFieldProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  name?: string;
  disabled?: boolean;
  required?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;

  /** error can be boolean or a string message */
  error?: boolean | string;
  /** correct prop name */
  errorMessage?: string;
  /** backward-compat alias (typo) */
  errorMesage?: string;

  hint?: string;

  /** Slots */
  rightElement?: React.ReactNode;
  leftElement?: React.ReactNode;

  /** Classes */
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      label,
      placeholder = "",
      value,
      onChange,
      type = "text",
      name,
      disabled,
      required,
      autoFocus,
      autoComplete,
      onBlur,
      onKeyDown,
      maxLength,
      error,
      errorMessage,
      errorMesage, // <- alias supported
      hint,
      rightElement,
      leftElement,
      containerClassName = "",
      inputClassName = "",
      labelClassName = "",
    },
    ref
  ) => {
    const isError =
      Boolean(error) || Boolean(errorMessage) || Boolean(errorMesage);

    const computedErrorMessage =
      typeof error === "string" && error.length > 0
        ? error
        : (errorMessage ?? errorMesage);

    const describedById = isError
      ? `${name || "input"}-error`
      : hint
      ? `${name || "input"}-hint`
      : undefined;

    return (
      <div className={`w-full min-w-[200px] max-w-sm mt-4 ${containerClassName}`}>
        {label ? (
          <label
            className={`mb-1 block text-sm ${
              isError ? "text-red-600" : "text-slate-700"
            } ${labelClassName}`}
            htmlFor={name}
          >
            {label}
            {required ? <span className="ml-0.5 text-red-600">*</span> : null}
          </label>
        ) : null}

        <div className="relative">
          {/* Left slot */}
          {leftElement ? (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              {leftElement}
            </div>
          ) : null}

          <input
            ref={ref}
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            maxLength={maxLength}
            disabled={disabled}
            required={required}
            autoFocus={autoFocus}
            autoComplete={autoComplete}
            aria-invalid={isError || undefined}
            aria-describedby={describedById}
            placeholder={placeholder}
            className={[
              "w-full h-10 rounded px-3 py-2 text-sm",
              "bg-transparent placeholder:text-slate-400 text-slate-700",
              "border",
              isError ? "border-red-400" : "border-slate-200",
              "shadow-sm focus:shadow-md outline-none",
              leftElement ? "pl-9" : "",
              rightElement ? "pr-20" : "",
              disabled ? "opacity-60 cursor-not-allowed" : "",
              inputClassName,
            ].join(" ")}
          />

          {/* Right slot */}
          {rightElement ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-2">
              {rightElement}
            </div>
          ) : null}
        </div>

        {/* Helper / Error text */}
        {isError ? (
          <p id={`${name || "input"}-error`} className="mt-2 text-sm text-red-600">
            {computedErrorMessage}
          </p>
        ) : hint ? (
          <p id={`${name || "input"}-hint`} className="mt-2 text-xs text-slate-500">
            {hint}
          </p>
        ) : null}
      </div>
    );
  }
);

InputField.displayName = "InputField";
