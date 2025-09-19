import React from "react";
import { cn } from "@/lib/utils";
import type { BaseComponentProps } from "@/lib/types";

interface ErrorMessageProps extends BaseComponentProps {
  message: string;
  variant?: "error" | "warning" | "info";
}

/**
 * ErrorMessage Component - Atomic Level
 * Follows Single Responsibility Principle - only handles error message display
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  variant = "error",
  className,
}) => {
  const variantClasses = {
    error: "text-red-600 bg-red-50 border-red-200",
    warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
    info: "text-blue-600 bg-blue-50 border-blue-200",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-md border",
        variantClasses[variant],
        className
      )}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};
