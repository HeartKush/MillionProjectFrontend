import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { propertyService } from "@/lib/api/propertyService";
import type {
  PropertyFilters,
  CreatePropertyRequest,
  PropertyDetail,
} from "@/lib/types";

/**
 * Custom hook for property queries
 * Follows Single Responsibility Principle - only handles property data fetching
 */
export const useProperties = (filters: PropertyFilters = {}) => {
  return useQuery({
    queryKey: ["properties", filters],
    queryFn: () => propertyService.searchProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    // retry is handled by QueryClient default options
  });
};

/**
 * Custom hook for fetching a single property
 */
export const useProperty = (id: string | undefined) => {
  return useQuery({
    queryKey: ["property", id],
    queryFn: () => propertyService.getPropertyById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    // retry is handled by QueryClient default options
  });
};

/**
 * Custom hook for creating properties
 */
export const useCreateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (property: CreatePropertyRequest) =>
      propertyService.createProperty(property),
    onSuccess: () => {
      // Invalidate and refetch properties list
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) => {
      console.error("Error creating property:", error);
    },
  });
};

/**
 * Custom hook for property filters
 * Manages filter state and provides debounced search
 */
export const usePropertyFilters = () => {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<PropertyFilters>({});

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const updateFilter = (
    key: keyof PropertyFilters,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({});
    setDebouncedFilters({});
  };

  return {
    filters,
    debouncedFilters,
    updateFilter,
    clearFilters,
  };
};

/**
 * Custom hook for updating properties
 */
export const useUpdateProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      property,
    }: {
      id: string;
      property: CreatePropertyRequest;
    }) => propertyService.updateProperty(id, property),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) => {
      console.error("Error updating property:", error);
    },
  });
};

/**
 * Custom hook for deleting properties
 */
export const useDeleteProperty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => propertyService.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
    onError: (error) => {
      console.error("Error deleting property:", error);
    },
  });
};
