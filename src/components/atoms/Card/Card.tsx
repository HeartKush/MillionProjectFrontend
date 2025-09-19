import React from "react";
import { cn } from "@/lib/utils";
import type { CardProps } from "@/lib/types";

/**
 * Card Component - Atomic Level
 * Follows Single Responsibility Principle - only handles card rendering
 */
export const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  imageUrl,
  actions,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden border border-gray-200",
        className
      )}
      {...props}
    >
      {imageUrl && (
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={imageUrl}
            alt={title || "Card image"}
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      <div className="p-6">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        )}

        {subtitle && <p className="text-sm text-gray-600 mb-4">{subtitle}</p>}

        {children && <div className="mb-4">{children}</div>}

        {actions && <div className="flex justify-end space-x-2">{actions}</div>}
      </div>
    </div>
  );
};
