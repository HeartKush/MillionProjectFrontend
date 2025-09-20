"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/atoms";
import { MapPin, Filter, User } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OwnerFilters } from "@/lib/types";

const ownerFilterSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
});

type OwnerFilterFormData = z.infer<typeof ownerFilterSchema>;

interface OwnerFilterFormProps {
  onFiltersChange: (filters: OwnerFilters) => void;
  initialFilters?: OwnerFilters;
  className?: string;
}

/**
 * OwnerFilterForm Component - Molecular Level
 * Combines Input atoms with form logic for owner filtering
 * Follows Single Responsibility Principle - only handles owner filtering
 */
export const OwnerFilterForm: React.FC<OwnerFilterFormProps> = ({
  onFiltersChange,
  initialFilters = {},
  className,
}) => {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<OwnerFilterFormData>({
    resolver: zodResolver(ownerFilterSchema),
    defaultValues: initialFilters,
  });

  const watchedValues = watch();

  // Auto-submit form when values change (debounced)
  React.useEffect(() => {
    if (Object.keys(watchedValues).length === 0) return;

    const timer = setTimeout(() => {
      const result = ownerFilterSchema.safeParse(watchedValues);
      if (result.success) {
        onFiltersChange(result.data);
      } else {
        onFiltersChange(watchedValues);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [watchedValues, onFiltersChange]);

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
            Encuentra el propietario que buscas
          </p>
        </div>
      </div>

      <form className="space-y-6" role="form">
        {/* Search filters grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name filter */}
          <Input
            id="name"
            data-testid="input-name"
            label="Nombre del Propietario"
            placeholder="Buscar por nombre..."
            leftIcon={<User className="w-4 h-4" />}
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
        </div>
      </form>
    </div>
  );
};
