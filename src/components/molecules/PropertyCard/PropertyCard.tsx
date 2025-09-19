import React from "react";
import { Card } from "@/components/atoms";
import { formatCurrency } from "@/lib/utils";
import type { PropertyListItem } from "@/lib/types";

interface PropertyCardProps {
  property: PropertyListItem;
  onViewDetails?: (id: string) => void;
  onEdit?: (property: PropertyListItem) => void;
  onDelete?: (id: string) => void;
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
  onEdit,
  onDelete,
  className,
}) => {
  const handleViewDetails = () => {
    if (property.idProperty && onViewDetails) {
      onViewDetails(property.idProperty);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(property);
    }
  };

  const handleDelete = () => {
    if (property.idProperty && onDelete) {
      onDelete(property.idProperty);
    }
  };

  return (
    <div
      data-testid="property-card"
      className={`group bg-gradient-to-br from-white via-pink-50 to-purple-50 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl border-2 border-white/30 overflow-hidden transition-all duration-500 hover:scale-110 hover:rotate-1 ${className}`}
    >
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden">
        {property.imageUrl ? (
          <img
            src={property.imageUrl}
            alt={property.name || "Propiedad"}
            className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 flex items-center justify-center">
            <span className="text-8xl opacity-60">🏠</span>
          </div>
        )}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-2xl shadow-xl font-bold text-sm">
            💰 {formatCurrency(property.price)}
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content Section */}
      <div className="p-6 bg-gradient-to-br from-white to-pink-50">
        <h3 className="text-2xl font-black text-gray-900 mb-3 line-clamp-1">
          🏡 {property.name || "Sin nombre"}
        </h3>
        <p className="text-gray-700 mb-4 line-clamp-2 font-medium">
          📍 {property.address || "Sin dirección"}
        </p>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            👁️ Ver Detalles
          </button>
          {onEdit && (
            <button
              onClick={handleEdit}
              className="px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl font-bold text-sm hover:from-green-500 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              ✏️
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              className="px-4 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-2xl font-bold text-sm hover:from-red-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
