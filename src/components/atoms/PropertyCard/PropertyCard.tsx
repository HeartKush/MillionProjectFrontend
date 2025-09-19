import React from "react";
import { Card } from "@/components/atoms";
import { formatCurrency } from "@/lib/utils";
import type { PropertyListItem } from "@/lib/types";

interface PropertyCardProps {
  property: PropertyListItem;
  onViewDetails?: (id: string) => void;
  className?: string;
}

/**
 * PropertyCard Component - Molecular Level
 * Combines Card atom with property-specific content
 * Follows Single Responsibility Principle - only handles property card display
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  className,
}) => {
  const handleViewDetails = () => {
    if (property.idProperty && onViewDetails) {
      onViewDetails(property.idProperty);
    }
  };

  return (
    <Card
      title={property.name || "Sin nombre"}
      subtitle={property.address || "Sin dirección"}
      imageUrl={property.imageUrl}
      actions={
        <button
          onClick={handleViewDetails}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Ver detalles
        </button>
      }
      className={`property-card ${className}`}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Precio:</span>
          <span className="text-lg font-bold text-green-600">
            {formatCurrency(property.price)}
          </span>
        </div>
      </div>
    </Card>
  );
};
