"use client";

import React from "react";
import { OwnerCard } from "@/components/molecules";
import type { OwnerListItem } from "@/lib/types";

interface OwnerListProps {
  owners: OwnerListItem[];
  onViewOwner?: (id: string) => void;
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
          <OwnerCard
            key={owner.idOwner}
            owner={owner}
            onViewOwner={onViewOwner}
          />
        ))}
      </div>
    </div>
  );
};
