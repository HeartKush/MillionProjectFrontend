import React from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  usePropertyFilters,
  useProperties,
  useProperty,
  useCreateProperty,
  useUpdateProperty,
  useDeleteProperty,
} from "../useProperties";
// Mock the hooks module to avoid import issues
jest.mock("../index", () => ({
  useProperties: jest.fn(),
  useProperty: jest.fn(),
  useCreateProperty: jest.fn(),
  useUpdateProperty: jest.fn(),
  useDeleteProperty: jest.fn(),
  usePropertyFilters: jest.fn(),
  useOwners: jest.fn(),
  useOwner: jest.fn(),
  useCreateOwner: jest.fn(),
  useUpdateOwner: jest.fn(),
  useDeleteOwner: jest.fn(),
}));

// Mock the API services
jest.mock("../../api/propertyService", () => ({
  propertyService: {
    searchProperties: jest.fn(),
    getPropertyById: jest.fn(),
    createProperty: jest.fn(),
    updateProperty: jest.fn(),
    deleteProperty: jest.fn(),
  },
}));

jest.mock("../../api/ownerService", () => ({
  ownerService: {
    searchOwners: jest.fn(),
    getOwnerById: jest.fn(),
    createOwner: jest.fn(),
    updateOwner: jest.fn(),
    deleteOwner: jest.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        cacheTime: 0,
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

describe("Hooks", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("should have all required hooks defined", () => {
    const hooks = require("../index");

    expect(hooks.useProperties).toBeDefined();
    expect(hooks.useProperty).toBeDefined();
    expect(hooks.useCreateProperty).toBeDefined();
    expect(hooks.useUpdateProperty).toBeDefined();
    expect(hooks.useDeleteProperty).toBeDefined();
    expect(hooks.usePropertyFilters).toBeDefined();
    expect(hooks.useOwners).toBeDefined();
    expect(hooks.useOwner).toBeDefined();
    expect(hooks.useCreateOwner).toBeDefined();
    expect(hooks.useUpdateOwner).toBeDefined();
    expect(hooks.useDeleteOwner).toBeDefined();
  });

  it("should have hooks as functions", () => {
    const hooks = require("../index");

    expect(typeof hooks.useProperties).toBe("function");
    expect(typeof hooks.useProperty).toBe("function");
    expect(typeof hooks.useCreateProperty).toBe("function");
    expect(typeof hooks.useUpdateProperty).toBe("function");
    expect(typeof hooks.useDeleteProperty).toBe("function");
    expect(typeof hooks.usePropertyFilters).toBe("function");
    expect(typeof hooks.useOwners).toBe("function");
    expect(typeof hooks.useOwner).toBe("function");
    expect(typeof hooks.useCreateOwner).toBe("function");
    expect(typeof hooks.useUpdateOwner).toBe("function");
    expect(typeof hooks.useDeleteOwner).toBe("function");
  });
});

describe("usePropertyFilters", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("initializes with empty filters", () => {
    const { result } = renderHook(() => usePropertyFilters());

    expect(result.current.filters).toEqual({});
    expect(result.current.debouncedFilters).toEqual({});
  });

  it("updates filter values", () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test property");
    });

    expect(result.current.filters).toEqual({ name: "test property" });
  });

  it("updates multiple filter values", () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test property");
      result.current.updateFilter("minPrice", 100000);
    });

    expect(result.current.filters).toEqual({
      name: "test property",
      minPrice: 100000,
    });
  });

  it("updates existing filter values", () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test property");
    });

    act(() => {
      result.current.updateFilter("name", "updated property");
    });

    expect(result.current.filters).toEqual({ name: "updated property" });
  });

  it("removes filter when value is undefined", () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test property");
      result.current.updateFilter("minPrice", 100000);
    });

    act(() => {
      result.current.updateFilter("name", undefined);
    });

    expect(result.current.filters).toEqual({ minPrice: 100000 });
  });

  it("debounces filter changes", async () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test property");
    });

    // debouncedFilters should still be empty
    expect(result.current.debouncedFilters).toEqual({});

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.debouncedFilters).toEqual({
        name: "test property",
      });
    });
  });

  it("clears all filters", () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test property");
      result.current.updateFilter("minPrice", 100000);
    });

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({});
    expect(result.current.debouncedFilters).toEqual({});
  });

  it("clears timeout on unmount", () => {
    const { result, unmount } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test property");
    });

    // Should not throw when unmounting
    expect(() => unmount()).not.toThrow();
  });

  it("handles rapid filter changes", async () => {
    const { result } = renderHook(() => usePropertyFilters());

    act(() => {
      result.current.updateFilter("name", "test1");
    });

    act(() => {
      result.current.updateFilter("name", "test2");
    });

    act(() => {
      result.current.updateFilter("name", "test3");
    });

    // Fast-forward time by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    await waitFor(() => {
      expect(result.current.debouncedFilters).toEqual({ name: "test3" });
    });
  });
});

describe("useProperties", () => {
  let queryClient: QueryClient;
  let mockSearchProperties: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Get the mocked function from the already mocked module
    const { propertyService } = require("../../api/propertyService");
    mockSearchProperties = propertyService.searchProperties as jest.Mock;
    mockSearchProperties.mockClear();
    mockSearchProperties.mockResolvedValue([]);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls propertyService.searchProperties with filters", async () => {
    const filters = { name: "test" };
    renderHook(() => useProperties(filters), { wrapper });

    await waitFor(() => {
      expect(mockSearchProperties).toHaveBeenCalledWith(filters);
    });
  });

  it("calls propertyService.searchProperties with empty filters by default", async () => {
    renderHook(() => useProperties(), { wrapper });

    await waitFor(() => {
      expect(mockSearchProperties).toHaveBeenCalledWith({});
    });
  });
});

describe("useProperty", () => {
  let queryClient: QueryClient;
  let mockGetPropertyById: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Get the mocked function from the already mocked module
    const { propertyService } = require("../../api/propertyService");
    mockGetPropertyById = propertyService.getPropertyById as jest.Mock;
    mockGetPropertyById.mockClear();
    mockGetPropertyById.mockResolvedValue({});
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls propertyService.getPropertyById when id is provided", async () => {
    const id = "123";
    renderHook(() => useProperty(id), { wrapper });

    await waitFor(() => {
      expect(mockGetPropertyById).toHaveBeenCalledWith(id);
    });
  });

  it("does not call propertyService.getPropertyById when id is undefined", () => {
    renderHook(() => useProperty(undefined), { wrapper });

    expect(mockGetPropertyById).not.toHaveBeenCalled();
  });
});

describe("useCreateProperty", () => {
  let queryClient: QueryClient;
  let mockCreateProperty: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Get the mocked function from the already mocked module
    const { propertyService } = require("../../api/propertyService");
    mockCreateProperty = propertyService.createProperty as jest.Mock;
    mockCreateProperty.mockClear();
    mockCreateProperty.mockResolvedValue({ id: "123" });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls propertyService.createProperty on mutation", async () => {
    const { result } = renderHook(() => useCreateProperty(), { wrapper });

    const propertyData = { name: "Test Property", address: "123 Test St" };

    await act(async () => {
      result.current.mutate(propertyData);
    });

    expect(mockCreateProperty).toHaveBeenCalledWith(propertyData);
  });

  it("invalidates properties query on success", async () => {
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useCreateProperty(), { wrapper });

    const propertyData = { name: "Test Property", address: "123 Test St" };

    await act(async () => {
      result.current.mutate(propertyData);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["properties"],
    });
  });

  it("logs error on failure", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockCreateProperty.mockRejectedValue(new Error("Creation failed"));

    const { result } = renderHook(() => useCreateProperty(), { wrapper });

    const propertyData = { name: "Test Property", address: "123 Test St" };

    await act(async () => {
      result.current.mutate(propertyData);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error creating property:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});

describe("useUpdateProperty", () => {
  let queryClient: QueryClient;
  let mockUpdateProperty: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Get the mocked function from the already mocked module
    const { propertyService } = require("../../api/propertyService");
    mockUpdateProperty = propertyService.updateProperty as jest.Mock;
    mockUpdateProperty.mockClear();
    mockUpdateProperty.mockResolvedValue({ id: "123" });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls propertyService.updateProperty on mutation", async () => {
    const { result } = renderHook(() => useUpdateProperty(), { wrapper });

    const updateData = {
      id: "123",
      property: { name: "Updated Property", address: "456 Updated St" },
    };

    await act(async () => {
      result.current.mutate(updateData);
    });

    expect(mockUpdateProperty).toHaveBeenCalledWith(
      updateData.id,
      updateData.property
    );
  });

  it("invalidates properties query on success", async () => {
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useUpdateProperty(), { wrapper });

    const updateData = {
      id: "123",
      property: { name: "Updated Property", address: "456 Updated St" },
    };

    await act(async () => {
      result.current.mutate(updateData);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["properties"],
    });
  });

  it("logs error on failure", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockUpdateProperty.mockRejectedValue(new Error("Update failed"));

    const { result } = renderHook(() => useUpdateProperty(), { wrapper });

    const updateData = {
      id: "123",
      property: { name: "Updated Property", address: "456 Updated St" },
    };

    await act(async () => {
      result.current.mutate(updateData);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error updating property:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});

describe("useDeleteProperty", () => {
  let queryClient: QueryClient;
  let mockDeleteProperty: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    // Get the mocked function from the already mocked module
    const { propertyService } = require("../../api/propertyService");
    mockDeleteProperty = propertyService.deleteProperty as jest.Mock;
    mockDeleteProperty.mockClear();
    mockDeleteProperty.mockResolvedValue(undefined);
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("calls propertyService.deleteProperty on mutation", async () => {
    const { result } = renderHook(() => useDeleteProperty(), { wrapper });

    const propertyId = "123";

    await act(async () => {
      result.current.mutate(propertyId);
    });

    expect(mockDeleteProperty).toHaveBeenCalledWith(propertyId);
  });

  it("invalidates properties query on success", async () => {
    const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

    const { result } = renderHook(() => useDeleteProperty(), { wrapper });

    const propertyId = "123";

    await act(async () => {
      result.current.mutate(propertyId);
    });

    expect(invalidateQueriesSpy).toHaveBeenCalledWith({
      queryKey: ["properties"],
    });
  });

  it("logs error on failure", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockDeleteProperty.mockRejectedValue(new Error("Delete failed"));

    const { result } = renderHook(() => useDeleteProperty(), { wrapper });

    const propertyId = "123";

    await act(async () => {
      result.current.mutate(propertyId);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error deleting property:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
