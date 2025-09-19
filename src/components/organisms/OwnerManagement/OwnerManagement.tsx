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
import { Plus, Users, UserCheck, Calendar, Phone } from "lucide-react";
import type {
  OwnerListItem,
  OwnerDetail,
  CreateOwnerRequest,
} from "@/lib/types";

interface OwnerManagementProps {
  className?: string;
}

/**
 * Enhanced OwnerManagement Component - Organism Level
 * Complete CRUD management for owners with improved UX
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

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!owners) return { total: 0, active: 0, recent: 0 };
    
    const total = owners.length;
    const active = owners.length; // Assuming all are active for now
    const recent = owners.filter(owner => {
      if (!owner.birthday) return false;
      const birthDate = new Date(owner.birthday);
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return birthDate > oneMonthAgo;
    }).length;
    
    return { total, active, recent };
  }, [owners]);

  const handleCreateOwner = () => {
    setIsCreateModalOpen(true);
  };

  const handleEditOwner = (owner: OwnerListItem) => {
    if (owner.idOwner) {
      setSelectedOwnerId(owner.idOwner);
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
    if (window.confirm("¿Estás seguro de que quieres eliminar este propietario?")) {
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

  // Owner detail view
  if (selectedOwner) {
    return (
      <div data-testid="owner-management" className={className}>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Owner photo and basic info */}
            <div className="text-center">
              <div className="relative inline-block mb-6">
                {selectedOwner.photo ? (
                  <img
                    src={selectedOwner.photo}
                    alt={selectedOwner.name || "Propietario"}
                    className="w-32 h-32 rounded-full object-cover shadow-xl ring-4 ring-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-white">
                    <span className="text-white font-bold text-4xl">
                      {selectedOwner.name?.charAt(0) || "?"}
                    </span>
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-white" />
                </div>
              </div>
              
              <h1 className="text-2xl font-bold gradient-text mb-2">
                {selectedOwner.name || "Sin nombre"}
              </h1>
              <p className="text-gray-500">Propietario</p>
            </div>

            {/* Owner details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="stats-card">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Información Personal</h3>
                      <p className="text-sm text-gray-500">Datos del propietario</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Dirección</label>
                      <p className="text-gray-900">{selectedOwner.address || "No especificada"}</p>
                    </div>
                  </div>
                </div>

                <div className="stats-card">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Fecha de Nacimiento</h3>
                      <p className="text-sm text-gray-500">Información adicional</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Nacimiento</label>
                      <p className="text-gray-900">
                        {selectedOwner.birthday
                          ? new Date(selectedOwner.birthday).toLocaleDateString("es-CO", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })
                          : "No especificada"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex space-x-3 pt-6 border-t border-gray-100">
                <Button
                  variant="primary"
                  onClick={() => handleEditOwner(selectedOwner)}
                  icon={<Edit className="w-4 h-4" />}
                >
                  Editar Propietario
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteOwner(selectedOwner.idOwner!)}
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
    <div data-testid="owner-management" className={className}>
      {/* Header with stats */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              Gestión de Propietarios
            </h1>
            <p className="text-gray-600 text-lg">
              Administra la información de tus propietarios
            </p>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateOwner}
            icon={<Plus className="w-5 h-5" />}
            className="animate-pulse-glow"
          >
            Nuevo Propietario
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Propietarios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Activos</p>
                <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="stats-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Registros Recientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.recent}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <LoadingSpinner size="lg" variant="pulse" text="Cargando propietarios..." />
        </div>
      ) : error ? (
        <div className="card-elevated p-8 text-center">
          <ErrorMessage
            message="Error al cargar los propietarios. Por favor, inténtalo de nuevo."
            variant="error"
          />
          <div className="mt-6">
            <Button onClick={() => refetch()} variant="primary">
              Reintentar
            </Button>
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