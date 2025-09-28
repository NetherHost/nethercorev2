"use client";

import React, { forwardRef } from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  description?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, description, error, icon, className = "", ...props }, ref) => {
    const baseClasses =
      "w-full bg-black/50 border border-neutral-800 rounded-lg px-3 py-2.5 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 resize-none";

    const textareaClasses = `${baseClasses} ${className}`;

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-white font-medium text-sm">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 text-neutral-400">{icon}</div>
          )}
          <textarea
            ref={ref}
            className={`${textareaClasses} ${icon ? "pl-10" : ""}`}
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

Textarea.displayName = "Textarea";

export default Textarea;
