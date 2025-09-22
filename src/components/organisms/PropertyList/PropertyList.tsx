"use client";

import React, { useState } from "react";
import { PropertyCard } from "@/components/molecules";
import { cn } from "@/lib/utils";
import { Grid, List } from "lucide-react";
import type { PropertyListItem } from "@/lib/types";

interface PropertyListProps {
  properties: PropertyListItem[];
  onPropertyClick?: (id: string) => void;
  className?: string;
}

type ViewMode = "grid" | "list";
type SortOption =
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc"
  | "newest";

/**
 * PropertyList Component - Organism Level
 * Displays list of properties (UI only, no data fetching)
 * Follows Single Responsibility Principle - only handles property list display
 */
export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  onPropertyClick,
  className,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Sort properties based on selected option
  const sortedProperties = React.useMemo(() => {
    if (!properties || properties.length === 0) return [];

    const sorted = [...properties];

    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "name-asc":
        return sorted.sort((a, b) =>
          (a.name || "").localeCompare(b.name || "")
        );
      case "name-desc":
        return sorted.sort((a, b) =>
          (b.name || "").localeCompare(a.name || "")
        );
      case "newest":
      default:
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  }, [properties, sortBy]);

  if (sortedProperties.length === 0) {
    return (
      <div className="card-elevated p-12 text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
          <Grid className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-4">
          No se encontraron propiedades
        </h3>
        <p className="text-gray-500 mb-6 max-w-md mx-auto">
          No hay propiedades que coincidan con los filtros aplicados.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with stats and controls */}
      <div className="card-elevated p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Stats */}
          <div className="flex items-center space-x-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text">
                Propiedades Disponibles
              </h2>
              <p className="text-gray-600">
                {sortedProperties.length}{" "}
                {sortedProperties.length === 1
                  ? "propiedad encontrada"
                  : "propiedades encontradas"}
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="form-input py-2 pr-8 text-sm min-w-0"
            >
              <option value="newest">Más recientes</option>
              <option value="price-asc">Precio: Menor a mayor</option>
              <option value="price-desc">Precio: Mayor a menor</option>
              <option value="name-asc">Nombre: A-Z</option>
              <option value="name-desc">Nombre: Z-A</option>
            </select>

            {/* View mode toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-md transition-all duration-200",
                  viewMode === "grid"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-md transition-all duration-200",
                  viewMode === "list"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Properties grid/list */}
      <div
        className={cn(
          "animate-fadeIn",
          viewMode === "grid" ? "property-grid" : "space-y-4"
        )}
      >
        {sortedProperties.map((property, index) => (
          <div
            key={property.idProperty}
            className="animate-scaleIn"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <PropertyCard
              property={property}
              onViewDetails={onPropertyClick}
              layout={viewMode}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
