import React from "react";
import { Card, Button } from "@/components/atoms";
import { formatCurrency, cn } from "@/lib/utils";
import { MapPin, Calendar, Home, Eye, Star } from "lucide-react";
import type { PropertyListItem } from "@/lib/types";

interface PropertyCardProps {
  property: PropertyListItem;
  onViewDetails?: (id: string) => void;
  className?: string;
  featured?: boolean;
  layout?: "grid" | "list";
}

/**
 * Enhanced PropertyCard Component - Molecular Level
 * Combines Card atom with property-specific content
 * Follows Single Responsibility Principle - only handles property card display
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onViewDetails,
  className,
  featured = false,
  layout = "grid",
}) => {
  const handleViewDetails = () => {
    if (property.idProperty && onViewDetails) {
      onViewDetails(property.idProperty);
    }
  };

  const propertyImage =
    property.imageUrl ||
    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800";

  // Grid layout (default)
  if (layout === "grid") {
    return (
      <Card
        variant="elevated"
        hover={true}
        padding="none"
        className={cn(
          "property-card group relative overflow-hidden",
          featured && "ring-2 ring-yellow-400 shadow-glow",
          className
        )}
        data-testid="property-card"
      >
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
            <Star className="w-4 h-4" />
            <span>Destacada</span>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={propertyImage}
            alt={property.name || "Propiedad"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Price overlay */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl shadow-lg backdrop-blur-sm">
            <div className="text-lg font-bold">
              {formatCurrency(property.price)}
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Property title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors duration-300">
            {property.name || "Sin nombre"}
          </h3>

          {/* Property details */}
          <div className="space-y-3 mb-4">
            {/* Address */}
            <div className="flex items-start space-x-2 text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
              <span className="text-sm line-clamp-2">
                {property.address || "Sin dirección"}
              </span>
            </div>

            {/* Property type indicator */}
            <div className="flex items-center space-x-2 text-gray-600">
              <Home className="w-4 h-4 text-gray-400" />
              <span className="text-sm">Propiedad Residencial</span>
            </div>
          </div>

          {/* Property stats */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Disponible</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="status-indicator status-available">Disponible</div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 mt-4">
            <Button
              size="sm"
              variant="primary"
              onClick={handleViewDetails}
              fullWidth
              icon={<Eye className="w-4 h-4" />}
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  // List layout
  return (
    <Card
      variant="elevated"
      hover={true}
      padding="none"
      className={cn(
        "property-card group relative overflow-hidden",
        featured && "ring-2 ring-yellow-400 shadow-glow",
        className
      )}
      data-testid="property-card"
    >
      <div className="flex">
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
            <Star className="w-4 h-4" />
            <span>Destacada</span>
          </div>
        )}

        {/* Image Section - List layout */}
        <div className="relative w-64 h-48 flex-shrink-0 overflow-hidden">
          <img
            src={propertyImage}
            alt={property.name || "Propiedad"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Price overlay */}
          <div className="absolute top-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-3 py-1 rounded-lg shadow-lg backdrop-blur-sm">
            <div className="text-sm font-bold">
              {formatCurrency(property.price)}
            </div>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content Section - List layout */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            {/* Property title */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
              {property.name || "Sin nombre"}
            </h3>

            {/* Property details */}
            <div className="space-y-2 mb-4">
              {/* Address */}
              <div className="flex items-start space-x-2 text-gray-600">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                <span className="text-sm">
                  {property.address || "Sin dirección"}
                </span>
              </div>

              {/* Property type indicator */}
              <div className="flex items-center space-x-2 text-gray-600">
                <Home className="w-4 h-4 text-gray-400" />
                <span className="text-sm">Propiedad Residencial</span>
              </div>
            </div>
          </div>

          {/* Bottom section with status and button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Disponible</span>
              </div>
              <div className="status-indicator status-available">
                Disponible
              </div>
            </div>

            {/* Action button */}
            <Button
              size="sm"
              variant="primary"
              onClick={handleViewDetails}
              icon={<Eye className="w-4 h-4" />}
              className="ml-4"
            >
              Ver Detalles
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
