import React from "react";
import { LoadingSpinner, ErrorMessage, Button } from "@/components/atoms";
import { useOwners } from "@/lib/hooks";
import type { OwnerListItem } from "@/lib/types";

interface OwnerListProps {
  onEditOwner?: (owner: OwnerListItem) => void;
  onDeleteOwner?: (id: string) => void;
  onViewOwner?: (id: string) => void;
  className?: string;
}

/**
 * OwnerList Component - Organism Level
 * Displays list of owners with actions
 * Follows Single Responsibility Principle - only handles owner list display and actions
 */
export const OwnerList: React.FC<OwnerListProps> = ({
  onEditOwner,
  onDeleteOwner,
  onViewOwner,
  className,
}) => {
  const { data: owners, isLoading, error, refetch } = useOwners();

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
          message="Error al cargar los propietarios. Por favor, inténtalo de nuevo."
          variant="error"
        />
        <div className="mt-4 flex justify-center">
          <Button onClick={() => refetch()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  if (!owners || owners.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          No se encontraron propietarios
        </div>
        <p className="text-gray-400">
          Crea el primer propietario para comenzar
        </p>
      </div>
    );
  }

  return (
    <div data-testid="owner-list" className={`space-y-8 ${className}`}>
      <div className="flex justify-between items-center">
        <div className="bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100 p-6 rounded-3xl shadow-xl border-2 border-white/50">
          <h2 className="text-4xl font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            👤 Propietarios
          </h2>
          <p className="text-gray-700 text-xl font-bold">
            ✨ {owners.length}{" "}
            {owners.length === 1
              ? "propietario registrado"
              : "propietarios registrados"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {owners.map((owner) => (
          <div
            key={owner.idOwner}
            className="group bg-gradient-to-br from-white via-cyan-50 to-blue-50 backdrop-blur-sm rounded-3xl shadow-2xl hover:shadow-3xl border-2 border-white/30 p-6 hover:scale-110 hover:rotate-1 transition-all duration-500"
          >
            <div className="flex items-center space-x-4 mb-6">
              {owner.photo ? (
                <img
                  src={owner.photo}
                  alt={owner.name || "Propietario"}
                  className="w-20 h-20 rounded-3xl object-cover shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-200 to-blue-200 flex items-center justify-center shadow-xl">
                  <span className="text-gray-700 font-black text-3xl">
                    {owner.name?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-black text-gray-900 truncate mb-2">
                  👤 {owner.name || "Sin nombre"}
                </h3>
              </div>
            </div>

            <div className="flex space-x-3">
              {onViewOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onViewOwner(owner.idOwner!)}
                  className="flex-1 bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white hover:from-cyan-600 hover:via-blue-700 hover:to-indigo-700 border-0 shadow-lg hover:shadow-xl rounded-2xl font-bold"
                >
                  👁️ Ver
                </Button>
              )}
              {onEditOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onEditOwner(owner)}
                  className="px-4 py-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 border-0 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  ✏️
                </Button>
              )}
              {onDeleteOwner && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDeleteOwner(owner.idOwner!)}
                  className="px-4 py-3 bg-gradient-to-r from-red-400 to-pink-500 text-white hover:from-red-500 hover:to-pink-600 border-0 rounded-2xl font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🗑️
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
