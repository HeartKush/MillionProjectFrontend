import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PropertyDetailPage from "../page";
import { useRouter } from "next/navigation";
import {
  useProperty,
  useDeleteProperty,
  useUpdateProperty,
  useOwners,
  useOwner,
} from "@/lib/hooks";
import { useToastHelpers } from "@/contexts/ToastContext";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock hooks
jest.mock("@/lib/hooks", () => ({
  useProperty: jest.fn(),
  useDeleteProperty: jest.fn(),
  useUpdateProperty: jest.fn(),
  useOwners: jest.fn(),
  useOwner: jest.fn(),
}));

// Mock toast context
jest.mock("@/contexts/ToastContext", () => ({
  useToastHelpers: jest.fn(),
  useToast: jest.fn(),
}));

// Mock components
jest.mock("@/components/organisms", () => ({
  PropertyDetailView: ({ property, onEdit, onDelete, onBack }: any) => (
    <div data-testid="property-detail-view">
      <h1>{property?.name || "Loading..."}</h1>
      {onEdit && <button onClick={onEdit}>Edit Property</button>}
      {onDelete && <button onClick={onDelete}>Delete Property</button>}
      {onBack && <button onClick={onBack}>Volver a la lista</button>}
    </div>
  ),
}));

jest.mock("@/components/molecules", () => ({
  PropertyForm: ({ onSubmit, onCancel, owners, ownersLoading }: any) => (
    <div data-testid="property-form">
      <button data-testid="submit-form" onClick={() => onSubmit({})}>
        Submit
      </button>
      <button data-testid="cancel-form" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
  ConfirmModal: ({ isOpen, onClose, onConfirm, title, message }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm}>Confirm</button>
      </div>
    ) : null,
  PropertyDetail: ({ property, onEdit, onDelete, ownerName }: any) => (
    <div data-testid="property-detail">
      <h1>{property?.name || "Loading..."}</h1>
      <p>Owner: {ownerName || "Sin asignar"}</p>
      {onEdit && <button onClick={onEdit}>Edit Property</button>}
      {onDelete && <button onClick={onDelete}>Delete Property</button>}
    </div>
  ),
}));

jest.mock("@/components/atoms", () => ({
  Modal: ({ children, isOpen, onClose, title }: any) =>
    isOpen ? (
      <div data-testid="modal" data-title={title}>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
  LoadingSpinner: ({ size }: any) => (
    <div data-testid="loading-spinner">Loading...</div>
  ),
  ErrorMessage: ({ message }: any) => (
    <div data-testid="error-message">{message}</div>
  ),
  ToastContainer: ({ toasts, onClose }: any) => (
    <div data-testid="toast-container">
      {toasts.map((toast: any) => (
        <div key={toast.id} onClick={() => onClose(toast.id)}>
          {toast.title}
        </div>
      ))}
    </div>
  ),
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

const mockProperty = {
  id: "prop-1",
  name: "Test Property",
  address: "123 Test St",
  price: 1000000,
  year: 2020,
  codeInternal: "PROP-001",
  idOwner: "owner-1",
  imageUrl: "https://example.com/image.jpg",
  featured: true,
  hasTransactions: false,
};

const mockOwners = [
  {
    idOwner: "owner-1",
    name: "John Doe",
    address: "123 Owner St",
    birthDate: "1990-01-01",
    phone: "123-456-7890",
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("PropertyDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (require("next/navigation").useParams as jest.Mock).mockReturnValue({
      id: "prop-1",
    });
    (require("next/navigation").usePathname as jest.Mock).mockReturnValue(
      "/propiedades/prop-1"
    );
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: jest.fn(),
    });
    (require("@/contexts/ToastContext").useToast as jest.Mock).mockReturnValue({
      toasts: [],
      removeToast: jest.fn(),
    });
    (useUpdateProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    });
  });

  it("renders property detail page with loading state", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders property detail page with error state", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Property not found"),
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Error al cargar los detalles de la propiedad. Por favor, inténtalo de nuevo."
      )
    ).toBeInTheDocument();
  });

  it("renders property detail page with data", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("opens edit modal when edit is clicked", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    const editButton = screen.getByText("Edit Property");
    fireEvent.click(editButton);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("property-form")).toBeInTheDocument();
  });

  it("handles property deletion", async () => {
    const mockMutate = jest.fn().mockImplementation((_, { onSuccess }) => {
      onSuccess();
    });
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwners[0],
      isLoading: false,
      error: null,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    const mockShowSuccess = jest.fn();
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: jest.fn(),
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    const deleteButton = screen.getByText("Delete Property");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(screen.getByText("Eliminar Propiedad")).toBeInTheDocument();

    const confirmDeleteButton = screen.getByText("Confirm");
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("prop-1", expect.any(Object));
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "Propiedad eliminada",
        "La propiedad ha sido eliminada correctamente."
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/propiedades");
    });
  });

  it("handles back navigation", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    const backButton = screen.getByText("Volver a la lista");
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades");
  });

  it("handles edit form submission", async () => {
    const mockMutate = jest.fn().mockImplementation((_, { onSuccess }) => {
      onSuccess();
    });
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwners[0],
      isLoading: false,
      error: null,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useUpdateProperty as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    const mockShowSuccess = jest.fn();
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: jest.fn(),
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Property");
    fireEvent.click(editButton);

    // Submit form
    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "Propiedad actualizada",
        "Los cambios han sido guardados correctamente."
      );
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("handles edit form cancellation", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Property");
    fireEvent.click(editButton);

    // Cancel form
    const cancelButton = screen.getByTestId("cancel-form");
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("shows loading state when deleting property", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    // The component should handle the pending state
    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
  });

  it("renders property not found when property is null", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Propiedad no encontrada")).toBeInTheDocument();
    expect(
      screen.getByText("La propiedad que buscas no existe o ha sido eliminada")
    ).toBeInTheDocument();
  });

  it("handles property with no owner", () => {
    const propertyWithoutOwner = { ...mockProperty, idOwner: null };
    (useProperty as jest.Mock).mockReturnValue({
      data: propertyWithoutOwner,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("handles null owners in PropertyForm", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Property");
    fireEvent.click(editButton);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("property-form")).toBeInTheDocument();
  });

  it("handles owners loading state in PropertyForm", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: true,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Property");
    fireEvent.click(editButton);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("property-form")).toBeInTheDocument();
  });

  it("handles delete property error", async () => {
    const mockMutate = jest.fn().mockImplementation((_, { onError }) => {
      onError(new Error("Delete failed"));
    });
    const mockShowError = jest.fn();
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: mockShowError,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    const deleteButton = screen.getByText("Delete Property");
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByText("Confirm");
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("prop-1", expect.any(Object));
      expect(mockShowError).toHaveBeenCalledWith(
        "Error al eliminar",
        "No se pudo eliminar la propiedad. Inténtalo de nuevo."
      );
    });
  });

  it("handles edit property error", async () => {
    const mockMutate = jest.fn().mockImplementation((_, { onError }) => {
      onError(new Error("Update failed"));
    });
    const mockShowError = jest.fn();
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useUpdateProperty as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: mockShowError,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Property");
    fireEvent.click(editButton);

    // Submit form
    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(mockShowError).toHaveBeenCalledWith(
        "Error al actualizar",
        "No se pudieron guardar los cambios. Inténtalo de nuevo."
      );
    });
  });

  it("handles delete modal cancellation", () => {
    (useProperty as jest.Mock).mockReturnValue({
      data: mockProperty,
      isLoading: false,
      error: null,
    });
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
    });
    (useDeleteProperty as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<PropertyDetailPage params={{ id: "prop-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open delete modal
    const deleteButton = screen.getByText("Delete Property");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    // Cancel delete
    const cancelButton = screen.getByText("Cancel");
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
  });
});
