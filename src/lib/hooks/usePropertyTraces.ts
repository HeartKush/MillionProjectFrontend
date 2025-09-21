"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyTraceService } from "@/lib/api/propertyTraceService";
import type { CreatePropertyTraceRequest } from "@/lib/types";

/**
 * Custom hook for property trace queries
 * Follows Single Responsibility Principle - only handles property trace data fetching
 */
export const usePropertyTraces = (propertyId: string | undefined) => {
  return useQuery({
    queryKey: ["propertyTraces", propertyId],
    queryFn: () => propertyTraceService.getByPropertyId(propertyId!),
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Custom hook for creating property traces
 */
export const useCreatePropertyTrace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (trace: CreatePropertyTraceRequest) => 
      propertyTraceService.createPropertyTrace(trace),
    onSuccess: (_, variables) => {
      // Invalidate and refetch property traces for the specific property
      queryClient.invalidateQueries({ 
        queryKey: ["propertyTraces", variables.idProperty] 
      });
    },
    onError: (error) => {
      console.error("Error creating property trace:", error);
    },
  });
};
