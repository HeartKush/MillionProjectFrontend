import React, { useState } from "react";
import { PropertyList } from "@/components/organisms";
import { PropertyFilters } from "@/components/organisms/PropertyFilters";
import { PropertyForm } from "@/components/molecules";
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
import { Plus, Home, TrendingUp, Users, DollarSign } from "lucide-react";
import type {
  PropertyFilters as PropertyFiltersType,
  PropertyListItem,
  PropertyDetail,
} from "@/lib/types";

interface PropertyManagementProps {
  className?: string;
}

/**
 * Enhanced PropertyManagement Component - Organism Level
 * Complete CRUD management for properties with improved UX
 * Follows Single Responsibility Principle - only handles property management logic
 */
export const PropertyManagement: React.FC<PropertyManagementProps> = ({
  className,
}) => {
  const [filters, setFilters] = useState<PropertyFiltersType>({});
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<PropertyDetail | null>(null);

  const {
    data: properties,
    isLoading,
    error,
    refetch,
  } = useProperties(filters);
  
  const { data: selectedProperty } = useProperty(selectedPropertyId || undefined);
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!properties) return { total: 0, avgPrice: 0, available: 0 };
    
    const total = properties.length;
    const avgPrice = total > 0 ? properties.reduce((sum, p) => sum + p.price, 0) / total : 0;
    const available = properties.length; // Assuming all are available for now
    
    return { total, avgPrice, available };
  }, [properties]);

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
    if (property.idProperty) {
      setSelectedPropertyId(property.idProperty);
      setTimeout(() => {
        if (selectedProperty) {
          setEditingProperty(selectedProperty);
          setIsEditModalOpen(true);
        }
      }, 100);
    }
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) {
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

  // Property detail view
  if (selectedProperty) {
    return (
      <div className={className}>
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={handleBackToList}
            className="mb-6"
          >
            <span className="mr-2">←</span>
            Volver a la lista
          </Button>
        </div>

        <div className="card-elevated p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Property image */}
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img
                src={selectedProperty.imageUrl || "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"}
                alt={selectedProperty.name || "Propiedad"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Property details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2">
                  {selectedProperty.name || "Sin nombre"}
                </h1>
                <p className="text-gray-600 text-lg">
                  {selectedProperty.address || "Sin dirección"}
                </p>
              </div>

              <div className="price-display text-4xl">
                {formatCurrency(selectedProperty.price)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="stats-card">
                  <div className="text-sm text-gray-500 mb-1">Año</div>
                  <div className="text-xl font-bold">{selectedProperty.year}</div>
                </div>
                <div className="stats-card">
                  <div className="text-sm text-gray-500 mb-1">Código</div>
                  <div className="text-xl font-bold">{selectedProperty.codeInternal || "N/A"}</div>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  onClick={() => handleEditProperty(selectedProperty)}
                  icon={<Edit className="w-4 h-4" />}
                >
                  Editar Propiedad
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteProperty(selectedProperty.idProperty!)}
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
  }

  return (
    <div data-testid="property-management" className={className}>
      {/* Header with stats */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Gestión de Propiedades
            </h1>
            <p className="text-gray-600 text-lg">
              Administra y organiza tu inventario inmobiliario
            </p>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateProperty}
            icon={<Plus className="w-5 h-5" />}
            className="animate-pulse-glow"
          >
            Nueva Propiedad
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Propiedades</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Home className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Precio Promedio</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(stats.avgPrice)}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Disponibles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.available}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-8">
        <PropertyFilters
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          initialFilters={filters}
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" variant="pulse" text="Cargando propiedades..." />
        </div>
      ) : error ? (
        <div className="card-elevated p-8 text-center">
          <ErrorMessage
            message="Error al cargar las propiedades. Por favor, inténtalo de nuevo."
            variant="error"
          />
          <div className="mt-6">
            <Button onClick={() => refetch()} variant="primary">
              Reintentar
            </Button>
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