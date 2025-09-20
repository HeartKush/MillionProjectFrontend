import React from "react";
import { OwnerFilterForm } from "@/components/molecules";
import type { OwnerFilters as OwnerFiltersType } from "@/lib/types";

interface OwnerFiltersProps {
  onFiltersChange: (filters: OwnerFiltersType) => void;
  initialFilters?: OwnerFiltersType;
  className?: string;
}

/**
 * OwnerFilters Component - Organism Level
 * Combines OwnerFilterForm molecule with filter state management
 * Follows Single Responsibility Principle - only handles owner filtering logic
 */
export const OwnerFilters: React.FC<OwnerFiltersProps> = ({
  onFiltersChange,
  initialFilters = {},
  className,
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Filtros de Búsqueda
        </h3>
        <p className="text-sm text-gray-600">
          Busca propietarios por nombre o dirección
        </p>
      </div>

      <OwnerFilterForm
        onFiltersChange={onFiltersChange}
        initialFilters={initialFilters}
        className={className}
      />
    </div>
  );
};
