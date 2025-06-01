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
  ({ label, error, helperText, required, className = "", ...props }, ref) => {
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

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input ref={ref} className={combinedClassName} {...props} />
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-600 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
