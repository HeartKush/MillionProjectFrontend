"use client";

import React from "react";
import { Button } from "@/components/atoms";
import { PropertyListByOwner } from "@/components/molecules";
import { Edit, Trash2, Users, UserCheck, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { OwnerDetail as OwnerDetailType } from "@/lib/types";

interface OwnerDetailProps {
  owner: OwnerDetailType;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

/**
 * OwnerDetail Component - Molecular Level
 * Displays detailed owner information with original design
 * Follows Single Responsibility Principle - only handles owner detail display
 */
export const OwnerDetail: React.FC<OwnerDetailProps> = ({
  owner,
  onEdit,
  onDelete,
  className,
}) => {
  return (
    <div className={className}>
      <div className="card-elevated p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Owner photo and basic info */}
          <div className="text-center">
            <div className="relative inline-block mb-6">
              {owner.photo ? (
                <img
                  src={owner.photo}
                  alt={owner.name || "Propietario"}
                  className="w-32 h-32 rounded-full object-cover shadow-xl ring-4 ring-white"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl ring-4 ring-white">
                  <span className="text-white font-bold text-4xl">
                    {owner.name?.charAt(0) || "?"}
                  </span>
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
            </div>

            <h1 className="text-2xl font-bold gradient-text mb-2">
              {owner.name || "Sin nombre"}
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
                    <h3 className="font-semibold text-gray-900">
                      Información Personal
                    </h3>
                    <p className="text-sm text-gray-500">
                      Datos del propietario
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Dirección
                    </label>
                    <p className="text-gray-900">
                      {owner.address || "No especificada"}
                    </p>
                  </div>
                  {owner.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        Teléfono
                      </label>
                      <p className="text-gray-900">{owner.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {owner.birthday && (
                <div className="stats-card">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Fecha de Nacimiento
                      </h3>
                      <p className="text-sm text-gray-500">
                        Detalles de nacimiento
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-900 text-lg font-bold">
                    {format(
                      new Date(owner.birthday),
                      "dd 'de' MMMM 'de' yyyy",
                      {
                        locale: es,
                      }
                    )}
                  </p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              ID del Propietario:{" "}
              <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                {owner.idOwner}
              </span>
            </div>

            <div className="flex space-x-3">
              {onEdit && (
                <Button
                  variant="primary"
                  onClick={onEdit}
                  icon={<Edit className="w-4 h-4" />}
                >
                  Editar Propietario
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={onDelete}
                  icon={<Trash2 className="w-4 h-4" />}
                >
                  Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Owner's Properties */}
      <div className="mt-8">
        <PropertyListByOwner ownerId={owner.idOwner!} ownerName={owner.name} />
      </div>
    </div>
  );
};
