"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from "@/components/layouts/AppLayout";
import { OwnerList } from "@/components/organisms";
import { OwnerFilterForm } from "@/components/molecules";
import { OwnerForm } from "@/components/molecules";
import {
  Modal,
  Button,
  LoadingSpinner,
  ErrorMessage,
} from "@/components/atoms";
import { useOwners, useCreateOwner } from "@/lib/hooks";
import { Plus, Users, UserCheck, Calendar } from "lucide-react";
import type { CreateOwnerRequest, OwnerFilters } from "@/lib/types";
import { useToastHelpers } from "@/contexts/ToastContext";

/**
 * Owner List Page - Complete CRUD management for owners
 * Follows Single Responsibility Principle - handles all owner management logic
 */
export default function OwnerListPage() {
  const router = useRouter();
  const { showSuccess, showError } = useToastHelpers();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filters, setFilters] = useState<OwnerFilters>({});

  const { data: owners, isLoading, error, refetch } = useOwners(filters);
  const createOwnerMutation = useCreateOwner();

  // Calculate stats
  const stats = React.useMemo(() => {
    if (!owners) return { total: 0, active: 0, recent: 0 };

    const total = owners.length;
    const active = owners.length; // Assuming all are active for now
    const recent = owners.filter((owner) => {
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

  const handleViewOwner = (ownerId: string) => {
    router.push(`/propietarios/${ownerId}`);
  };

  const handleCreateSubmit = (data: CreateOwnerRequest) => {
    createOwnerMutation.mutate(data, {
      onSuccess: () => {
        showSuccess(
          "Propietario creado",
          "El nuevo propietario ha sido creado correctamente."
        );
        setIsCreateModalOpen(false);
        refetch();
      },
      onError: (error) => {
        showError(
          "Error al crear",
          "No se pudo crear el propietario. Inténtalo de nuevo."
        );
      },
    });
  };

  return (
    <AppLayout>
      <div data-testid="owner-management">
        {/* Header with stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Gestión de Propietarios
              </h1>
              <p className="text-gray-600 text-lg">
                Administra y organiza tu base de datos de propietarios
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
                  <p className="text-sm text-gray-500 mb-1">
                    Total Propietarios
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.total}
                  </p>
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
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.active}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="stats-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Recientes</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.recent}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <OwnerFilterForm
            onFiltersChange={setFilters}
            initialFilters={filters}
          />
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner
              size="lg"
              variant="pulse"
              text="Cargando propietarios..."
            />
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
          <OwnerList owners={owners || []} onViewOwner={handleViewOwner} />
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
      </div>
    </AppLayout>
  );
}
