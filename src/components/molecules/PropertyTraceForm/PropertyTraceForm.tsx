"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/atoms";
import {
  Calendar,
  DollarSign,
  User,
  Receipt,
  Calculator,
  Info,
} from "lucide-react";
import {
  formatCurrency,
  calculatePropertyTransferTax,
  formatUVT,
  getBracketDescription,
} from "@/lib/utils";
import type {
  CreatePropertyTraceRequest,
  PropertyTraceListItem,
} from "@/lib/types";

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
  propertyValue?: number; // Valor de la propiedad para pre-cargar
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
  propertyValue,
  className,
}) => {
  const [showTaxBreakdown, setShowTaxBreakdown] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
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
          value: propertyValue || 0,
          tax: 0,
          idProperty: "",
        },
  });

  // Watch the value field for automatic tax calculation
  const watchedValue = watch("value");

  // Calculate tax automatically when value changes
  useEffect(() => {
    if (watchedValue && watchedValue > 0) {
      console.log("Calculating tax for value:", watchedValue);
      const taxCalculation = calculatePropertyTransferTax(watchedValue);
      console.log("Tax calculation result:", taxCalculation);
      setValue("tax", taxCalculation.taxAmount);
      console.log("Tax field set to:", taxCalculation.taxAmount);
    }
  }, [watchedValue, setValue]);

  // Get current tax calculation for display
  const currentTaxCalculation =
    watchedValue && watchedValue > 0
      ? calculatePropertyTransferTax(watchedValue)
      : null;

  const handleFormSubmit = (data: PropertyTraceFormData) => {
    console.log("PropertyTraceForm handleFormSubmit called with data:", data);
    console.log("Form validation errors:", errors);
    const submitData = {
      dateSale: data.dateSale,
      name: data.name || undefined,
      value: data.value,
      tax: data.tax,
      idProperty: data.idProperty,
    };
    console.log("PropertyTraceForm calling onSubmit with:", submitData);
    onSubmit(submitData);
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-6 ${className}`}
    >
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
            label="Valor de Venta de la Propiedad"
            placeholder="0"
            leftIcon={<DollarSign className="w-4 h-4" />}
            {...register("value", { valueAsNumber: true })}
            error={errors.value?.message}
            disabled={true}
            className="bg-gray-50"
          />
          <p className="mt-1 text-xs text-gray-500">
            Este valor se toma automáticamente del precio de venta de la
            propiedad
          </p>
        </div>

        {/* Tax - Auto-calculated */}
        <div>
          <Input
            id="tax"
            type="number"
            label="Impuestos"
            placeholder="0"
            leftIcon={<Calculator className="w-4 h-4" />}
            {...register("tax", { valueAsNumber: true })}
            error={errors.tax?.message}
            disabled={true}
            className="bg-gray-50"
          />
          {currentTaxCalculation && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setShowTaxBreakdown(!showTaxBreakdown)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-500"
              >
                <Info className="w-4 h-4 mr-1" />
                Ver desglose del cálculo
              </button>
            </div>
          )}
        </div>

        {/* Property ID (hidden field) */}
        <input type="hidden" {...register("idProperty")} />
      </div>

      {/* Tax Breakdown */}
      {showTaxBreakdown && currentTaxCalculation && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
            <Calculator className="w-4 h-4 mr-2" />
            Desglose del Cálculo de Impuestos
          </h4>

          <div className="space-y-3 text-sm">
            {/* Property Value */}
            <div className="flex justify-between">
              <span className="text-gray-600">Valor de la propiedad:</span>
              <span className="font-medium">
                {formatCurrency(currentTaxCalculation.valueInCOP)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Equivalente en UVT:</span>
              <span className="font-medium">
                {formatUVT(currentTaxCalculation.valueInUVT)} UVT
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Franja de impuestos:</span>
              <span className="font-medium text-blue-700">
                {getBracketDescription(currentTaxCalculation.bracket)}
              </span>
            </div>

            <hr className="border-blue-200" />

            {/* Breakdown based on bracket */}
            {currentTaxCalculation.bracket === "exempt" && (
              <div className="text-green-700">
                <div className="flex justify-between">
                  <span>Valor exento:</span>
                  <span className="font-medium">
                    {formatCurrency(currentTaxCalculation.valueInCOP)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Impuesto a pagar:</span>
                  <span className="font-medium">$0 COP</span>
                </div>
              </div>
            )}

            {currentTaxCalculation.bracket === "low" &&
              currentTaxCalculation.breakdown && (
                <div className="text-blue-700">
                  <div className="flex justify-between">
                    <span>Valor exento (hasta 20,000 UVT):</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.exemptAmount!
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Valor gravado (1.5%):</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.lowBracketAmount!
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuesto (1.5%):</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.lowBracketTax!
                      )}
                    </span>
                  </div>
                </div>
              )}

            {currentTaxCalculation.bracket === "high" &&
              currentTaxCalculation.breakdown && (
                <div className="text-purple-700">
                  <div className="flex justify-between">
                    <span>Valor exento (hasta 20,000 UVT):</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.exemptAmount!
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Franja baja (1.5%):</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.lowBracketAmount!
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Franja alta (3%):</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.highBracketAmount!
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuesto franja baja:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.lowBracketTax!
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Impuesto franja alta:</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.highBracketTax!
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Monto fijo (450 UVT):</span>
                    <span className="font-medium">
                      {formatCurrency(
                        currentTaxCalculation.breakdown.fixedAmount!
                      )}
                    </span>
                  </div>
                </div>
              )}

            <hr className="border-blue-200" />

            <div className="flex justify-between font-semibold text-blue-900">
              <span>Total impuesto a pagar:</span>
              <span>{formatCurrency(currentTaxCalculation.taxAmount)}</span>
            </div>
          </div>
        </div>
      )}

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
