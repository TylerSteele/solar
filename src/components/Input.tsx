// src/components/ui/Input.tsx
"use client";

import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, helperText, required, className = "", type, ...props },
    ref
  ) => {
    const baseClasses =
      "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors";
    const errorClasses = error
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-300";
    const readOnlyClasses = props.readOnly ? "bg-gray-50" : "";

    const combinedClassName = [
      baseClasses,
      errorClasses,
      readOnlyClasses,
      className,
    ].join(" ");

    // Mask phone number as 111-111-1111
    const formatPhone = (value: string) => {
      // Remove all non-digits
      const digits = value.replace(/\D/g, "").slice(0, 10);
      // Format as 111-111-1111
      if (digits.length === 0) return "";
      if (digits.length <= 3) return digits;
      if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
      return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === "tel") {
        const formatted = formatPhone(e.target.value);
        e.target.value = formatted;
        props.onChange?.(e);
      } else {
        props.onChange?.(e);
      }
    };

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={combinedClassName}
          type={type}
          inputMode={type === "tel" ? "numeric" : undefined}
          pattern={type === "tel" ? "[0-9-]*" : undefined}
          maxLength={type === "tel" ? 13 : undefined}
          {...props}
          onChange={handleChange}
        />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-600 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
