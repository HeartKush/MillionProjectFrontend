"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/atoms";
import { Calendar, DollarSign, User, Receipt } from "lucide-react";
import type { CreatePropertyTraceRequest, PropertyTraceListItem } from "@/lib/types";

const propertyTraceSchema = z.object({
  dateSale: z.string().min(1, "La fecha de venta es obligatoria"),
  name: z.string().optional(),
  value: z.number().min(0, "El valor debe ser mayor o igual a 0"),
  tax: z.number().min(0, "El impuesto debe ser mayor o igual a 0"),
  idProperty: z.string().min(1, "El ID de propiedad es obligatorio"),
});

type PropertyTraceFormData = z.infer<typeof propertyTraceSchema>;

interface PropertyTraceFormProps {
  onSubmit: (data: CreatePropertyTraceRequest) => void;
  onCancel: () => void;
  initialData?: PropertyTraceListItem;
  isLoading?: boolean;
  className?: string;
}

/**
 * PropertyTraceForm Component - Molecular Level
 * Form for creating and editing property traces (transactions)
 * Follows Single Responsibility Principle - only handles property trace form logic
 */
export const PropertyTraceForm: React.FC<PropertyTraceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false,
  className,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PropertyTraceFormData>({
    resolver: zodResolver(propertyTraceSchema),
    defaultValues: initialData
      ? {
          dateSale: initialData.dateSale,
          name: initialData.name || "",
          value: initialData.value,
          tax: initialData.tax,
          idProperty: initialData.idProperty || "",
        }
      : {
          dateSale: new Date().toISOString().split("T")[0], // Today's date
          name: "",
          value: 0,
          tax: 0,
          idProperty: "",
        },
  });

  const handleFormSubmit = (data: PropertyTraceFormData) => {
    onSubmit({
      dateSale: data.dateSale,
      name: data.name || undefined,
      value: data.value,
      tax: data.tax,
      idProperty: data.idProperty,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
          <Receipt className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            {initialData ? "Editar Transacción" : "Nueva Transacción"}
          </h3>
          <p className="text-sm text-gray-500">
            {initialData
              ? "Modifica los datos de la transacción"
              : "Registra una nueva venta o transacción"}
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Date Sale */}
        <div className="md:col-span-2">
          <Input
            id="dateSale"
            type="date"
            label="Fecha de Venta"
            leftIcon={<Calendar className="w-4 h-4" />}
            {...register("dateSale")}
            error={errors.dateSale?.message}
            disabled={isLoading}
            required
          />
        </div>

        {/* Buyer Name */}
        <div className="md:col-span-2">
          <Input
            id="name"
            label="Nombre del Comprador"
            placeholder="Ej: Juan Pérez"
            leftIcon={<User className="w-4 h-4" />}
            {...register("name")}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </div>

        {/* Value */}
        <div>
          <Input
            id="value"
            type="number"
            label="Valor de Venta"
            placeholder="0"
            leftIcon={<DollarSign className="w-4 h-4" />}
            {...register("value", { valueAsNumber: true })}
            error={errors.value?.message}
            disabled={isLoading}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Tax */}
        <div>
          <Input
            id="tax"
            type="number"
            label="Impuestos"
            placeholder="0"
            leftIcon={<Receipt className="w-4 h-4" />}
            {...register("tax", { valueAsNumber: true })}
            error={errors.tax?.message}
            disabled={isLoading}
            required
            min="0"
            step="0.01"
          />
        </div>

        {/* Property ID (hidden field) */}
        <input type="hidden" {...register("idProperty")} />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isLoading}
          className="px-6"
        >
          {isLoading
            ? "Guardando..."
            : initialData
            ? "Actualizar Transacción"
            : "Crear Transacción"}
        </Button>
      </div>
    </form>
  );
};
