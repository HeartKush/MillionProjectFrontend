import axios from "axios";
import { OwnerService, ownerService } from "../ownerService";
import { httpClient } from "../client";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  OwnerListItem,
  OwnerDetail,
  CreateOwnerRequest,
} from "@/lib/types";

// Mock dependencies
jest.mock("../client");
jest.mock("@/lib/constants", () => ({
  API_ENDPOINTS: {
    OWNERS: "/api/owners",
  },
}));

const mockHttpClient = httpClient as jest.Mocked<typeof httpClient>;

// Mock console methods to avoid noise in tests
const consoleSpy = {
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
};

describe("OwnerService", () => {
  let ownerServiceInstance: OwnerService;

  beforeEach(() => {
    jest.clearAllMocks();
    ownerServiceInstance = new OwnerService();
  });

  afterEach(() => {
    consoleSpy.error.mockClear();
  });

  afterAll(() => {
    consoleSpy.error.mockRestore();
  });

  describe("searchOwners", () => {
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

    it("should search owners without name filter", async () => {
      mockHttpClient.get.mockResolvedValue(mockOwners);

      const result = await ownerServiceInstance.searchOwners();

      expect(mockHttpClient.get).toHaveBeenCalledWith("/api/owners");
      expect(result).toEqual(mockOwners);
    });

    it("should search owners with name filter", async () => {
      mockHttpClient.get.mockResolvedValue([mockOwners[0]]);

      const result = await ownerServiceInstance.searchOwners("John");

      expect(mockHttpClient.get).toHaveBeenCalledWith("/api/owners?name=John");
      expect(result).toEqual([mockOwners[0]]);
    });

    it("should handle search errors", async () => {
      const error = new Error("Network error");
      mockHttpClient.get.mockRejectedValue(error);

      await expect(ownerServiceInstance.searchOwners()).rejects.toThrow(
        "Failed to search owners"
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error searching owners:",
        error
      );
    });
  });

  describe("getOwnerById", () => {
    const mockOwner: OwnerDetail = {
      idOwner: "1",
      name: "John Doe",
      address: "123 Main St",
      photo: "photo1.jpg",
      birthday: "1990-01-01T00:00:00.000Z",
      properties: [],
    };

    it("should get owner by id successfully", async () => {
      mockHttpClient.get.mockResolvedValue(mockOwner);

      const result = await ownerServiceInstance.getOwnerById("1");

      expect(mockHttpClient.get).toHaveBeenCalledWith("/api/owners/1");
      expect(result).toEqual(mockOwner);
    });

    it("should throw error when id is not provided", async () => {
      await expect(ownerServiceInstance.getOwnerById("")).rejects.toThrow(
        "Owner ID is required"
      );
      expect(mockHttpClient.get).not.toHaveBeenCalled();
    });

    it("should return null for 404 errors", async () => {
      const error = {
        response: { status: 404 },
        isAxiosError: true,
      };
      mockHttpClient.get.mockRejectedValue(error);

      const result = await ownerServiceInstance.getOwnerById("1");

      expect(result).toBeNull();
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error fetching owner:",
        error
      );
    });

    it("should handle other errors", async () => {
      const error = new Error("Server error");
      mockHttpClient.get.mockRejectedValue(error);

      await expect(ownerServiceInstance.getOwnerById("1")).rejects.toThrow(
        "Failed to fetch owner"
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error fetching owner:",
        error
      );
    });
  });

  describe("createOwner", () => {
    const mockCreateRequest: CreateOwnerRequest = {
      name: "John Doe",
      address: "123 Main St",
      photo: "photo1.jpg",
      birthday: "1990-01-01T00:00:00.000Z",
    };

    it("should create owner successfully", async () => {
      const mockResponse = { id: "new-id" };
      mockHttpClient.post.mockResolvedValue(mockResponse);

      const result = await ownerServiceInstance.createOwner(mockCreateRequest);

      expect(mockHttpClient.post).toHaveBeenCalledWith(
        "/api/owners",
        mockCreateRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when name is not provided", async () => {
      const invalidRequest = { ...mockCreateRequest, name: "" };

      await expect(
        ownerServiceInstance.createOwner(invalidRequest)
      ).rejects.toThrow("Name is required");
      expect(mockHttpClient.post).not.toHaveBeenCalled();
    });

    it("should handle creation errors", async () => {
      const error = new Error("Creation failed");
      mockHttpClient.post.mockRejectedValue(error);

      await expect(
        ownerServiceInstance.createOwner(mockCreateRequest)
      ).rejects.toThrow("Failed to create owner");
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error creating owner:",
        error
      );
    });
  });

  describe("updateOwner", () => {
    const mockUpdateRequest: CreateOwnerRequest = {
      name: "John Updated",
      address: "456 New St",
      photo: "new-photo.jpg",
      birthday: "1990-01-01T00:00:00.000Z",
    };

    it("should update owner successfully", async () => {
      const mockResponse = { id: "1" };
      mockHttpClient.put.mockResolvedValue(mockResponse);

      const result = await ownerServiceInstance.updateOwner(
        "1",
        mockUpdateRequest
      );

      expect(mockHttpClient.put).toHaveBeenCalledWith(
        "/api/owners/1",
        mockUpdateRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it("should throw error when id is not provided", async () => {
      await expect(
        ownerServiceInstance.updateOwner("", mockUpdateRequest)
      ).rejects.toThrow("Owner ID is required");
      expect(mockHttpClient.put).not.toHaveBeenCalled();
    });

    it("should throw error when name is not provided", async () => {
      const invalidRequest = { ...mockUpdateRequest, name: "" };

      await expect(
        ownerServiceInstance.updateOwner("1", invalidRequest)
      ).rejects.toThrow("Name is required");
      expect(mockHttpClient.put).not.toHaveBeenCalled();
    });

    it("should handle update errors", async () => {
      const error = new Error("Update failed");
      mockHttpClient.put.mockRejectedValue(error);

      await expect(
        ownerServiceInstance.updateOwner("1", mockUpdateRequest)
      ).rejects.toThrow("Failed to update owner");
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error updating owner:",
        error
      );
    });
  });

  describe("deleteOwner", () => {
    it("should delete owner successfully", async () => {
      mockHttpClient.delete.mockResolvedValue(undefined);

      await ownerServiceInstance.deleteOwner("1");

      expect(mockHttpClient.delete).toHaveBeenCalledWith("/api/owners/1");
    });

    it("should throw error when id is not provided", async () => {
      await expect(ownerServiceInstance.deleteOwner("")).rejects.toThrow(
        "Owner ID is required"
      );
      expect(mockHttpClient.delete).not.toHaveBeenCalled();
    });

    it("should handle deletion errors", async () => {
      const error = new Error("Deletion failed");
      mockHttpClient.delete.mockRejectedValue(error);

      await expect(ownerServiceInstance.deleteOwner("1")).rejects.toThrow(
        "Failed to delete owner"
      );
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Error deleting owner:",
        error
      );
    });
  });

  describe("singleton instance", () => {
    it("should export singleton instance", () => {
      expect(ownerService).toBeInstanceOf(OwnerService);
    });
  });
});
