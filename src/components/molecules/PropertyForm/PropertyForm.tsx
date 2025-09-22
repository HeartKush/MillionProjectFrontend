"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button, Select } from "@/components/atoms";
import type {
  CreatePropertyRequest,
  PropertyDetail,
  OwnerListItem,
} from "@/lib/types";

const propertySchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  address: z.string().min(1, "La dirección es obligatoria"),
  price: z.number().min(0, "El precio debe ser mayor a 0"),
  codeInternal: z.string().optional(),
  year: z
    .number()
    .min(1900, "El año debe ser válido")
    .max(new Date().getFullYear() + 1, "El año no puede ser futuro"),
  idOwner: z.string().min(1, "Debe seleccionar un propietario"),
  imageUrl: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
});

type PropertyFormData = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  onSubmit: (data: CreatePropertyRequest) => void;
  onCancel: () => void;
  initialData?: PropertyDetail;
  isLoading?: boolean;
  owners: OwnerListItem[];
  ownersLoading?: boolean;
  className?: string;
}

/**
 * PropertyForm Component - Molecular Level
 * Form for creating and editing properties
 * Follows Single Responsibility Principle - only handles property form logic
 */
export const PropertyForm: React.FC<PropertyFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  owners,
  ownersLoading = false,
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: initialData?.name || "",
      address: initialData?.address || "",
      price: initialData?.price || 0,
      codeInternal: initialData?.codeInternal || "",
      year: initialData?.year || new Date().getFullYear(),
      idOwner: initialData?.idOwner || "",
      imageUrl: initialData?.imageUrl || "",
    },
  });

  const handleFormSubmit = (data: PropertyFormData) => {
    const propertyData: CreatePropertyRequest = {
      name: data.name,
      address: data.address,
      price: data.price,
      codeInternal: data.codeInternal || undefined,
      year: data.year,
      idOwner: data.idOwner,
      imageUrl: data.imageUrl || undefined,
      imageEnabled: true,
    };
    onSubmit(propertyData);
  };

  return (
    <form
      data-testid="property-form"
      className={`space-y-4 ${className}`}
      onSubmit={handleSubmit(handleFormSubmit)}
      role="form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nombre de la Propiedad *
          </label>
          <Input
            id="name"
            data-testid="input-name"
            placeholder="Nombre de la propiedad"
            {...register("name")}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="codeInternal"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Código Interno
          </label>
          <Input
            id="codeInternal"
            data-testid="input-codeInternal"
            placeholder="Código interno"
            {...register("codeInternal")}
            error={errors.codeInternal?.message}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="address"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Dirección *
        </label>
        <Input
          id="address"
          data-testid="input-address"
          placeholder="Dirección completa de la propiedad"
          {...register("address")}
          error={errors.address?.message}
          disabled={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Precio (COP) *
          </label>
          <Input
            id="price"
            data-testid="input-price"
            type="number"
            placeholder="0"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="year"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Año *
          </label>
          <Input
            id="year"
            data-testid="input-year"
            type="number"
            placeholder="2024"
            {...register("year", { valueAsNumber: true })}
            error={errors.year?.message}
            disabled={isLoading}
          />
        </div>

        <Select
          id="idOwner"
          data-testid="input-ownerId"
          label="Propietario"
          placeholder="Seleccionar"
          {...register("idOwner")}
          error={errors.idOwner?.message}
          disabled={isLoading || ownersLoading}
          required
        >
          {owners.map((owner) => (
            <option key={owner.idOwner} value={owner.idOwner}>
              {owner.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <label
          htmlFor="imageUrl"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Imagen (URL)
        </label>
        <Input
          id="imageUrl"
          data-testid="input-imageUrl"
          type="url"
          placeholder="https://ejemplo.com/imagen.jpg"
          {...register("imageUrl")}
          error={errors.imageUrl?.message}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
        </Button>
      </div>
    </form>
  );
};
