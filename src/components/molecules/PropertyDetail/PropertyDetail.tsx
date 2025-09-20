"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/atoms";
import { Edit, Trash2 } from "lucide-react";
import type { PropertyDetail as PropertyDetailType } from "@/lib/types";

interface PropertyDetailProps {
  property: PropertyDetailType;
  onEdit?: () => void;
  onDelete?: () => void;
  ownerName?: string;
  className?: string;
}

/**
 * PropertyDetail Component - Molecular Level
 * Displays detailed property information
 * Follows Single Responsibility Principle - only handles property detail display
 */
export const PropertyDetail: React.FC<PropertyDetailProps> = ({
  property,
  onEdit,
  onDelete,
  ownerName,
  className,
}) => {
  const router = useRouter();

  return (
    <div className={className}>
      {/* Property detail card with original design */}
      <div className="card-elevated p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Property image */}
          <div className="aspect-video rounded-2xl overflow-hidden">
            <img
              src={
                property.imageUrl ||
                "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
              }
              alt={property.name || "Propiedad"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Property details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold gradient-text mb-2">
                {property.name || "Sin nombre"}
              </h1>
              <p className="text-gray-600 text-lg">
                {property.address || "Sin dirección"}
              </p>
            </div>

            <div className="price-display text-4xl">
              {formatCurrency(property.price)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stats-card">
                <div className="text-sm text-gray-500 mb-1">Año</div>
                <div className="text-xl font-bold">{property.year}</div>
              </div>
              <div className="stats-card">
                <div className="text-sm text-gray-500 mb-1">Código</div>
                <div className="text-xl font-bold">
                  {property.codeInternal || "N/A"}
                </div>
              </div>
              <div className="stats-card">
                <div className="text-sm text-gray-500 mb-1">Propietario</div>
                <div className="text-xl font-bold">
                  {ownerName ? (
                    <button
                      onClick={() =>
                        router.push(
                          `/propietarios/${property.idOwner}?from=property&propertyId=${property.idProperty}`
                        )
                      }
                      className="text-blue-600 hover:text-blue-500 hover:underline transition-colors duration-200 cursor-pointer"
                      title={`Ver detalles de ${ownerName}`}
                    >
                      {ownerName}
                    </button>
                  ) : (
                    <span className="text-gray-500 italic">Sin asignar</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={onEdit}
                icon={<Edit className="w-4 h-4" />}
              >
                Editar Propiedad
              </Button>
              <Button
                variant="danger"
                onClick={onDelete}
                icon={<Trash2 className="w-4 h-4" />}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
