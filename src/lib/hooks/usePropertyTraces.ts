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
 * Custom hook for fetching a single property trace
 */
export const usePropertyTrace = (traceId: string | undefined) => {
  return useQuery({
    queryKey: ["propertyTrace", traceId],
    queryFn: () => propertyTraceService.getById(traceId!),
    enabled: !!traceId,
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
        queryKey: ["propertyTraces", variables.idProperty],
      });
    },
    onError: (error) => {
      console.error("Error creating property trace:", error);
    },
  });
};

/**
 * Custom hook for updating property traces
 */
export const useUpdatePropertyTrace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      traceId,
      trace,
    }: {
      traceId: string;
      trace: CreatePropertyTraceRequest;
    }) => propertyTraceService.updatePropertyTrace(traceId, trace),
    onSuccess: (_, variables) => {
      // Invalidate and refetch property traces for the specific property
      queryClient.invalidateQueries({
        queryKey: ["propertyTraces", variables.trace.idProperty],
      });
      // Also invalidate the specific trace
      queryClient.invalidateQueries({
        queryKey: ["propertyTrace", variables.traceId],
      });
    },
    onError: (error) => {
      console.error("Error updating property trace:", error);
    },
  });
};

/**
 * Custom hook for deleting property traces
 */
export const useDeletePropertyTrace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (traceId: string) =>
      propertyTraceService.deletePropertyTrace(traceId),
    onSuccess: (_, traceId) => {
      // Invalidate all property traces queries
      queryClient.invalidateQueries({
        queryKey: ["propertyTraces"],
      });
      // Also invalidate the specific trace
      queryClient.invalidateQueries({
        queryKey: ["propertyTrace", traceId],
      });
    },
    onError: (error) => {
      console.error("Error deleting property trace:", error);
    },
  });
};
