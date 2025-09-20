"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDeleteOwner, useUpdateOwner, useOwner } from "@/lib/hooks";
import { AppLayout } from "@/components/layouts/AppLayout";
import { OwnerDetailView } from "@/components/organisms/OwnerDetailView";
import {
  Modal,
  LoadingSpinner,
  ErrorMessage,
  Button,
} from "@/components/atoms";
import { OwnerForm } from "@/components/molecules";

interface OwnerDetailPageProps {
  params: {
    id: string;
  };
}

/**
 * Owner Detail Page - Dynamic route for individual owner details
 * Handles data fetching and state management
 */
export default function OwnerDetailPage({ params }: OwnerDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if we came from a property detail page
  const fromProperty = searchParams?.get("from");
  const propertyId = searchParams?.get("propertyId");

  const { data: owner, isLoading, error, refetch } = useOwner(params.id);
  const deleteOwnerMutation = useDeleteOwner();
  const updateOwnerMutation = useUpdateOwner();

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleBack = () => {
    if (fromProperty === "property" && propertyId) {
      router.push(`/propiedades/${propertyId}`);
    } else {
      router.push("/propietarios");
    }
  };

  const handleDelete = () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este propietario?")
    ) {
      deleteOwnerMutation.mutate(params.id, {
        onSuccess: () => {
          if (fromProperty === "property" && propertyId) {
            router.push(`/propiedades/${propertyId}`);
          } else {
            router.push("/propietarios");
          }
        },
      });
    }
  };

  const handleEditSubmit = (data: any) => {
    updateOwnerMutation.mutate(
      { id: params.id, owner: data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          refetch(); // Refetch owner data after successful update
        },
      }
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="py-8">
          <ErrorMessage
            message="Error al cargar los detalles del propietario. Por favor, inténtalo de nuevo."
            variant="error"
          />
          <div className="mt-4 flex justify-center space-x-2">
            <Button onClick={() => refetch()} variant="primary">
              Reintentar
            </Button>
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-blue-600 hover:text-blue-500"
            >
              {fromProperty === "property"
                ? "Volver a la propiedad"
                : "Volver a la lista"}
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!owner) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            Propietario no encontrado
          </div>
          <p className="text-gray-400 mb-4">
            El propietario que buscas no existe o ha sido eliminado
          </p>
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-blue-600 hover:text-blue-500"
          >
            {fromProperty === "property"
              ? "Volver a la propiedad"
              : "Volver a la lista"}
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <OwnerDetailView
        owner={owner}
        onBack={handleBack}
        onEdit={handleEdit}
        onDelete={handleDelete}
        backButtonText={
          fromProperty === "property"
            ? "Volver a la propiedad"
            : "Volver a la lista"
        }
      />

      {/* Edit Owner Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Propietario"
        size="md"
      >
        <OwnerForm
          onSubmit={handleEditSubmit}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={{ idOwner: params.id }}
          isLoading={updateOwnerMutation.isPending}
        />
      </Modal>
    </AppLayout>
  );
}
