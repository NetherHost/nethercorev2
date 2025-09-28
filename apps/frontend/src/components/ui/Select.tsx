"use client";

import React, { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, description, error, icon, options, className = "", ...props },
    ref
  ) => {
    const baseClasses =
      "w-full bg-black/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer";

    const selectClasses = `${baseClasses} ${className}`;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-white font-medium text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            className={`${selectClasses} ${icon ? "pl-10" : ""}`}
            {...props}
          >
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-black text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <i className="fas fa-chevron-down text-neutral-400 text-sm"></i>
          </div>
        </div>
        {description && (
          <p className="text-neutral-400 text-xs">{description}</p>
        )}
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";

export default Select;
