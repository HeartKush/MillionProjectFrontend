import React from "react";
import { Button, Card } from "@/components/atoms";
import { Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OwnerListItem } from "@/lib/types";

interface OwnerCardProps {
  owner: OwnerListItem;
  onViewOwner?: (id: string) => void;
  className?: string;
}

/**
 * OwnerCard Component - Molecular Level
 * Displays owner information with image first and larger
 * Follows Single Responsibility Principle - only handles owner card display
 */
export const OwnerCard: React.FC<OwnerCardProps> = ({
  owner,
  onViewOwner,
  className,
}) => {
  const handleViewOwner = () => {
    if (owner.idOwner && onViewOwner) {
      onViewOwner(owner.idOwner);
    }
  };

  return (
    <Card
      variant="elevated"
      hover={true}
      padding="none"
      className={cn("owner-card group relative overflow-hidden", className)}
    >
      {/* Image section - Circular avatar */}
      <div className="flex justify-center pt-6 pb-4">
        <div className="relative">
          {owner.photo ? (
            <img
              src={owner.photo}
              alt={owner.name || "Propietario"}
              className="w-24 h-24 rounded-full object-cover shadow-lg transition-transform duration-500 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  const fallbackAvatar = parent.querySelector(
                    ".fallback-avatar"
                  ) as HTMLElement;
                  if (fallbackAvatar) {
                    fallbackAvatar.style.display = "flex";
                  }
                }
              }}
            />
          ) : null}

          {/* Fallback avatar */}
          <div
            className={`w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ${
              owner.photo ? "fallback-avatar hidden" : ""
            }`}
          >
            <span className="text-white font-bold text-2xl">
              {owner.name?.charAt(0) || "?"}
            </span>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="p-4">
        {/* Owner name */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
          {owner.name || "Sin nombre"}
        </h3>

        {/* Owner address */}
        <p className="text-gray-600 text-sm line-clamp-1 mb-4">
          {owner.address || "Sin dirección"}
        </p>

        {/* Action button */}
        {onViewOwner && owner.idOwner && (
          <Button
            size="sm"
            variant="primary"
            onClick={handleViewOwner}
            icon={<Eye className="w-4 h-4" />}
            fullWidth
          >
            Ver Detalles
          </Button>
        )}
      </div>
    </Card>
  );
};
