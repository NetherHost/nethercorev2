import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  icon?: ReactNode;
  fullWidth?: boolean;
  loading?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  icon,
  fullWidth = false,
  loading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-medium transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2.5 text-base rounded-lg",
    lg: "px-6 py-3 text-lg rounded-xl",
  };

  const variantClasses = {
    primary:
      "bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 focus:ring-red-400 disabled:bg-neutral-900/50 disabled:hover:bg-neutral-900/50",
    secondary:
      "bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 focus:ring-neutral-400 disabled:bg-neutral-800/50 disabled:hover:bg-neutral-800/50",
    success:
      "bg-green-600 hover:bg-green-700 text-white border border-green-600 focus:ring-green-400 disabled:bg-green-600/50 disabled:hover:bg-green-600/50",
    danger:
      "bg-red-600 hover:bg-red-700 text-white border border-red-600 focus:ring-red-400 disabled:bg-red-600/50 disabled:hover:bg-red-600/50",
    glass:
      "bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md focus:ring-white/40 disabled:bg-white/5 disabled:hover:bg-white/5",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const isDisabled = disabled || loading;

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <>
          <i className="fas fa-spinner-third animate-spin flex-shrink-0" />
          Loading...
        </>
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
