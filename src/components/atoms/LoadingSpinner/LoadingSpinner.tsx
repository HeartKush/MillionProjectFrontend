import React from "react";
import { cn } from "@/lib/utils";
import type { BaseComponentProps } from "@/lib/types";

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: "sm" | "md" | "lg";
}

/**
 * LoadingSpinner Component - Atomic Level
 * Follows Single Responsibility Principle - only handles loading state display
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
