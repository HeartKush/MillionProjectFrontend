import axios from "axios";
import { httpClient } from "./client";
import { API_ENDPOINTS } from "@/lib/constants";
import type {
  OwnerListItem,
  OwnerDetail,
  CreateOwnerRequest,
} from "@/lib/types";

/**
 * Owner Service Interface
 * Follows Interface Segregation Principle - only exposes owner-related methods
 */
export interface IOwnerService {
  searchOwners(name?: string, address?: string): Promise<OwnerListItem[]>;
  getOwnerById(id: string): Promise<OwnerDetail | null>;
  createOwner(owner: CreateOwnerRequest): Promise<{ id: string }>;
  updateOwner(id: string, owner: CreateOwnerRequest): Promise<{ id: string }>;
  deleteOwner(id: string): Promise<void>;
}

/**
 * Owner Service Implementation
 * Follows Single Responsibility Principle - only handles owner operations
 */
export class OwnerService implements IOwnerService {
  private readonly baseEndpoint = API_ENDPOINTS.OWNERS;

  async searchOwners(
    name?: string,
    address?: string
  ): Promise<OwnerListItem[]> {
    try {
      const queryParams = new URLSearchParams();

      if (name) queryParams.append("name", name);
      if (address) queryParams.append("address", address);

      const queryString = queryParams.toString();
      const url = queryString
        ? `${this.baseEndpoint}?${queryString}`
        : this.baseEndpoint;

      return await httpClient.get<OwnerListItem[]>(url);
    } catch (error) {
      console.error("Error searching owners:", error);
      throw new Error("Failed to search owners");
    }
  }

  async getOwnerById(id: string): Promise<OwnerDetail | null> {
    if (!id) {
      throw new Error("Owner ID is required");
    }

    try {
      return await httpClient.get<OwnerDetail>(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error("Error fetching owner:", error);
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw new Error("Failed to fetch owner");
    }
  }

  async createOwner(owner: CreateOwnerRequest): Promise<{ id: string }> {
    if (!owner.name) {
      throw new Error("Name is required");
    }

    try {
      return await httpClient.post<{ id: string }>(this.baseEndpoint, owner);
    } catch (error) {
      console.error("Error creating owner:", error);
      throw new Error("Failed to create owner");
    }
  }

  async updateOwner(
    id: string,
    owner: CreateOwnerRequest
  ): Promise<{ id: string }> {
    if (!id) {
      throw new Error("Owner ID is required");
    }

    if (!owner.name) {
      throw new Error("Name is required");
    }

    try {
      return await httpClient.put<{ id: string }>(
        `${this.baseEndpoint}/${id}`,
        owner
      );
    } catch (error) {
      console.error("Error updating owner:", error);
      throw new Error("Failed to update owner");
    }
  }

  async deleteOwner(id: string): Promise<void> {
    if (!id) {
      throw new Error("Owner ID is required");
    }

    try {
      await httpClient.delete(`${this.baseEndpoint}/${id}`);
    } catch (error) {
      console.error("Error deleting owner:", error);
      throw new Error("Failed to delete owner");
    }
  }
}

// Export singleton instance
export const ownerService = new OwnerService();
