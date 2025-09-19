import React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import type { BaseComponentProps } from "@/lib/types";

interface LoadingSpinnerProps extends BaseComponentProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "dots" | "pulse";
  text?: string;
}

/**
 * Enhanced LoadingSpinner Component - Atomic Level
 * Follows Single Responsibility Principle - only handles loading state display
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  variant = "default",
  text,
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center space-x-2", className)}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={cn(
                "bg-blue-600 rounded-full animate-bounce",
                size === "sm" && "w-2 h-2",
                size === "md" && "w-3 h-3",
                size === "lg" && "w-4 h-4",
                size === "xl" && "w-5 h-5"
              )}
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
        {text && (
          <span className={cn("text-gray-600 font-medium ml-3", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
        <div className={cn(
          "bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-pulse",
          sizeClasses[size]
        )} />
        {text && (
          <span className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      <Loader2 
        className={cn(
          "animate-spin text-blue-600",
          sizeClasses[size]
        )}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className={cn("text-gray-600 font-medium", textSizeClasses[size])}>
          {text}
        </span>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
};