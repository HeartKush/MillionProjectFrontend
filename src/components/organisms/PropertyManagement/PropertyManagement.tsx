import React, { useState } from "react";
import { PropertyList } from "@/components/organisms";
import { PropertyFilters } from "@/components/organisms/PropertyFilters";
import { PropertyForm, PropertyCard } from "@/components/molecules";
import {
  Modal,
  Button,
  LoadingSpinner,
  ErrorMessage,
} from "@/components/atoms";
import {
  useProperties,
  useCreateProperty,
  useProperty,
  useDeleteProperty,
  useUpdateProperty,
} from "@/lib/hooks";
import type {
  PropertyFilters as PropertyFiltersType,
  PropertyListItem,
  PropertyDetail,
} from "@/lib/types";

interface PropertyManagementProps {
  className?: string;
}

/**
 * PropertyManagement Component - Organism Level
 * Complete CRUD management for properties
 * Follows Single Responsibility Principle - only handles property management logic
 */
export const PropertyManagement: React.FC<PropertyManagementProps> = ({
  className,
}) => {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyDetail | null>(
    null
  );

  const {
    data: properties,
    isLoading,
    error,
    refetch,
  } = useProperties(filters);
  const { data: selectedProperty } = useProperty(
    selectedPropertyId || undefined
  );
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  const handleFiltersChange = (newFilters: PropertyFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handlePropertyClick = (propertyId: string) => {
    setSelectedPropertyId(propertyId);
  };

  const handleBackToList = () => {
    setSelectedPropertyId(null);
  };

  const handleCreateProperty = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditProperty = (property: PropertyListItem) => {
    // Fetch full property details for editing
    if (property.idProperty) {
      setSelectedPropertyId(property.idProperty);
      // We'll use the selectedProperty data for editing
      setTimeout(() => {
        if (selectedProperty) {
          setEditingProperty(selectedProperty);
          setIsEditModalOpen(true);
        }
      }, 100);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta propiedad?")
    ) {
      deletePropertyMutation.mutate(propertyId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleCreateSubmit = (data: any) => {
    createPropertyMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        refetch();
      },
    });
  };

  const handleEditSubmit = (data: any) => {
    if (editingProperty?.idProperty) {
      updatePropertyMutation.mutate(
        { id: editingProperty.idProperty, property: data },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setEditingProperty(null);
            setSelectedPropertyId(null);
            refetch();
          },
        }
      );
    }
  };

  if (selectedProperty) {
    return (
      <div className={className}>
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-6 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-gray-50 shadow-sm"
          >
            <span className="mr-2">←</span>
            Volver a la lista
          </Button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
          <PropertyCard property={selectedProperty} onViewDetails={() => {}} />
        </div>
      </div>
    );
  }

  return (
    <div data-testid="property-management" className={className}>
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 p-8 rounded-3xl shadow-xl border-2 border-white/50">
            <h1 className="text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              🏠 Gestión de Propiedades
            </h1>
            <p className="text-gray-700 text-xl font-semibold">
              ✨ Administra y organiza tu inventario inmobiliario
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateProperty}
            className="bg-gradient-to-r from-pink-500 via-purple-600 to-blue-600 hover:from-pink-600 hover:via-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 px-8 py-4 rounded-2xl text-white font-bold text-lg"
          >
            <span className="mr-3 text-2xl">✨</span>
            Nueva Propiedad
          </Button>
        </div>

        <div className="bg-gradient-to-r from-white/90 via-pink-50/90 to-purple-50/90 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-white/30 p-8">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              🔍 Filtros de Búsqueda
            </h2>
            <p className="text-gray-600 text-lg">
              Busca propiedades por nombre, dirección o rango de precios
            </p>
          </div>
          <PropertyFilters
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
            initialFilters={filters}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-8">
          <ErrorMessage
            message="Error al cargar las propiedades. Por favor, inténtalo de nuevo."
            variant="error"
          />
          <div className="mt-4 flex justify-center">
            <Button onClick={() => refetch()}>Reintentar</Button>
          </div>
        </div>
      ) : (
        <PropertyList
          filters={filters}
          onPropertyClick={handlePropertyClick}
          onEditProperty={handleEditProperty}
          onDeleteProperty={handleDeleteProperty}
        />
      )}

      {/* Create Property Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva Propiedad"
        size="lg"
      >
        <PropertyForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createPropertyMutation.isPending}
        />
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Propiedad"
        size="lg"
      >
        <PropertyForm
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={editingProperty || undefined}
          isLoading={updatePropertyMutation.isPending}
        />
      </Modal>
    </div>
  );
};
