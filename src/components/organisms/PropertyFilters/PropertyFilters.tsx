import React from "react";
import { FilterForm } from "@/components/molecules";
import type { PropertyFilters as PropertyFiltersType } from "@/lib/types";

interface PropertyFiltersProps {
  onFiltersChange: (filters: PropertyFiltersType) => void;
  onClearFilters: () => void;
  initialFilters?: PropertyFiltersType;
  className?: string;
}

/**
 * PropertyFilters Component - Organism Level
 * Combines FilterForm molecule with filter state management
 * Follows Single Responsibility Principle - only handles property filtering logic
 */
export const PropertyFilters: React.FC<PropertyFiltersProps> = ({
  onFiltersChange,
  onClearFilters,
  initialFilters = {},
  className,
}) => {
  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-md border border-gray-200 ${className}`}
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Filtros de Búsqueda
        </h3>
        <p className="text-sm text-gray-600">
          Busca propiedades por nombre, dirección o rango de precios
        </p>
      </div>

      <FilterForm
        onFiltersChange={onFiltersChange}
        onClearFilters={onClearFilters}
        initialFilters={initialFilters}
        className={className}
      />
    </div>
  );
};
