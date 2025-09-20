"use client";

import React from "react";
import { Button } from "@/components/atoms";
import { OwnerDetail } from "@/components/molecules";

interface OwnerDetailViewProps {
  owner: any; // OwnerDetail type
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  backButtonText?: string;
  className?: string;
}

/**
 * OwnerDetailView Component - Organism Level
 * Displays owner details (UI only, no data fetching)
 * Follows Single Responsibility Principle - only handles owner detail display
 */
export const OwnerDetailView: React.FC<OwnerDetailViewProps> = ({
  owner,
  onBack,
  onEdit,
  onDelete,
  backButtonText = "Volver a la lista",
  className,
}) => {
  return (
    <div className={className}>
      <div className="mb-6 flex items-center justify-between">
        {onBack && (
          <Button
            variant="ghost"
            onClick={onBack}
            className="flex items-center text-blue-600 hover:text-blue-500"
          >
            <span className="mr-2">←</span>
            {backButtonText}
          </Button>
        )}
      </div>

      <OwnerDetail owner={owner} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
};
