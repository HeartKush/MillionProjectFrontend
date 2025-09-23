import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  usePropertyTraces,
  usePropertyTrace,
  useCreatePropertyTrace,
  useUpdatePropertyTrace,
  useDeletePropertyTrace,
} from "../usePropertyTraces";
import { propertyTraceService } from "@/lib/api/propertyTraceService";
import type { CreatePropertyTraceRequest } from "@/lib/types";

// Mock the propertyTraceService
jest.mock("@/lib/api/propertyTraceService", () => ({
  propertyTraceService: {
    getByPropertyId: jest.fn(),
    getById: jest.fn(),
    createPropertyTrace: jest.fn(),
    updatePropertyTrace: jest.fn(),
    deletePropertyTrace: jest.fn(),
  },
}));

const mockPropertyTraceService = propertyTraceService as jest.Mocked<
  typeof propertyTraceService
>;

// Mock console.error to avoid noise in tests
const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

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

const mockPropertyTrace = {
  idPropertyTrace: "trace-1",
  idProperty: "prop-1",
  dateSale: "2024-01-01",
  name: "Property viewed by user",
  value: 1000000,
  tax: 15000,
};

const mockCreateRequest: CreatePropertyTraceRequest = {
  idProperty: "prop-1",
  dateSale: "2024-01-01",
  name: "Property viewed by user",
  value: 1000000,
  tax: 15000,
};

describe("usePropertyTraces", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError.mockClear();
  });

  describe("usePropertyTraces", () => {
    it("should fetch property traces when propertyId is provided", async () => {
      mockPropertyTraceService.getByPropertyId.mockResolvedValue([
        mockPropertyTrace,
      ]);

      const { result } = renderHook(() => usePropertyTraces("prop-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual([mockPropertyTrace]);
      expect(mockPropertyTraceService.getByPropertyId).toHaveBeenCalledWith(
        "prop-1"
      );
    });

    it("should not fetch when propertyId is undefined", () => {
      const { result } = renderHook(() => usePropertyTraces(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockPropertyTraceService.getByPropertyId).not.toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const error = new Error("Failed to fetch traces");
      mockPropertyTraceService.getByPropertyId.mockRejectedValue(error);

      const { result } = renderHook(() => usePropertyTraces("prop-1"), {
        wrapper: createWrapper(),
      });

      // Wait for the error state with longer timeout
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.error).toEqual(error);
    });
  });

  describe("usePropertyTrace", () => {
    it("should fetch single property trace when traceId is provided", async () => {
      mockPropertyTraceService.getById.mockResolvedValue(mockPropertyTrace);

      const { result } = renderHook(() => usePropertyTrace("trace-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });

      expect(result.current.data).toEqual(mockPropertyTrace);
      expect(mockPropertyTraceService.getById).toHaveBeenCalledWith("trace-1");
    });

    it("should not fetch when traceId is undefined", () => {
      const { result } = renderHook(() => usePropertyTrace(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toBeUndefined();
      expect(mockPropertyTraceService.getById).not.toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const error = new Error("Failed to fetch trace");
      mockPropertyTraceService.getById.mockRejectedValue(error);

      const { result } = renderHook(() => usePropertyTrace("trace-1"), {
        wrapper: createWrapper(),
      });

      // Wait for the error state with longer timeout
      await waitFor(
        () => {
          expect(result.current.isError).toBe(true);
        },
        { timeout: 5000 }
      );

      expect(result.current.error).toEqual(error);
    });
  });

  describe("useCreatePropertyTrace", () => {
    it("should create property trace successfully", async () => {
      mockPropertyTraceService.createPropertyTrace.mockResolvedValue({
        id: "new-trace",
      });

      const { result } = renderHook(() => useCreatePropertyTrace(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate(mockCreateRequest);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPropertyTraceService.createPropertyTrace).toHaveBeenCalledWith(
        mockCreateRequest
      );
      expect(result.current.data).toEqual({ id: "new-trace" });
    });

    it("should handle creation errors", async () => {
      const error = new Error("Failed to create trace");
      mockPropertyTraceService.createPropertyTrace.mockRejectedValue(error);

      const { result } = renderHook(() => useCreatePropertyTrace(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate(mockCreateRequest);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Error creating property trace:",
        error
      );
    });
  });

  describe("useUpdatePropertyTrace", () => {
    it("should update property trace successfully", async () => {
      mockPropertyTraceService.updatePropertyTrace.mockResolvedValue(undefined);

      const { result } = renderHook(() => useUpdatePropertyTrace(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        traceId: "trace-1",
        trace: { ...mockCreateRequest, details: "Updated details" },
      };

      await act(async () => {
        result.current.mutate(updateData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPropertyTraceService.updatePropertyTrace).toHaveBeenCalledWith(
        "trace-1",
        updateData.trace
      );
      expect(result.current.data).toEqual(undefined);
    });

    it("should handle update errors", async () => {
      const error = new Error("Failed to update trace");
      mockPropertyTraceService.updatePropertyTrace.mockRejectedValue(error);

      const { result } = renderHook(() => useUpdatePropertyTrace(), {
        wrapper: createWrapper(),
      });

      const updateData = {
        traceId: "trace-1",
        trace: mockCreateRequest,
      };

      await act(async () => {
        result.current.mutate(updateData);
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Error updating property trace:",
        error
      );
    });
  });

  describe("useDeletePropertyTrace", () => {
    it("should delete property trace successfully", async () => {
      mockPropertyTraceService.deletePropertyTrace.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeletePropertyTrace(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate("trace-1");
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(mockPropertyTraceService.deletePropertyTrace).toHaveBeenCalledWith(
        "trace-1"
      );
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Failed to delete trace");
      mockPropertyTraceService.deletePropertyTrace.mockRejectedValue(error);

      const { result } = renderHook(() => useDeletePropertyTrace(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        result.current.mutate("trace-1");
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(error);
      expect(mockConsoleError).toHaveBeenCalledWith(
        "Error deleting property trace:",
        error
      );
    });
  });

  describe("query invalidation", () => {
    it("should invalidate queries on successful creation", async () => {
      const queryClient = new QueryClient();
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      mockPropertyTraceService.createPropertyTrace.mockResolvedValue({
        id: "new-trace",
      });

      const { result } = renderHook(() => useCreatePropertyTrace(), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate(mockCreateRequest);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["propertyTraces", "prop-1"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["properties"],
      });
    });

    it("should invalidate queries on successful update", async () => {
      const queryClient = new QueryClient();
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      mockPropertyTraceService.updatePropertyTrace.mockResolvedValue(undefined);

      const { result } = renderHook(() => useUpdatePropertyTrace(), {
        wrapper,
      });

      const updateData = {
        traceId: "trace-1",
        trace: mockCreateRequest,
      };

      await act(async () => {
        result.current.mutate(updateData);
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["propertyTraces", "prop-1"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["propertyTrace", "trace-1"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["properties"],
      });
    });

    it("should invalidate queries on successful deletion", async () => {
      const queryClient = new QueryClient();
      const invalidateQueriesSpy = jest.spyOn(queryClient, "invalidateQueries");

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );

      mockPropertyTraceService.deletePropertyTrace.mockResolvedValue(undefined);

      const { result } = renderHook(() => useDeletePropertyTrace(), {
        wrapper,
      });

      await act(async () => {
        result.current.mutate("trace-1");
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["propertyTraces"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["propertyTrace", "trace-1"],
      });
      expect(invalidateQueriesSpy).toHaveBeenCalledWith({
        queryKey: ["properties"],
      });
    });
  });
});
