// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5120";
export const API_ENDPOINTS = {
  PROPERTIES: "/api/property",
  OWNERS: "/api/owner",
  PROPERTY_TRACES: "/api/propertytrace",
  AUTH: "/api/auth",
} as const;

// UI Constants
export const UI_CONSTANTS = {
  DEBOUNCE_DELAY: 300,
  ITEMS_PER_PAGE: 12,
  MAX_PRICE: 10000000,
  MIN_PRICE: 0,
} as const;

// Currency Formatting
export const CURRENCY_FORMAT = {
  locale: "es-CO",
  currency: "COP",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const;

// Animation durations
export const ANIMATION_DURATION = {
  fast: "150ms",
  normal: "300ms",
  slow: "500ms",
} as const;

// Z-index layers
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
} as const;
