import {
  PropertyService,
  propertyService,
  IPropertyService,
} from "../propertyService";
import { httpClient } from "../client";
import type { PropertyFilters, CreatePropertyRequest } from "@/lib/types";
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

const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

describe("PropertyService", () => {
  let propertyService: PropertyService;

  beforeEach(() => {
    propertyService = new PropertyService();
    jest.clearAllMocks();
  });

  describe("searchProperties", () => {
    it("searches properties with no filters", async () => {
      const mockProperties = [
        { idProperty: "1", name: "Property 1", price: 100000 },
        { idProperty: "2", name: "Property 2", price: 200000 },
      ];
      mockHttpClient.get.mockResolvedValue(mockProperties);

      const result = await propertyService.searchProperties({});

      expect(mockHttpClient.get).toHaveBeenCalledWith("/api/property");
      expect(result).toEqual(mockProperties);
    });

    it("searches properties with filters", async () => {
      const mockProperties = [
        { idProperty: "1", name: "Test Property", price: 100000 },
      ];
      const filters: PropertyFilters = {
        name: "Test",
        minPrice: 50000,
        maxPrice: 150000,
      };
      mockHttpClient.get.mockResolvedValue(mockProperties);

      const result = await propertyService.searchProperties(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        "/api/property?name=Test&minPrice=50000&maxPrice=150000"
      );
      expect(result).toEqual(mockProperties);
    });

    it("searches properties with address filter", async () => {
      const mockProperties = [
        { idProperty: "1", name: "Property with Address", price: 100000 },
      ];
      const filters: PropertyFilters = {
        name: "Property",
        address: "Calle 123",
        minPrice: 50000,
        maxPrice: 150000,
      };
      mockHttpClient.get.mockResolvedValue(mockProperties);

      const result = await propertyService.searchProperties(filters);

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        "/api/property?name=Property&address=Calle+123&minPrice=50000&maxPrice=150000"
      );
      expect(result).toEqual(mockProperties);
    });

    it("searches properties with NaN price filters", async () => {
      const mockProperties = [
        { idProperty: "1", name: "Test Property", price: 100000 },
      ];
      const filters: PropertyFilters = {
        name: "Test",
        minPrice: NaN, // This should be ignored
        maxPrice: NaN, // This should be ignored
      };
      mockHttpClient.get.mockResolvedValue(mockProperties);

      const result = await propertyService.searchProperties(filters);

      // NaN values should not be included in query params
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        "/api/property?name=Test"
      );
      expect(result).toEqual(mockProperties);
    });

    it("searches properties with undefined price filters", async () => {
      const mockProperties = [
        { idProperty: "1", name: "Test Property", price: 100000 },
      ];
      const filters: PropertyFilters = {
        name: "Test",
        minPrice: undefined, // This should be ignored
        maxPrice: undefined, // This should be ignored
      };
      mockHttpClient.get.mockResolvedValue(mockProperties);

      const result = await propertyService.searchProperties(filters);

      // undefined values should not be included in query params
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        "/api/property?name=Test"
      );
      expect(result).toEqual(mockProperties);
    });

    it("handles search errors", async () => {
      mockHttpClient.get.mockRejectedValue(new Error("Network error"));

      await expect(propertyService.searchProperties({})).rejects.toThrow(
        "Failed to search properties"
      );
    });
  });

  describe("getPropertyById", () => {
    it("fetches property by ID", async () => {
      const mockProperty = {
        idProperty: "123",
        name: "Test Property",
        price: 100000,
        year: 2023,
      };
      mockHttpClient.get.mockResolvedValue(mockProperty);

      const result = await propertyService.getPropertyById("123");

      expect(mockHttpClient.get).toHaveBeenCalledWith("/api/property/123");
      expect(result).toEqual(mockProperty);
    });

    it("returns null for 404 errors", async () => {
      const error = new Error("Not found");
      (error as any).response = { status: 404 };
      (error as any).isAxiosError = true;
      mockHttpClient.get.mockRejectedValue(error);

      const result = await propertyService.getPropertyById("123");

      expect(result).toBeNull();
    });

    it("throws error for other errors", async () => {
      mockHttpClient.get.mockRejectedValue(new Error("Server error"));

      await expect(propertyService.getPropertyById("123")).rejects.toThrow(
        "Failed to fetch property"
      );
    });

    it("throws error for missing ID", async () => {
      await expect(propertyService.getPropertyById("")).rejects.toThrow(
        "Property ID is required"
      );
    });
  });

  describe("createProperty", () => {
    it("creates property successfully", async () => {
      const mockResponse = { id: "new-property-id" };
      const propertyData: CreatePropertyRequest = {
        name: "New Property",
        address: "123 New Street",
        price: 200000,
        year: 2023,
      };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await propertyService.createProperty(propertyData);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/api/property",
        propertyData
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error for missing required fields", async () => {
      const propertyData: CreatePropertyRequest = {
        name: "",
        address: "123 New Street",
        price: 200000,
        year: 2023,
      };

      await expect(
        propertyService.createProperty(propertyData)
      ).rejects.toThrow("Name and address are required");
    });

    it("handles creation errors", async () => {
      const propertyData: CreatePropertyRequest = {
        name: "New Property",
        address: "123 New Street",
        price: 200000,
        year: 2023,
      };
      mockHttpClient.post.mockRejectedValue(new Error("Creation failed"));

      await expect(
        propertyService.createProperty(propertyData)
      ).rejects.toThrow("Failed to create property");
    });
  });

  describe("updateProperty", () => {
    it("updates property successfully", async () => {
      const propertyId = "123";
      const propertyData: CreatePropertyRequest = {
        name: "Updated Property",
        address: "456 Updated Street",
        price: 300000,
        year: 2024,
      };
      const mockResponse = { id: propertyId };
      mockHttpClient.put.mockResolvedValue(mockResponse);

      const result = await propertyService.updateProperty(
        propertyId,
        propertyData
      );

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        `/api/property/${propertyId}`,
        propertyData
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws error when property ID is empty", async () => {
      const propertyData: CreatePropertyRequest = {
        name: "Updated Property",
        address: "456 Updated Street",
        price: 300000,
        year: 2024,
      };

      await expect(
        propertyService.updateProperty("", propertyData)
      ).rejects.toThrow("Property ID is required");
    });

    it("throws error when name is missing", async () => {
      const propertyId = "123";
      const propertyData: CreatePropertyRequest = {
        name: "",
        address: "456 Updated Street",
        price: 300000,
        year: 2024,
      };

      await expect(
        propertyService.updateProperty(propertyId, propertyData)
      ).rejects.toThrow("Name and address are required");
    });

    it("throws error when address is missing", async () => {
      const propertyId = "123";
      const propertyData: CreatePropertyRequest = {
        name: "Updated Property",
        address: "",
        price: 300000,
        year: 2024,
      };

      await expect(
        propertyService.updateProperty(propertyId, propertyData)
      ).rejects.toThrow("Name and address are required");
    });

    it("handles update errors", async () => {
      const propertyId = "123";
      const propertyData: CreatePropertyRequest = {
        name: "Updated Property",
        address: "456 Updated Street",
        price: 300000,
        year: 2024,
      };
      mockHttpClient.put.mockRejectedValue(new Error("Update failed"));

      await expect(
        propertyService.updateProperty(propertyId, propertyData)
      ).rejects.toThrow("Failed to update property");
    });
  });

  describe("deleteProperty", () => {
    it("deletes property successfully", async () => {
      const propertyId = "123";
      mockHttpClient.delete.mockResolvedValue(undefined);

      await propertyService.deleteProperty(propertyId);

      expect(mockHttpClient.delete).toHaveBeenCalledWith(
        `/api/property/${propertyId}`
      );
    });

    it("throws error when property ID is empty", async () => {
      await expect(propertyService.deleteProperty("")).rejects.toThrow(
        "Property ID is required"
      );
    });

    it("handles delete errors", async () => {
      const propertyId = "123";
      mockHttpClient.delete.mockRejectedValue(new Error("Delete failed"));

      await expect(propertyService.deleteProperty(propertyId)).rejects.toThrow(
        "Failed to delete property"
      );
    });
  });

  describe("singleton instance", () => {
    it("exports singleton instance", () => {
      expect(propertyService).toBeInstanceOf(PropertyService);
    });

    it("implements IPropertyService interface", () => {
      expect(propertyService).toHaveProperty("searchProperties");
      expect(propertyService).toHaveProperty("getPropertyById");
      expect(propertyService).toHaveProperty("createProperty");
      expect(propertyService).toHaveProperty("updateProperty");
      expect(propertyService).toHaveProperty("deleteProperty");
    });
  });
});
