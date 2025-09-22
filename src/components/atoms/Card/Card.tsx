import React from "react";
import { cn } from "@/lib/utils";
import type { CardProps } from "@/lib/types";

/**
 * Enhanced Card Component - Atomic Level
 * Follows Single Responsibility Principle - only handles card rendering
 */
export const Card: React.FC<CardProps & {
  variant?: "elevated" | "glass" | "outline";
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}> = ({
  children,
  title,
  subtitle,
  imageUrl,
  actions,
  className,
  variant = "elevated",
  hover = true,
  padding = "md",
  ...props
}) => {
  const variantClasses = {
    elevated: "card-elevated",
    glass: "card-glass",
    outline: "border-2 border-gray-200 bg-white/50 backdrop-blur-sm rounded-2xl",
  };

  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        variantClasses[variant],
        hover && "interactive",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      {/* Image section */}
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={imageUrl}
            alt={title || "Card image"}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="image-overlay" />
          
          {/* Image overlay content */}
          {title && (
            <div className="absolute bottom-4 left-4 right-4">
              <h3 className="text-white font-bold text-lg line-clamp-1 drop-shadow-lg">
                {title}
              </h3>
              {subtitle && (
                <p className="text-white/90 text-sm line-clamp-1 drop-shadow-md">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Content section */}
      <div className={cn(paddingClasses[padding])}>
        {/* Title and subtitle (when no image) */}
        {!imageUrl && (title || subtitle) && (
          <div className="mb-4">
            {title && (
              <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-gray-600 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Main content */}
        {children && (
          <div className="mb-4 last:mb-0">
            {children}
          </div>
        )}

        {/* Actions */}
        {actions && (
          <div className="flex flex-wrap gap-2 justify-end pt-4 border-t border-gray-100">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};