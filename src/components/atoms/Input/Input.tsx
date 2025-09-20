"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import type { InputProps } from "@/lib/types";

/**
 * Enhanced Input Component - Atomic Level
 * Follows Single Responsibility Principle - only handles input rendering and behavior
 */
export const Input = React.forwardRef<
  HTMLInputElement,
  InputProps & {
    label?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showPasswordToggle?: boolean;
  }
>(
  (
    {
      type = "text",
      placeholder,
      value,
      onChange,
      error,
      disabled = false,
      required = false,
      className,
      label,
      helperText,
      leftIcon,
      rightIcon,
      showPasswordToggle = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    const inputType = showPasswordToggle && showPassword ? "text" : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e);
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    return (
      <div className="w-full">
        {/* Label */}
        {label && (
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Left icon */}
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={disabled}
            required={required}
            className={cn(
              "form-input",
              leftIcon && "pl-10",
              (rightIcon || showPasswordToggle || error) && "pr-10",
              error && "form-input-error",
              isFocused && "ring-2 ring-blue-500/20 border-blue-500",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            {...props}
          />

          {/* Right icon or password toggle */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {error && <AlertCircle className="w-5 h-5 text-red-500" />}

            {showPasswordToggle && type === "password" && (
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            )}

            {rightIcon && !error && !showPasswordToggle && (
              <div className="text-gray-400">{rightIcon}</div>
            )}
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
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
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

Input.displayName = "Input";
