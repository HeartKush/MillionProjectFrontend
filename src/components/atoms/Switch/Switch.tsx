import React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  id?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
  "data-testid"?: string;
}

/**
 * Switch Component - Atomic Level
 * Toggle switch for boolean values
 * Follows Single Responsibility Principle - only handles switch display and interaction
 */
export const Switch: React.FC<SwitchProps> = ({
  id,
  checked = false,
  onChange,
  disabled = false,
  label,
  className,
  "data-testid": dataTestId,
}) => {
  const handleToggle = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <button
        type="button"
        id={id}
        data-testid={dataTestId}
        onClick={handleToggle}
        disabled={disabled}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          checked ? "bg-blue-600" : "bg-gray-200",
          disabled && "opacity-50 cursor-not-allowed",
          !disabled && "cursor-pointer"
        )}
        role="switch"
        aria-checked={checked}
        aria-disabled={disabled}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium",
            disabled ? "text-gray-400" : "text-gray-700",
            !disabled && "cursor-pointer"
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
};
