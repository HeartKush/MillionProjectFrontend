import React from "react";
import { LoadingSpinner, ErrorMessage } from "@/components/atoms";
import { PropertyDetail } from "@/components/molecules";
import { useProperty } from "@/lib/hooks";

interface PropertyDetailViewProps {
  propertyId: string;
  onBack?: () => void;
  className?: string;
}

/**
 * PropertyDetailView Component - Organism Level
 * Combines PropertyDetail molecule with data fetching logic
 * Follows Single Responsibility Principle - only handles property detail display and data fetching
 */
export const PropertyDetailView: React.FC<PropertyDetailViewProps> = ({
  propertyId,
  onBack,
  className,
}) => {
  const { data: property, isLoading, error, refetch } = useProperty(propertyId);

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
          message="Error al cargar los detalles de la propiedad. Por favor, inténtalo de nuevo."
          variant="error"
        />
        <div className="mt-4 flex justify-center space-x-2">
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Reintentar
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Volver
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          Propiedad no encontrada
        </div>
        <p className="text-gray-400 mb-4">
          La propiedad que buscas no existe o ha sido eliminada
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver a la lista
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={className}>
      {onBack && (
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver a la lista
          </button>
        </div>
      )}

      <PropertyDetail property={property} />
    </div>
  );
};
