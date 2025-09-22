"use client";

import React from "react";
import { Button, Card } from "@/components/atoms";
import { Eye, Trash2 } from "lucide-react";
import type { OwnerListItem } from "@/lib/types";

interface OwnerListProps {
  owners: OwnerListItem[];
  onViewOwner?: (id: string) => void;
  onDeleteOwner?: (id: string) => void;
  className?: string;
}

/**
 * OwnerList Component - Organism Level
 * Displays list of owners with actions (UI only, no data fetching)
 * Follows Single Responsibility Principle - only handles owner list display and actions
 */
export const OwnerList: React.FC<OwnerListProps> = ({
  owners,
  onViewOwner,
  onDeleteOwner,
  className,
}) => {
  if (owners.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg mb-4">
          No hay propietarios registrados
        </div>
        <p className="text-gray-400">
          Crea tu primer propietario para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {owners.map((owner) => (
          <Card
            key={owner.idOwner}
            title={owner.name || "Sin nombre"}
            subtitle={owner.address || "Sin dirección"}
            actions={
              <div className="flex space-x-2">
                {onViewOwner && owner.idOwner && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onViewOwner(owner.idOwner!)}
                    icon={<Eye className="w-4 h-4" />}
                    fullWidth
                  >
                    Ver Detalles
                  </Button>
                )}
                {onDeleteOwner && owner.idOwner && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => onDeleteOwner(owner.idOwner!)}
                    icon={<Trash2 className="w-4 h-4" />}
                  />
                )}
              </div>
            }
            variant="elevated"
            padding="sm"
            className="owner-card"
          >
            <div className="flex justify-center mb-3">
              {owner.photo ? (
                <img
                  src={owner.photo}
                  alt={owner.name || "Propietario"}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    // Si la imagen falla al cargar, la reemplazamos con el avatar de iniciales
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    const parent = target.parentElement;
                    if (parent) {
                      const fallbackAvatar = parent.querySelector(
                        ".fallback-avatar"
                      ) as HTMLElement;
                      if (fallbackAvatar) {
                        fallbackAvatar.style.display = "flex";
                      }
                    }
                  }}
                />
              ) : null}
              <div
                className={`w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center ${
                  owner.photo ? "fallback-avatar hidden" : ""
                }`}
              >
                <span className="text-white font-bold text-lg">
                  {owner.name?.charAt(0) || "?"}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
