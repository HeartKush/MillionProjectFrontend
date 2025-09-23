import {
  PropertyTraceService,
  propertyTraceService,
} from "../propertyTraceService";
import { httpClient } from "../client";
import { API_ENDPOINTS } from "@/lib/constants";
import axios from "axios";

// Mock the httpClient
jest.mock("../client", () => ({
  httpClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  },
}));

// Mock axios
jest.mock("axios", () => ({
  isAxiosError: jest.fn(),
}));

const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;
const mockAxios = axios as jest.Mocked<typeof axios>;

describe("PropertyTraceService", () => {
  let service: PropertyTraceService;

  beforeEach(() => {
    service = new PropertyTraceService();
    jest.clearAllMocks();
    // Mock console methods to avoid noise in tests
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getByPropertyId", () => {
    const mockTraces = [
      {
        idTrace: "trace-1",
        idProperty: "prop-1",
        date: "2024-01-01",
        price: 1000000,
        description: "Test trace 1",
      },
      {
        idTrace: "trace-2",
        idProperty: "prop-1",
        date: "2024-01-02",
        price: 1100000,
        description: "Test trace 2",
      },
    ];

    it("should fetch property traces successfully", async () => {
      mockHttpClient.get.mockResolvedValue(mockTraces);

      const result = await service.getByPropertyId("prop-1");

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.PROPERTY_TRACES}/by-property/prop-1`
      );
      expect(result).toEqual(mockTraces);
    });

    it("should throw error when propertyId is empty", async () => {
      await expect(service.getByPropertyId("")).rejects.toThrow(
        "Property ID is required"
      );
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it("should return empty array for 404 error", async () => {
      const error = {
        response: { status: 404 },
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockHttpClient.get.mockRejectedValue(error);

      const result = await service.getByPropertyId("prop-1");

      expect(result).toEqual([]);
    });

    it("should throw error for other HTTP errors", async () => {
      const error = {
        response: { status: 500 },
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockHttpClient.get.mockRejectedValue(error);

      await expect(service.getByPropertyId("prop-1")).rejects.toThrow(
        "Failed to fetch property traces"
      );
    });

    it("should throw error for non-axios errors", async () => {
      const error = new Error("Network error");
      mockAxios.isAxiosError.mockReturnValue(false);
      mockHttpClient.get.mockRejectedValue(error);

      await expect(service.getByPropertyId("prop-1")).rejects.toThrow(
        "Failed to fetch property traces"
      );
    });
  });

  describe("getById", () => {
    const mockTrace = {
      idTrace: "trace-1",
      idProperty: "prop-1",
      date: "2024-01-01",
      price: 1000000,
      description: "Test trace",
    };

    it("should fetch property trace by ID successfully", async () => {
      mockHttpClient.get.mockResolvedValue(mockTrace);

      const result = await service.getById("trace-1");

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${API_ENDPOINTS.PROPERTY_TRACES}/trace-1`
      );
      expect(result).toEqual(mockTrace);
    });

    it("should throw error when traceId is empty", async () => {
      await expect(service.getById("")).rejects.toThrow("Trace ID is required");
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it("should return null for 404 error", async () => {
      const error = {
        response: { status: 404 },
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockHttpClient.get.mockRejectedValue(error);

      const result = await service.getById("trace-1");

      expect(result).toBeNull();
    });

    it("should throw error for other HTTP errors", async () => {
      const error = {
        response: { status: 500 },
      };
      mockAxios.isAxiosError.mockReturnValue(true);
      mockHttpClient.get.mockRejectedValue(error);

      await expect(service.getById("trace-1")).rejects.toThrow(
        "Failed to fetch property trace"
      );
    });
  });

  describe("createPropertyTrace", () => {
    const mockTrace = {
      idProperty: "prop-1",
      dateSale: "2024-01-01",
      name: "Test trace",
      value: 1000000,
      tax: 15000,
    };

    it("should create property trace successfully", async () => {
      const mockResponse = { id: "trace-1" };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await service.createPropertyTrace(mockTrace);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        API_ENDPOINTS.PROPERTY_TRACES,
        mockTrace
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when propertyId is missing", async () => {
      const invalidTrace = { ...mockTrace, idProperty: "" };

      await expect(service.createPropertyTrace(invalidTrace)).rejects.toThrow(
        "Property ID is required"
      );
      expect(mockHttpClient.post).not.toHaveBeenCalled();
    });

    it("should throw error for HTTP errors", async () => {
      const error = new Error("Network error");
      mockHttpClient.post.mockRejectedValue(error);

      await expect(service.createPropertyTrace(mockTrace)).rejects.toThrow(
        "Failed to create property trace"
      );
    });
  });

  describe("updatePropertyTrace", () => {
    const mockTrace = {
      idProperty: "prop-1",
      dateSale: "2024-01-01",
      name: "Updated trace",
      value: 1000000,
      tax: 15000,
    };

    it("should update property trace successfully", async () => {
      mockHttpClient.put.mockResolvedValue(undefined);

      await service.updatePropertyTrace("trace-1", mockTrace);

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `${API_ENDPOINTS.PROPERTY_TRACES}/trace-1`,
        mockTrace
      );
    });

    it("should throw error when traceId is empty", async () => {
      await expect(service.updatePropertyTrace("", mockTrace)).rejects.toThrow(
        "Trace ID is required"
      );
      expect(mockHttpClient.put).not.toHaveBeenCalled();
    });

    it("should throw error when propertyId is missing", async () => {
      const invalidTrace = { ...mockTrace, idProperty: "" };

      await expect(
        service.updatePropertyTrace("trace-1", invalidTrace)
      ).rejects.toThrow("Property ID is required");
      expect(mockHttpClient.put).not.toHaveBeenCalled();
    });

    it("should throw error for HTTP errors", async () => {
      const error = new Error("Network error");
      mockHttpClient.put.mockRejectedValue(error);

      await expect(
        service.updatePropertyTrace("trace-1", mockTrace)
      ).rejects.toThrow("Failed to update property trace");
    });
  });

  describe("deletePropertyTrace", () => {
    it("should delete property trace successfully", async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      await service.deletePropertyTrace("trace-1");

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `${API_ENDPOINTS.PROPERTY_TRACES}/trace-1`
      );
    });

    it("should throw error when traceId is empty", async () => {
      await expect(service.deletePropertyTrace("")).rejects.toThrow(
        "Trace ID is required"
      );
      expect(mockHttpClient.delete).not.toHaveBeenCalled();
    });

    it("should throw error for HTTP errors", async () => {
      const error = new Error("Network error");
      mockHttpClient.delete.mockRejectedValue(error);

      await expect(service.deletePropertyTrace("trace-1")).rejects.toThrow(
        "Failed to delete property trace"
      );
    });
  });

  describe("singleton instance", () => {
    it("should export singleton instance", () => {
      expect(propertyTraceService).toBeInstanceOf(PropertyTraceService);
    });
  });
});
