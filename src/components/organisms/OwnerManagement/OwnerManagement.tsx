import React, { useState } from "react";
import { OwnerList } from "@/components/organisms";
import { OwnerForm } from "@/components/molecules";
import {
  Modal,
  Button,
  LoadingSpinner,
  ErrorMessage,
} from "@/components/atoms";
import {
  useOwners,
  useCreateOwner,
  useOwner,
  useDeleteOwner,
  useUpdateOwner,
} from "@/lib/hooks";
import type {
  OwnerListItem,
  OwnerDetail,
  CreateOwnerRequest,
} from "@/lib/types";

interface OwnerManagementProps {
  className?: string;
}

/**
 * OwnerManagement Component - Organism Level
 * Complete CRUD management for owners
 * Follows Single Responsibility Principle - only handles owner management logic
 */
export const OwnerManagement: React.FC<OwnerManagementProps> = ({
  className,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOwner, setEditingOwner] = useState<OwnerDetail | null>(null);
  const [selectedOwnerId, setSelectedOwnerId] = useState<string | null>(null);

  const { data: owners, isLoading, error, refetch } = useOwners();
  const { data: selectedOwner } = useOwner(selectedOwnerId || undefined);
  const createOwnerMutation = useCreateOwner();
  const updateOwnerMutation = useUpdateOwner();
  const deleteOwnerMutation = useDeleteOwner();

  const handleCreateOwner = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditOwner = (owner: OwnerListItem) => {
    // Fetch full owner details for editing
    if (owner.idOwner) {
      setSelectedOwnerId(owner.idOwner);
      // We'll use the selectedOwner data for editing
      setTimeout(() => {
        if (selectedOwner) {
          setEditingOwner(selectedOwner);
          setIsEditModalOpen(true);
        }
      }, 100);
    }
  };

  const handleViewOwner = (ownerId: string) => {
    setSelectedOwnerId(ownerId);
  };

  const handleDeleteOwner = (ownerId: string) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este propietario?")
    ) {
      deleteOwnerMutation.mutate(ownerId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handleCreateSubmit = (data: CreateOwnerRequest) => {
    createOwnerMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        refetch();
      },
    });
  };

  const handleEditSubmit = (data: CreateOwnerRequest) => {
    if (editingOwner?.idOwner) {
      updateOwnerMutation.mutate(
        { id: editingOwner.idOwner, owner: data },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setEditingOwner(null);
            setSelectedOwnerId(null);
            refetch();
          },
        }
      );
    }
  };

  const handleBackToList = () => {
    setSelectedOwnerId(null);
  };

  if (selectedOwner) {
    return (
      <div data-testid="owner-management" className={className}>
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
          <div className="flex items-center space-x-6 mb-8">
            {selectedOwner.photo ? (
              <img
                src={selectedOwner.photo}
                alt={selectedOwner.name || "Propietario"}
                className="w-24 h-24 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center shadow-lg">
                <span className="text-gray-600 font-bold text-3xl">
                  {selectedOwner.name?.charAt(0) || "?"}
                </span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent mb-2">
                {selectedOwner.name || "Sin nombre"}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
              <h3 className="text-sm font-semibold text-blue-700 mb-2 uppercase tracking-wide">
                Dirección
              </h3>
              <p className="text-gray-900 text-lg">
                {selectedOwner.address || "No especificada"}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-100">
              <h3 className="text-sm font-semibold text-green-700 mb-2 uppercase tracking-wide">
                Fecha de Nacimiento
              </h3>
              <p className="text-gray-900 text-lg">
                {selectedOwner.birthday
                  ? new Date(selectedOwner.birthday).toLocaleDateString("es-CO")
                  : "No especificada"}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="owner-management" className={className}>
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
          <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100 p-8 rounded-3xl shadow-xl border-2 border-white/50">
            <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              👤 Gestión de Propietarios
            </h1>
            <p className="text-gray-700 text-xl font-semibold">
              ✨ Administra la información de tus propietarios
            </p>
          </div>
          <Button
            variant="primary"
            onClick={handleCreateOwner}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-500 px-8 py-4 rounded-2xl text-white font-bold text-lg"
          >
            <span className="mr-3 text-2xl">✨</span>
            Nuevo Propietario
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="py-8">
          <ErrorMessage
            message="Error al cargar los propietarios. Por favor, inténtalo de nuevo."
            variant="error"
          />
          <div className="mt-4 flex justify-center">
            <Button onClick={() => refetch()}>Reintentar</Button>
          </div>
        </div>
      ) : (
        <OwnerList
          onEditOwner={handleEditOwner}
          onDeleteOwner={handleDeleteOwner}
          onViewOwner={handleViewOwner}
        />
      )}

      {/* Create Owner Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nuevo Propietario"
        size="md"
      >
        <OwnerForm
          onSubmit={handleCreateSubmit}
          onCancel={() => setIsCreateModalOpen(false)}
          isLoading={createOwnerMutation.isPending}
        />
      </Modal>

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
          initialData={editingOwner || undefined}
          isLoading={updateOwnerMutation.isPending}
        />
      </Modal>
    </div>
  );
};
