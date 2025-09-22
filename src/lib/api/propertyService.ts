import axios from "axios";
import { httpClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  PropertyListItem,
  PropertyDetail,
  CreatePropertyRequest,
  PropertyFilters,
} from "@/lib/types";

/**
 * Property Service Interface
 * Follows Interface Segregation Principle - only exposes property-related methods
 */
export interface IPropertyService {
  searchProperties(filters: PropertyFilters): Promise<PropertyListItem[]>;
  getPropertyById(id: string): Promise<PropertyDetail | null>;
  createProperty(property: CreatePropertyRequest): Promise<{ id: string }>;
  updateProperty(
    id: string,
    property: CreatePropertyRequest
  ): Promise<{ id: string }>;
  deleteProperty(id: string): Promise<void>;
}

/**
 * Property Service Implementation
 * Follows Single Responsibility Principle - only handles property operations
 */
export class PropertyService implements IPropertyService {
  private readonly baseEndpoint = API_ENDPOINTS.PROPERTIES;

  async searchProperties(
    filters: PropertyFilters
  ): Promise<PropertyListItem[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters.name) queryParams.append("name", filters.name);
      if (filters.address) queryParams.append("address", filters.address);
      if (filters.minPrice !== undefined && !isNaN(filters.minPrice))
        queryParams.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice !== undefined && !isNaN(filters.maxPrice))
        queryParams.append("maxPrice", filters.maxPrice.toString());
      if (filters.idOwner) queryParams.append("idOwner", filters.idOwner);

      const queryString = queryParams.toString();
      const url = queryString
        ? `${this.baseEndpoint}?${queryString}`
        : this.baseEndpoint;

      return await httpClient.get<PropertyListItem[]>(url);
    } catch (error) {
      console.error("Error searching properties:", error);
      throw new Error("Failed to search properties");
    }
  }

  async getPropertyById(id: string): Promise<PropertyDetail | null> {
    if (!id) {
      throw new Error("Property ID is required");
    }

    try {
      return await httpClient.get<PropertyDetail>(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error("Error fetching property:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch property");
    }
  }

  async createProperty(
    property: CreatePropertyRequest
  ): Promise<{ id: string }> {
    if (!property.name || !property.address) {
      throw new Error("Name and address are required");
    }

    try {
      return await httpClient.post<{ id: string }>(this.baseEndpoint, property);
    } catch (error) {
      console.error("Error creating property:", error);
      throw new Error("Failed to create property");
    }
  }

  async updateProperty(
    id: string,
    property: CreatePropertyRequest
  ): Promise<{ id: string }> {
    if (!id) {
      throw new Error("Property ID is required");
    }

    if (!property.name || !property.address) {
      throw new Error("Name and address are required");
    }

    try {
      return await httpClient.put<{ id: string }>(
        `${this.baseEndpoint}/${id}`,
        property
      );
    } catch (error) {
      console.error("Error updating property:", error);
      throw new Error("Failed to update property");
    }
  }

  async deleteProperty(id: string): Promise<void> {
    if (!id) {
      throw new Error("Property ID is required");
    }

    try {
      await httpClient.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error("Error deleting property:", error);
      throw new Error("Failed to delete property");
    }
  }
}

// Export singleton instance
export const propertyService = new PropertyService();
