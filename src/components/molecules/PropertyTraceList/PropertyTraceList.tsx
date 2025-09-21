"use client";

import React from "react";
import { Calendar, DollarSign, User, Receipt } from "lucide-react";
import { LoadingSpinner } from "@/components/atoms";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { PropertyTraceListItem } from "@/lib/types";

interface PropertyTraceListProps {
  traces: PropertyTraceListItem[];
  isLoading?: boolean;
  error?: string;
  className?: string;
}

/**
 * PropertyTraceList Component - Molecular Level
 * Displays the transaction history (traces) of a property
 * Follows Single Responsibility Principle - only handles property trace display
 */
export const PropertyTraceList: React.FC<PropertyTraceListProps> = ({
  traces,
  isLoading,
  error,
  className,
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP", { locale: es });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className={`card-elevated p-6 ${className}`}>
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner />
          <span className="ml-3 text-gray-600">Cargando historial...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`card-elevated p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">
            <Receipt className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error al cargar historial
          </h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!traces || traces.length === 0) {
    return (
      <div className={`card-elevated p-6 ${className}`}>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <Receipt className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sin historial de transacciones
          </h3>
          <p className="text-gray-600">
            Esta propiedad no tiene registros de ventas o transacciones.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`card-elevated p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
          <Receipt className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Historial de Transacciones
          </h3>
          <p className="text-sm text-gray-500">
            {traces.length} {traces.length === 1 ? "transacción" : "transacciones"} registrada{traces.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      {/* Traces List */}
      <div className="space-y-4">
        {traces.map((trace, index) => (
          <div
            key={trace.idPropertyTrace || index}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors duration-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Date and Buyer */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Fecha de venta</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(trace.dateSale)}
                    </p>
                  </div>
                </div>
                
                {trace.name && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Comprador</p>
                      <p className="font-medium text-gray-900">{trace.name}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Value */}
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Valor de venta</p>
                  <p className="font-bold text-green-600 text-lg">
                    {formatCurrency(trace.value)}
                  </p>
                </div>
              </div>

              {/* Tax */}
              <div className="flex items-center space-x-2">
                <Receipt className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Impuestos</p>
                  <p className="font-medium text-blue-600">
                    {formatCurrency(trace.tax)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
