"use client";

import React from "react";
import { Modal } from "@/components/atoms";
import { PropertyTraceForm } from "@/components/molecules";
import type { CreatePropertyTraceRequest, PropertyTraceListItem } from "@/lib/types";

interface PropertyTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePropertyTraceRequest) => void;
  initialData?: PropertyTraceListItem;
  isLoading?: boolean;
  propertyId: string;
}

/**
 * PropertyTraceModal Component - Molecular Level
 * Modal wrapper for PropertyTraceForm with property ID management
 * Follows Single Responsibility Principle - only handles modal logic for property traces
 */
export const PropertyTraceModal: React.FC<PropertyTraceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
  propertyId,
}) => {
  const handleFormSubmit = (data: CreatePropertyTraceRequest) => {
    // Ensure the property ID is set
    const dataWithPropertyId = {
      ...data,
      idProperty: propertyId,
    };
    onSubmit(dataWithPropertyId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Editar Transacción" : "Nueva Transacción"}
      size="lg"
    >
      <div className="p-6">
        <PropertyTraceForm
          onSubmit={handleFormSubmit}
          onCancel={onClose}
          initialData={initialData}
          isLoading={isLoading}
        />
      </div>
    </Modal>
  );
};
