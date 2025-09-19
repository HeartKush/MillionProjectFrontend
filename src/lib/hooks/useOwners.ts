import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ownerService } from "@/lib/api/ownerService";
import type { CreateOwnerRequest } from "@/lib/types";

/**
 * Custom hook for owner queries
 * Follows Single Responsibility Principle - only handles owner data fetching
 */
export const useOwners = (name?: string) => {
  return useQuery({
    queryKey: ["owners", name],
    queryFn: () => ownerService.searchOwners(name),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Custom hook for fetching a single owner
 */
export const useOwner = (id: string | undefined) => {
  return useQuery({
    queryKey: ["owner", id],
    queryFn: () => ownerService.getOwnerById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

/**
 * Custom hook for creating owners
 */
export const useCreateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (owner: CreateOwnerRequest) => ownerService.createOwner(owner),
    onSuccess: () => {
      // Invalidate and refetch owners list
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error) => {
      console.error("Error creating owner:", error);
    },
  });
};

/**
 * Custom hook for updating owners
 */
export const useUpdateOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, owner }: { id: string; owner: CreateOwnerRequest }) =>
      ownerService.updateOwner(id, owner),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error) => {
      console.error("Error updating owner:", error);
    },
  });
};

/**
 * Custom hook for deleting owners
 */
export const useDeleteOwner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ownerService.deleteOwner(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["owners"] });
    },
    onError: (error) => {
      console.error("Error deleting owner:", error);
    },
  });
};
