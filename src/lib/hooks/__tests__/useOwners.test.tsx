import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useOwners,
  useOwner,
  useCreateOwner,
  useUpdateOwner,
  useDeleteOwner,
} from "../useOwners";
import { ownerService } from "@/lib/api/ownerService";
import type {
  OwnerListItem,
  OwnerDetail,
  CreateOwnerRequest,
} from "@/lib/types";

// Mock dependencies
jest.mock("@/lib/api/ownerService");
const mockOwnerService = ownerService as jest.Mocked<typeof ownerService>;

// Mock console methods to avoid noise in tests
const consoleSpy = {
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
};

// Test wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const mockOwners: OwnerListItem[] = [
  {
    idOwner: "1",
    name: "John Doe",
    address: "123 Main St",
    photo: "photo1.jpg",
    birthday: "1990-01-01T00:00:00.000Z",
  },
  {
    idOwner: "2",
    name: "Jane Smith",
    address: "456 Oak Ave",
    photo: "photo2.jpg",
    birthday: "1985-05-15T00:00:00.000Z",
  },
];

const mockOwnerDetail: OwnerDetail = {
  idOwner: "1",
  name: "John Doe",
  address: "123 Main St",
  photo: "photo1.jpg",
  birthday: "1990-01-01T00:00:00.000Z",
  properties: [],
};

describe("useOwners hooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.error.mockClear();
  });

  afterAll(() => {
    consoleSpy.error.mockRestore();
  });

  describe("useOwners", () => {
    it("should fetch owners successfully", async () => {
      mockOwnerService.searchOwners.mockResolvedValue(mockOwners);

      const { result } = renderHook(() => useOwners(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockOwners);
      expect(result.current.error).toBeNull();
      expect(mockOwnerService.searchOwners).toHaveBeenCalledWith(undefined);
    });

    it("should fetch owners with name filter", async () => {
      mockOwnerService.searchOwners.mockResolvedValue([mockOwners[0]]);

      const { result } = renderHook(() => useOwners("John"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([mockOwners[0]]);
      expect(mockOwnerService.searchOwners).toHaveBeenCalledWith("John");
    });

    it("should handle fetch error", async () => {
      const error = new Error("Fetch failed");
      mockOwnerService.searchOwners.mockRejectedValue(error);

      const { result } = renderHook(() => useOwners(), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete (either success or error)
      await waitFor(
        () => {
          expect(result.current.data).toBeUndefined();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("useOwner", () => {
    it("should fetch single owner successfully", async () => {
      mockOwnerService.getOwnerById.mockResolvedValue(mockOwnerDetail);

      const { result } = renderHook(() => useOwner("1"), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockOwnerDetail);
      expect(result.current.error).toBeNull();
      expect(mockOwnerService.getOwnerById).toHaveBeenCalledWith("1");
    });

    it("should not fetch when id is undefined", () => {
      const { result } = renderHook(() => useOwner(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockOwnerService.getOwnerById).not.toHaveBeenCalled();
    });

    it("should handle fetch error", async () => {
      const error = new Error("Owner not found");
      mockOwnerService.getOwnerById.mockRejectedValue(error);

      const { result } = renderHook(() => useOwner("1"), {
        wrapper: createWrapper(),
      });

      // Wait for the query to complete (either success or error)
      await waitFor(
        () => {
          expect(result.current.data).toBeUndefined();
        },
        { timeout: 3000 }
      );
    });
  });

  describe("useCreateOwner", () => {
    const newOwner: CreateOwnerRequest = {
      name: "New Owner",
      address: "789 New St",
      photo: "new-photo.jpg",
      birthday: "1995-01-01T00:00:00.000Z",
    };

    it("should create owner successfully", async () => {
      mockOwnerService.createOwner.mockResolvedValue({ id: "new-id" });

      const { result } = renderHook(() => useCreateOwner(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(newOwner);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockOwnerService.createOwner).toHaveBeenCalledWith(newOwner);
    });

    it("should handle creation error", async () => {
      const error = new Error("Creation failed");
      mockOwnerService.createOwner.mockRejectedValue(error);

      const { result } = renderHook(() => useCreateOwner(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync(newOwner);
      } catch (e) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error creating owner:",
        error
      );
    });

    it("should invalidate queries on success", async () => {
      mockOwnerService.createOwner.mockResolvedValue({ id: "new-id" });

      const { result } = renderHook(() => useCreateOwner(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync(newOwner);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe("useUpdateOwner", () => {
    const updateData: CreateOwnerRequest = {
      name: "Updated Owner",
      address: "456 Updated St",
      photo: "updated-photo.jpg",
      birthday: "1990-01-01T00:00:00.000Z",
    };

    it("should update owner successfully", async () => {
      mockOwnerService.updateOwner.mockResolvedValue({ id: "1" });

      const { result } = renderHook(() => useUpdateOwner(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({ id: "1", owner: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockOwnerService.updateOwner).toHaveBeenCalledWith(
        "1",
        updateData
      );
    });

    it("should handle update error", async () => {
      const error = new Error("Update failed");
      mockOwnerService.updateOwner.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdateOwner(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync({ id: "1", owner: updateData });
      } catch (e) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error updating owner:",
        error
      );
    });

    it("should invalidate queries on success", async () => {
      mockOwnerService.updateOwner.mockResolvedValue({ id: "1" });

      const { result } = renderHook(() => useUpdateOwner(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync({ id: "1", owner: updateData });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });

  describe("useDeleteOwner", () => {
    it("should delete owner successfully", async () => {
      mockOwnerService.deleteOwner.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteOwner(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync("1");

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockOwnerService.deleteOwner).toHaveBeenCalledWith("1");
    });

    it("should handle deletion error", async () => {
      const error = new Error("Deletion failed");
      mockOwnerService.deleteOwner.mockRejectedValue(error);

      const { result } = renderHook(() => useDeleteOwner(), {
        wrapper: createWrapper(),
      });

      try {
        await result.current.mutateAsync("1");
      } catch (e) {
        // Expected to throw
      }

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeTruthy();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error deleting owner:",
        error
      );
    });

    it("should invalidate queries on success", async () => {
      mockOwnerService.deleteOwner.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeleteOwner(), {
        wrapper: createWrapper(),
      });

      await result.current.mutateAsync("1");

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });
    });
  });
});
