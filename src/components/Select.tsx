// src/components/ui/Select.tsx
"use client";

import { SelectHTMLAttributes, ReactNode, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, helperText, required, className = "", children, ...props },
    ref
  ) => {
    const baseClasses =
      "w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white";
    const errorClasses = error
      ? "border-red-300 focus:ring-red-500"
      : "border-gray-300";

    const combinedClassName = [baseClasses, errorClasses, className].join(" ");

    return (
      <div>
        {label && (
          <label className="block text-sm font-medium mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <select ref={ref} className={combinedClassName} {...props}>
          {children}
        </select>
        {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-600 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
