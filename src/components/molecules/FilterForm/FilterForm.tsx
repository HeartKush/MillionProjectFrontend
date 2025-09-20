"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/atoms";
import { MapPin, DollarSign, RotateCcw, Filter, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PropertyFilters } from "@/lib/types";

const filterSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  minPrice: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
  maxPrice: z
    .number()
    .min(0)
    .optional()
    .or(z.nan().transform(() => undefined)),
});

type FilterFormData = z.infer<typeof filterSchema>;

interface FilterFormProps {
  onFiltersChange: (filters: PropertyFilters) => void;
  onClearFilters: () => void;
  initialFilters?: PropertyFilters;
  className?: string;
}

/**
 * Enhanced FilterForm Component - Molecular Level
 * Combines Input atoms with form logic
 * Follows Single Responsibility Principle - only handles property filtering
 */
export const FilterForm: React.FC<FilterFormProps> = ({
  onFiltersChange,
  onClearFilters,
  initialFilters = {},
  className,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<FilterFormData>({
    resolver: zodResolver(filterSchema),
    defaultValues: initialFilters,
  });

  const watchedValues = watch();

  // Auto-submit form when values change (debounced)
  React.useEffect(() => {
    if (Object.keys(watchedValues).length === 0) return;

    const timer = setTimeout(() => {
      const result = filterSchema.safeParse(watchedValues);
      if (result.success) {
        onFiltersChange(result.data);
      } else {
        onFiltersChange(watchedValues);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedValues, onFiltersChange]);

  const handleClear = () => {
    reset();
    onClearFilters();
  };

  const handleFormSubmit = (data: FilterFormData) => {
    const result = filterSchema.safeParse(data);
    if (result.success) {
      onFiltersChange(result.data);
    } else {
      onFiltersChange(data);
    }
  };

  return (
    <div className={cn("card-elevated p-6", className)}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">
            Filtros de Búsqueda
          </h3>
          <p className="text-sm text-gray-500">
            Encuentra la propiedad perfecta
          </p>
        </div>
      </div>

      <form
        className="space-y-6"
        onSubmit={handleSubmit(handleFormSubmit)}
        role="form"
      >
        {/* Search filters grid */}
        <div className="filter-form">
          {/* Name filter */}
          <Input
            id="name"
            data-testid="input-name"
            label="Nombre de la Propiedad"
            placeholder="Buscar por nombre..."
            leftIcon={<Home className="w-4 h-4" />}
            {...register("name")}
            error={errors.name?.message}
          />

          {/* Address filter */}
          <Input
            id="address"
            data-testid="input-address"
            label="Dirección"
            placeholder="Buscar por dirección..."
            leftIcon={<MapPin className="w-4 h-4" />}
            {...register("address")}
            error={errors.address?.message}
          />

          {/* Min price filter */}
          <Input
            id="minPrice"
            data-testid="input-minPrice"
            type="number"
            label="Precio Mínimo"
            placeholder="0"
            leftIcon={<DollarSign className="w-4 h-4" />}
            {...register("minPrice", { valueAsNumber: true })}
            error={errors.minPrice?.message}
          />

          {/* Max price filter */}
          <Input
            id="maxPrice"
            data-testid="input-maxPrice"
            type="number"
            label="Precio Máximo"
            placeholder="Sin límite"
            leftIcon={<DollarSign className="w-4 h-4" />}
            {...register("maxPrice", { valueAsNumber: true })}
            error={errors.maxPrice?.message}
          />
        </div>

        {/* Action buttons */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClear}
            icon={<RotateCcw className="w-4 h-4" />}
            className="text-blue-600 hover:text-blue-500 hover:bg-blue-50"
          >
            Limpiar Filtros
          </Button>
        </div>
      </form>
    </div>
  );
};
