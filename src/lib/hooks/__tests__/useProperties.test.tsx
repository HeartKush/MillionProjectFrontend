import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useProperties,
  useProperty,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
} from "../useProperties";
import { propertyService } from "@/lib/api/propertyService";
import type { PropertyFilters } from "@/lib/types";

// Mock the property service
jest.mock("@/lib/api/propertyService", () => ({
  propertyService: {
    searchProperties: jest.fn(),
    getPropertyById: jest.fn(),
    createProperty: jest.fn(),
    updateProperty: jest.fn(),
    deleteProperty: jest.fn(),
  },
}));

const mockPropertyService = propertyService as jest.Mocked<
  typeof propertyService
>;

// Mock console methods to avoid noise in tests
const consoleSpy = {
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
};

// Test wrapper component
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: 0,
        gcTime: 0,
      },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useProperties Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleSpy.error.mockClear();
  });

  afterAll(() => {
    consoleSpy.error.mockRestore();
  });

  it("fetches properties successfully", async () => {
    const mockProperties = [
      { idProperty: "1", name: "Property 1", price: 100000 },
      { idProperty: "2", name: "Property 2", price: 200000 },
    ];
    mockPropertyService.searchProperties.mockResolvedValue(mockProperties);

    const { result } = renderHook(() => useProperties({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProperties);
    expect(mockPropertyService.searchProperties).toHaveBeenCalledWith({});
  });

  it("handles fetch error", async () => {
    const error = new Error("Fetch failed");
    mockPropertyService.searchProperties.mockImplementation(() =>
      Promise.reject(error)
    );

    const { result } = renderHook(() => useProperties({}), {
      wrapper: createWrapper(),
    });

    // Wait for the error state
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
    expect(mockPropertyService.searchProperties).toHaveBeenCalledWith({});
  });

  it("refetches with new filters", async () => {
    const filters: PropertyFilters = { name: "Test" };
    mockPropertyService.searchProperties.mockResolvedValue([]);

    const { result, rerender } = renderHook(
      ({ filters }) => useProperties(filters),
      {
        wrapper: createWrapper(),
        initialProps: { filters: {} },
      }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    rerender({ filters });

    await waitFor(() => {
      expect(mockPropertyService.searchProperties).toHaveBeenCalledWith(
        filters
      );
    });
  });
});

describe("useProperty Hook", () => {
  it("fetches single property successfully", async () => {
    const mockProperty = {
      idProperty: "123",
      name: "Test Property",
      price: 100000,
      year: 2023,
    };
    mockPropertyService.getPropertyById.mockResolvedValue(mockProperty);

    const { result } = renderHook(() => useProperty("123"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProperty);
    expect(mockPropertyService.getPropertyById).toHaveBeenCalledWith("123");
  });

  it("does not fetch when ID is undefined", () => {
    const { result } = renderHook(() => useProperty(undefined), {
      wrapper: createWrapper(),
    });

    // The query should be disabled when ID is undefined
    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
    expect(result.current.isFetching).toBe(false);
    expect(result.current.status).toBe("pending");
  });
});

describe("useCreateProperty Hook", () => {
  it("creates property successfully", async () => {
    const mockResponse = { id: "new-id" };
    const propertyData = {
      name: "New Property",
      address: "123 New Street",
      price: 200000,
      year: 2023,
    };
    mockPropertyService.createProperty.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useCreateProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(propertyData);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockPropertyService.createProperty).toHaveBeenCalledWith(
      propertyData
    );
  });

  it("handles creation error", async () => {
    const error = new Error("Creation failed");
    const propertyData = {
      name: "New Property",
      address: "123 New Street",
      price: 200000,
      year: 2023,
    };
    mockPropertyService.createProperty.mockRejectedValue(error);

    const { result } = renderHook(() => useCreateProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(propertyData);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe("useUpdateProperty Hook", () => {
  it("updates property successfully", async () => {
    const mockResponse = { id: "updated-id" };
    const propertyData = {
      name: "Updated Property",
      address: "456 Updated Street",
      price: 300000,
      year: 2024,
    };
    mockPropertyService.updateProperty.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useUpdateProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "1", property: propertyData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockResponse);
    expect(mockPropertyService.updateProperty).toHaveBeenCalledWith(
      "1",
      propertyData
    );
  });

  it("handles update error", async () => {
    const error = new Error("Update failed");
    const propertyData = {
      name: "Updated Property",
      address: "456 Updated Street",
      price: 300000,
      year: 2024,
    };
    mockPropertyService.updateProperty.mockRejectedValue(error);

    const { result } = renderHook(() => useUpdateProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: "1", property: propertyData });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});

describe("useDeleteProperty Hook", () => {
  it("deletes property successfully", async () => {
    mockPropertyService.deleteProperty.mockResolvedValue(undefined);

    const { result } = renderHook(() => useDeleteProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(mockPropertyService.deleteProperty).toHaveBeenCalledWith("1");
  });

  it("handles deletion error", async () => {
    const error = new Error("Deletion failed");
    mockPropertyService.deleteProperty.mockRejectedValue(error);

    const { result } = renderHook(() => useDeleteProperty(), {
      wrapper: createWrapper(),
    });

    result.current.mutate("1");

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(error);
  });
});
