// Export all API services and types
export { httpClient } from "./client";
export {
  propertyService,
  type IPropertyService,
  PropertyService,
} from "./propertyService";
export { ownerService, type IOwnerService, OwnerService } from "./ownerService";

// Re-export types for convenience
export type {
  PropertyListItem,
  PropertyDetail,
  CreatePropertyRequest,
  PropertyFilters,
  OwnerListItem,
  OwnerDetail,
  CreateOwnerRequest,
} from "@/lib/types";
