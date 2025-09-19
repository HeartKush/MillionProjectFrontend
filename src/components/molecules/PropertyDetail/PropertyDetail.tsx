import React from "react";
import { Card } from "@/components/atoms";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { PropertyDetail as PropertyDetailType } from "@/lib/types";

interface PropertyDetailProps {
  property: PropertyDetailType;
  className?: string;
}

/**
 * PropertyDetail Component - Molecular Level
 * Displays detailed property information
 * Follows Single Responsibility Principle - only handles property detail display
 */
export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  className,
}) => {
  return (
    <Card
      title={property.name || "Sin nombre"}
      subtitle={property.address || "Sin dirección"}
      imageUrl={property.imageUrl}
      className={className}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Precio:</span>
              <span className="text-2xl font-bold text-green-600">
                {formatCurrency(property.price)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Año:</span>
              <span className="text-lg font-semibold text-gray-900">
                {property.year}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Código Interno:
              </span>
              <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                {property.codeInternal || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {property.imageUrl && (
          <div className="mt-4">
            <img
              src={property.imageUrl}
              alt={property.name || "Property image"}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </Card>
  );
};
