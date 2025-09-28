"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: "default" | "password" | "number" | "url";
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      description,
      error,
      icon,
      variant = "default",
      className = "",
      ...props
    },
    ref
  ) => {
    const baseClasses =
      "w-full bg-black/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200";

    const inputClasses = `${baseClasses} ${className}`;

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
          <input
            ref={ref}
            type={
              variant === "password"
                ? "password"
                : variant === "number"
                ? "number"
                : variant === "url"
                ? "url"
                : "text"
            }
            className={`${inputClasses} ${icon ? "pl-10" : ""}`}
            {...props}
          />
        </div>
        {description && (
          <p className="text-neutral-400 text-xs">{description}</p>
        )}
        {error && <p className="text-red-400 text-xs">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
