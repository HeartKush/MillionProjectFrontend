import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { ButtonProps } from "@/lib/types";

/**
 * Enhanced Button Component - Atomic Level
 * Follows Single Responsibility Principle - only handles button rendering and behavior
 */
export const Button: React.FC<
  ButtonProps & {
    loading?: boolean;
    icon?: React.ReactNode;
    fullWidth?: boolean;
  }
> = ({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  onClick,
  type = "button",
  className,
  icon,
  fullWidth = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden group";

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    success: "btn-success",
    danger: "btn-danger",
    outline: "btn-outline",
    ghost: "btn-ghost",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm rounded-lg gap-2",
    md: "px-6 py-3 text-base rounded-xl gap-2",
    lg: "px-8 py-4 text-lg rounded-xl gap-3",
  };

  // Special handling for icon-only buttons
  const isIconOnly = icon && !children;
  const iconOnlySizeClasses = {
    sm: "p-2 min-w-[2.5rem] min-h-[2.5rem]",
    md: "p-3 min-w-[3rem] min-h-[3rem]",
    lg: "p-4 min-w-[3.5rem] min-h-[3.5rem]",
  };

  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      data-variant={variant}
      className={cn(
        baseClasses,
        variantClasses[variant],
        isIconOnly ? iconOnlySizeClasses[size] : sizeClasses[size],
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {/* Loading spinner */}
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}

      {/* Icon */}
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}

      {/* Button text */}
      <span
        className={cn("transition-all duration-300", loading && "opacity-70")}
      >
        {children}
      </span>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </button>
  );
};
