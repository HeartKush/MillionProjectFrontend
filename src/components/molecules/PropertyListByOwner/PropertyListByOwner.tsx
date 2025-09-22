"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/atoms";
import { formatCurrency } from "@/lib/utils";
import { Home, MapPin, Calendar, DollarSign, Eye } from "lucide-react";
import { usePropertiesByOwner } from "@/lib/hooks/useProperties";
import type { PropertyListItem } from "@/lib/types";

interface PropertyListByOwnerProps {
  ownerId: string;
  ownerName?: string;
  className?: string;
}

/**
 * PropertyListByOwner Component - Molecular Level
 * Displays properties owned by a specific owner
 * Follows Single Responsibility Principle - only handles property list display for owner
 */
export const PropertyListByOwner: React.FC<PropertyListByOwnerProps> = ({
  ownerId,
  ownerName,
  className,
}) => {
  const router = useRouter();
  const { data: properties, isLoading, error } = usePropertiesByOwner(ownerId);

  const handleViewProperty = (propertyId: string) => {
    router.push(`/propiedades/${propertyId}`);
  };

  if (isLoading) {
    return (
      <div className={`card-elevated p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Propiedades de {ownerName || "este propietario"}
            </h3>
            <p className="text-sm text-gray-500">Cargando propiedades...</p>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-24 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card-elevated p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Propiedades de {ownerName || "este propietario"}
            </h3>
            <p className="text-sm text-red-500">
              Error al cargar las propiedades
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className={`card-elevated p-6 ${className}`}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl flex items-center justify-center">
            <Home className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Propiedades de {ownerName || "este propietario"}
            </h3>
            <p className="text-sm text-gray-500">
              {properties?.length || 0} propiedades registradas
            </p>
          </div>
        </div>

        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Home className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin propiedades registradas
          </h3>
          <p className="text-gray-600">
            Este propietario no tiene propiedades asociadas en el sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-elevated p-6 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Home className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Propiedades de {ownerName || "este propietario"}
          </h3>
          <p className="text-sm text-gray-500">
            {properties.length}{" "}
            {properties.length === 1 ? "propiedad" : "propiedades"} registradas
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {properties.map((property) => (
          <Card
            key={property.idProperty}
            className="p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => handleViewProperty(property.idProperty!)}
          >
            <div className="flex items-center space-x-4">
              {/* Property Image */}
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={
                    property.imageUrl ||
                    "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
                  }
                  alt={property.name || "Propiedad"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Property Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                      {property.name || "Sin nombre"}
                    </h4>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        {property.address || "Sin dirección"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(property.price)}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewProperty(property.idProperty!);
                      }}
                      className="mt-1 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      Ver detalles
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      {properties.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {properties.length}
              </div>
              <div className="text-sm text-gray-500">Total Propiedades</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(
                  properties.reduce((sum, prop) => sum + prop.price, 0)
                )}
              </div>
              <div className="text-sm text-gray-500">Valor Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(
                  properties.reduce((sum, prop) => sum + prop.price, 0) /
                    properties.length
                )}
              </div>
              <div className="text-sm text-gray-500">Valor Promedio</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
