"use client";

import React from "react";
import { Button } from "@/components/atoms";
import { PropertyDetail } from "@/components/molecules";
import type { PropertyDetail as PropertyDetailType } from "@/lib/types";

interface PropertyDetailViewProps {
  property: PropertyDetailType;
  onBack?: () => void;
  onEdit?: (propertyId: string) => void;
  onDelete?: (propertyId: string) => void;
  ownerName?: string;
  className?: string;
}

/**
 * PropertyDetailView Component - Organism Level
 * Displays property details (UI only, no data fetching)
 * Follows Single Responsibility Principle - only handles property detail display
 */
export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  property,
  onBack,
  onEdit,
  onDelete,
  ownerName,
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-500"
          >
            <span className="mr-2">←</span>
            Volver a la lista
          </Button>
        )}
      </div>

      <PropertyDetail
        property={property}
        onEdit={() => onEdit?.(property.idProperty!)}
        onDelete={() => onDelete?.(property.idProperty!)}
        ownerName={ownerName}
      />
    </div>
  );
};
