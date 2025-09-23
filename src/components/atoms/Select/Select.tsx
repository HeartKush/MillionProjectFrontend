"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, ChevronDown } from "lucide-react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  placeholder?: string;
  children: React.ReactNode;
}

/**
 * Select Component - Atomic Level
 * Follows Single Responsibility Principle - only handles select rendering and behavior
 * Matches the visual style of Input component
 */
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      placeholder,
      children,
      className,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Select container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
              {leftIcon}
            </div>
          )}

          {/* Select field */}
          <select
            ref={ref}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            required={required}
            className={cn(
              "form-input appearance-none cursor-pointer",
              leftIcon && "pl-10",
              error && "form-input-error",
              isFocused && "ring-2 ring-blue-500/20 border-blue-500",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>

          {/* Right side icons */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2 pointer-events-none">
            {error && (
              <AlertCircle
                className="w-5 h-5 text-red-500"
                data-testid="alert-circle"
              />
            )}

            {/* Chevron down icon */}
            <ChevronDown
              className="w-5 h-5 text-gray-400"
              data-testid="chevron-down"
            />
          </div>

          {/* Focus ring animation */}
          {isFocused && (
            <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500/20 pointer-events-none animate-pulse-glow" />
          )}
        </div>

        {/* Helper text or error message */}
        {(error || helperText) && (
          <div className="mt-2 flex items-start space-x-1">
            {error && (
              <AlertCircle
                className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0"
                data-testid="alert-circle"
              />
            )}
            <p
              className={cn(
                "text-sm",
                error ? "text-red-600" : "text-gray-500"
              )}
            >
              {error || helperText}
            </p>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
