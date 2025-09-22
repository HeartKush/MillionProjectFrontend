"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useDeleteProperty,
  useUpdateProperty,
  useProperty,
  useOwners,
  useOwner,
} from "@/lib/hooks";
import { AppLayout } from "@/components/layouts/AppLayout";
import { PropertyDetailView } from "@/components/organisms/PropertyDetailView";
import {
  Modal,
  LoadingSpinner,
  ErrorMessage,
  Button,
} from "@/components/atoms";
import { PropertyForm } from "@/components/molecules";

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Property Detail Page - Dynamic route for individual property details
 */
export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: property, isLoading, error, refetch } = useProperty(params.id);
  const { data: owners, isLoading: ownersLoading } = useOwners();
  const { data: owner } = useOwner(property?.idOwner || "");
  const deletePropertyMutation = useDeleteProperty();
  const updatePropertyMutation = useUpdateProperty();

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar esta propiedad?")
    ) {
      deletePropertyMutation.mutate(params.id, {
        onSuccess: () => {
          router.push("/propiedades");
        },
      });
    }
  };

  const handleEditSubmit = (data: any) => {
    updatePropertyMutation.mutate(
      { id: params.id, property: data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          refetch(); // Refetch property data after successful update
        },
        onError: (error) => {
          console.error("Error updating property:", error);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" text="Cargando propiedad..." />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="py-8 text-center">
          <ErrorMessage
            message="Error al cargar los detalles de la propiedad. Por favor, inténtalo de nuevo."
            variant="error"
          />
          <div className="mt-4 flex justify-center space-x-2">
            <Button onClick={() => refetch()} variant="primary">
              Reintentar
            </Button>
            <Button
              onClick={() => router.push("/propiedades")}
              variant="ghost"
              className="text-blue-600 hover:text-blue-500"
            >
              Volver a la lista
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!property) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            Propiedad no encontrada
          </div>
          <p className="text-gray-400 mb-4">
            La propiedad que buscas no existe o ha sido eliminada
          </p>
          <Button
            onClick={() => router.push("/propiedades")}
            variant="ghost"
            className="text-blue-600 hover:text-blue-500"
          >
            Volver a la lista
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PropertyDetailView
        property={property}
        onBack={() => router.push("/propiedades")}
        onEdit={handleEdit}
        onDelete={handleDelete}
        ownerName={owner?.name}
      />

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
          initialData={property} // Pass the fetched property data
          isLoading={updatePropertyMutation.isPending}
          owners={owners || []}
          ownersLoading={ownersLoading}
        />
      </Modal>
    </AppLayout>
  );
}
