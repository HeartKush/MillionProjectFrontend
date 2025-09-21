import axios from "axios";
import { httpClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  PropertyTraceListItem,
  CreatePropertyTraceRequest,
} from "@/lib/types";

/**
 * Property Trace Service Interface
 * Follows Interface Segregation Principle - only exposes property trace-related methods
 */
export interface IPropertyTraceService {
  getByPropertyId(propertyId: string): Promise<PropertyTraceListItem[]>;
  getById(traceId: string): Promise<PropertyTraceListItem | null>;
  createPropertyTrace(
    trace: CreatePropertyTraceRequest
  ): Promise<{ id: string }>;
  updatePropertyTrace(traceId: string, trace: CreatePropertyTraceRequest): Promise<void>;
  deletePropertyTrace(traceId: string): Promise<void>;
}

/**
 * Property Trace Service Implementation
 * Follows Single Responsibility Principle - only handles property trace operations
 */
export class PropertyTraceService implements IPropertyTraceService {
  private readonly baseEndpoint = API_ENDPOINTS.PROPERTY_TRACES;

  async getByPropertyId(propertyId: string): Promise<PropertyTraceListItem[]> {
    if (!propertyId) {
      throw new Error("Property ID is required");
    }

    try {
      return await httpClient.get<PropertyTraceListItem[]>(
        `${this.baseEndpoint}/by-property/${propertyId}`
      );
    } catch (error) {
      console.error("Error fetching property traces:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return [];
      }
      throw new Error("Failed to fetch property traces");
    }
  }

  async getById(traceId: string): Promise<PropertyTraceListItem | null> {
    if (!traceId) {
      throw new Error("Trace ID is required");
    }

    try {
      return await httpClient.get<PropertyTraceListItem>(`${this.baseEndpoint}/${traceId}`);
    } catch (error) {
      console.error("Error fetching property trace:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch property trace");
    }
  }

  async createPropertyTrace(
    trace: CreatePropertyTraceRequest
  ): Promise<{ id: string }> {
    if (!trace.idProperty) {
      throw new Error("Property ID is required");
    }

    try {
      return await httpClient.post<{ id: string }>(this.baseEndpoint, trace);
    } catch (error) {
      console.error("Error creating property trace:", error);
      throw new Error("Failed to create property trace");
    }
  }

  async updatePropertyTrace(traceId: string, trace: CreatePropertyTraceRequest): Promise<void> {
    if (!traceId) {
      throw new Error("Trace ID is required");
    }

    if (!trace.idProperty) {
      throw new Error("Property ID is required");
    }

    try {
      await httpClient.put(`${this.baseEndpoint}/${traceId}`, trace);
    } catch (error) {
      console.error("Error updating property trace:", error);
      throw new Error("Failed to update property trace");
    }
  }

  async deletePropertyTrace(traceId: string): Promise<void> {
    if (!traceId) {
      throw new Error("Trace ID is required");
    }

    try {
      await httpClient.delete(`${this.baseEndpoint}/${traceId}`);
    } catch (error) {
      console.error("Error deleting property trace:", error);
      throw new Error("Failed to delete property trace");
    }
  }
}

// Export singleton instance
export const propertyTraceService = new PropertyTraceService();
