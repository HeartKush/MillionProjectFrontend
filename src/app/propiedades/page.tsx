"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PropertyList } from "@/components/organisms";
import { FilterForm } from "@/components/molecules";
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
  useDeleteProperty,
  useUpdateProperty,
  useOwners,
} from "@/lib/hooks";
import { Plus, Home, TrendingUp, Users, DollarSign } from "lucide-react";
import type {
  PropertyFilters as PropertyFiltersType,
  PropertyListItem,
  PropertyDetail,
} from "@/lib/types";
import { AppLayout } from "@/components/layouts/AppLayout";
import { useToastHelpers } from "@/contexts/ToastContext";

/**
 * Properties List Page - Complete CRUD management for properties
 * Follows Single Responsibility Principle - handles all property management logic
 */
export default function PropertiesPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToastHelpers();
  const [filters, setFilters] = useState<PropertyFiltersType>({});
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
  const { data: owners, isLoading: ownersLoading } = useOwners();
  const createPropertyMutation = useCreateProperty();
  const updatePropertyMutation = useUpdateProperty();
  const deletePropertyMutation = useDeleteProperty();

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!properties) return { total: 0, totalValue: 0, averagePrice: 0 };

    const total = properties.length;
    const totalValue = properties.reduce(
      (sum, property) => sum + property.price,
      0
    );
    const averagePrice = total > 0 ? totalValue / total : 0;

    return { total, totalValue, averagePrice };
  }, [properties]);

  const handleCreateProperty = () => {
    setIsCreateModalOpen(true);
  };

  const handlePropertyClick = (propertyId: string) => {
    router.push(`/propiedades/${propertyId}`);
  };

  const handleEditProperty = (property: PropertyListItem) => {
    // Convert PropertyListItem to PropertyDetail format
    const propertyDetail: PropertyDetail = {
      idProperty: property.idProperty,
      name: property.name,
      address: property.address,
      price: property.price,
      codeInternal: "", // Will be filled from API
      year: new Date().getFullYear(), // Default value
      idOwner: property.idOwner || "",
      imageUrl: property.imageUrl,
    };
    setEditingProperty(propertyDetail);
    setIsEditModalOpen(true);
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta propiedad?")
    ) {
      deletePropertyMutation.mutate(propertyId, {
        onSuccess: () => {
          showSuccess(
            "Propiedad eliminada",
            "La propiedad ha sido eliminada correctamente."
          );
          refetch();
        },
        onError: (error) => {
          showError(
            "Error al eliminar",
            "No se pudo eliminar la propiedad. Inténtalo de nuevo."
          );
        },
      });
    }
  };

  const handleCreateSubmit = (data: any) => {
    createPropertyMutation.mutate(data, {
      onSuccess: () => {
        showSuccess(
          "Propiedad creada",
          "La nueva propiedad ha sido creada correctamente."
        );
        setIsCreateModalOpen(false);
        refetch();
      },
      onError: (error) => {
        showError(
          "Error al crear",
          "No se pudo crear la propiedad. Inténtalo de nuevo."
        );
      },
    });
  };

  const handleEditSubmit = (data: any) => {
    if (editingProperty?.idProperty) {
      updatePropertyMutation.mutate(
        { id: editingProperty.idProperty, property: data },
        {
          onSuccess: () => {
            showSuccess(
              "Propiedad actualizada",
              "Los cambios han sido guardados correctamente."
            );
            setIsEditModalOpen(false);
            setEditingProperty(null);
            refetch();
          },
          onError: (error) => {
            showError(
              "Error al actualizar",
              "No se pudieron guardar los cambios. Inténtalo de nuevo."
            );
          },
        }
      );
    }
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  return (
    <AppLayout>
      <div data-testid="property-management" className="p-6">
        {/* Header with stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Gestión de Propiedades
              </h1>
              <p className="text-gray-600 text-lg">
                Administra tu inventario inmobiliario
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
                  <p className="text-sm text-gray-500 mb-1">
                    Total Propiedades
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Valor Total</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${stats.totalValue.toLocaleString()}
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
                  <p className="text-sm text-gray-500 mb-1">Precio Promedio</p>
                  <p className="text-3xl font-bold text-gray-900">
                    ${Math.round(stats.averagePrice).toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FilterForm
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
            initialFilters={filters}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner
              size="lg"
              variant="pulse"
              text="Cargando propiedades..."
            />
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
            properties={properties || []}
            onPropertyClick={handlePropertyClick}
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
            owners={owners || []}
            ownersLoading={ownersLoading}
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
            owners={owners || []}
            ownersLoading={ownersLoading}
          />
        </Modal>
      </div>
    </AppLayout>
  );
}
 