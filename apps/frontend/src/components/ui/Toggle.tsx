"use client";

import React from "react";

interface ToggleProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Toggle({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  size = "md",
}: ToggleProps) {
  const sizeClasses = {
    sm: "h-5 w-9",
    md: "h-6 w-11",
    lg: "h-7 w-12",
  };

  const thumbSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const translateClasses = {
    sm: checked ? "translate-x-5" : "translate-x-1",
    md: checked ? "translate-x-6" : "translate-x-1",
    lg: checked ? "translate-x-6" : "translate-x-1",
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        {label && (
          <label className="text-white font-medium text-sm">{label}</label>
        )}
        {description && (
          <p className="text-neutral-400 text-xs mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        disabled={disabled}
        className={`relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed ${
          checked ? "bg-red-500" : "bg-neutral-700"
        } ${sizeClasses[size]}`}
      >
        <span
          className={`inline-block transform rounded-full bg-white transition-transform ${thumbSizeClasses[size]} ${translateClasses[size]}`}
        />
      </button>
    </div>
  );
}
