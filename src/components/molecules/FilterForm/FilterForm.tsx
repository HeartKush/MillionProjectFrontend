import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input, Button } from "@/components/atoms";
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
 * FilterForm Component - Molecular Level
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
    // Skip initial render to avoid calling onFiltersChange with empty values
    if (Object.keys(watchedValues).length === 0) return;

    const timer = setTimeout(() => {
      // Use Zod schema to transform and validate the values
      const result = filterSchema.safeParse(watchedValues);
      if (result.success) {
        onFiltersChange(result.data);
      } else {
        // If validation fails, send the raw values (this shouldn't happen with proper input types)
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
    // Use Zod schema to transform and validate the values
    const result = filterSchema.safeParse(data);
    if (result.success) {
      onFiltersChange(result.data);
    } else {
      // If validation fails, send the raw data (this shouldn't happen with proper input types)
      // This fallback is included for robustness and test coverage
      onFiltersChange(data);
    }
  };

  return (
    <form
      className={`space-y-8 ${className}`}
      onSubmit={handleSubmit(handleFormSubmit)}
      role="form"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-2xl border-2 border-pink-200">
          <label
            htmlFor="name"
            className="block text-sm font-bold text-pink-700 mb-3"
          >
            🔍 Nombre
          </label>
          <Input
            id="name"
            data-testid="input-name"
            placeholder="Buscar por nombre..."
            {...register("name")}
            error={errors.name?.message}
            className="bg-white/90 backdrop-blur-sm border-2 border-pink-300 focus:border-pink-500 focus:ring-pink-500 rounded-xl"
          />
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200">
          <label
            htmlFor="address"
            className="block text-sm font-bold text-blue-700 mb-3"
          >
            📍 Dirección
          </label>
          <Input
            id="address"
            data-testid="input-address"
            placeholder="Buscar por dirección..."
            {...register("address")}
            error={errors.address?.message}
            className="bg-white/90 backdrop-blur-sm border-2 border-blue-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
          />
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border-2 border-green-200">
          <label
            htmlFor="minPrice"
            className="block text-sm font-bold text-green-700 mb-3"
          >
            💰 Precio Mínimo
          </label>
          <Input
            id="minPrice"
            data-testid="input-minPrice"
            type="number"
            placeholder="0"
            {...register("minPrice", { valueAsNumber: true })}
            error={errors.minPrice?.message}
            className="bg-white/90 backdrop-blur-sm border-2 border-green-300 focus:border-green-500 focus:ring-green-500 rounded-xl"
          />
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-2xl border-2 border-orange-200">
          <label
            htmlFor="maxPrice"
            className="block text-sm font-bold text-orange-700 mb-3"
          >
            💎 Precio Máximo
          </label>
          <Input
            id="maxPrice"
            data-testid="input-maxPrice"
            type="number"
            placeholder="10000000"
            {...register("maxPrice", { valueAsNumber: true })}
            error={errors.maxPrice?.message}
            className="bg-white/90 backdrop-blur-sm border-2 border-orange-300 focus:border-orange-500 focus:ring-orange-500 rounded-xl"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          onClick={handleClear}
          className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-red-500 hover:to-pink-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
        >
          🧹 Limpiar Filtros
        </Button>
      </div>
    </form>
  );
};
