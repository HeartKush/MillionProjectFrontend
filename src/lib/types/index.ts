// API Response Types
export interface PropertyListItem {
  idProperty?: string;
  idOwner?: string;
  name?: string;
  address?: string;
  price: number;
  imageUrl?: string;
}

export interface PropertyDetail {
  idProperty?: string;
  idOwner?: string;
  name?: string;
  address?: string;
  price: number;
  codeInternal?: string;
  year: number;
  imageUrl?: string;
}

export interface OwnerListItem {
  idOwner?: string;
  name?: string;
  photo?: string;
  address?: string;
  birthday?: string;
}

export interface OwnerDetail {
  idOwner?: string;
  name?: string;
  address?: string;
  photo?: string;
  birthday?: string;
}

// API Request Types
export interface CreatePropertyRequest {
  name?: string;
  address?: string;
  price: number;
  codeInternal?: string;
  year: number;
  idOwner?: string;
  imageUrl?: string;
  imageEnabled?: boolean;
}

export interface CreateOwnerRequest {
  name?: string;
  address?: string;
  photo?: string;
  birthday?: string;
}

// Filter Types
export interface PropertyFilters {
  name?: string;
  address?: string;
  minPrice?: number;
  maxPrice?: number;
}

// UI State Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: "primary" | "secondary" | "success" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export interface InputProps extends BaseComponentProps {
  id?: string;
  type?: "text" | "email" | "password" | "number" | "tel" | "url" | "date";
  placeholder?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export interface CardProps extends BaseComponentProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  actions?: React.ReactNode;
}

// Notification Types
export interface NotificationProps {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Theme Types
export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}