import React from "react";
import { LoadingSpinner, ErrorMessage } from "@/components/atoms";
import { PropertyCard } from "@/components/molecules";
import { useProperties } from "@/lib/hooks";
import type { PropertyFilters, PropertyListItem } from "@/lib/types";

interface PropertyListProps {
  filters: PropertyFilters;
  onPropertyClick?: (id: string) => void;
  onEditProperty?: (property: PropertyListItem) => void;
  onDeleteProperty?: (propertyId: string) => void;
  className?: string;
}

/**
 * PropertyList Component - Organism Level
 * Combines PropertyCard molecules with data fetching logic
 * Follows Single Responsibility Principle - only handles property list display and data fetching
 */
export const PropertyList: React.FC<PropertyListProps> = ({
  filters,
  onPropertyClick,
  onEditProperty,
  onDeleteProperty,
  className,
}) => {
  const {
    data: properties,
    isLoading,
    error,
    refetch,
  } = useProperties(filters);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage
          message="Error al cargar las propiedades. Por favor, inténtalo de nuevo."
          variant="error"
        />
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          No se encontraron propiedades
        </div>
        <p className="text-gray-400">Intenta ajustar los filtros de búsqueda</p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 p-6 rounded-3xl shadow-xl border-2 border-white/50">
          <h2 className="text-4xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            🏠 Propiedades
          </h2>
          <p className="text-gray-700 text-xl font-bold">
            ✨ {properties.length}{" "}
            {properties.length === 1
              ? "propiedad encontrada"
              : "propiedades encontradas"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {properties.map((property) => (
          <PropertyCard
            key={property.idProperty}
            property={property}
            onViewDetails={onPropertyClick}
            onEdit={onEditProperty}
            onDelete={onDeleteProperty}
          />
        ))}
      </div>
    </div>
  );
};
