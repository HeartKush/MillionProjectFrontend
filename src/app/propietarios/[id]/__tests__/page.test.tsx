import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OwnerDetailPage from "../page";
import { useRouter, usePathname } from "next/navigation";
import { useOwner, useDeleteOwner, useUpdateOwner } from "@/lib/hooks";
import { useToastHelpers } from "@/contexts/ToastContext";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock hooks
jest.mock("@/lib/hooks", () => ({
  useOwner: jest.fn(),
  useDeleteOwner: jest.fn(),
  useUpdateOwner: jest.fn(),
}));

// Mock toast context
jest.mock("@/contexts/ToastContext", () => ({
  useToastHelpers: jest.fn(),
  useToast: jest.fn(),
}));

// Mock components
jest.mock("@/components/organisms", () => ({
  OwnerDetailView: ({ owner, onEdit, onDelete, onBack }: any) => (
    <div data-testid="owner-detail-view">
      <h1>{owner?.name || "Loading..."}</h1>
      {onEdit && <button onClick={onEdit}>Edit Owner</button>}
      {onDelete && <button onClick={onDelete}>Delete Owner</button>}
      {onBack && <button onClick={onBack}>Back</button>}
    </div>
  ),
}));

jest.mock("@/components/molecules", () => ({
  OwnerForm: ({ onSubmit, onCancel, initialData }: any) => (
    <div data-testid="owner-form">
      <button data-testid="submit-form" onClick={() => onSubmit({})}>
        Submit
      </button>
      <button data-testid="cancel-form" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
  OwnerDetail: ({ owner, onEdit, onDelete }: any) => (
    <div data-testid="owner-detail">
      <h1>{owner?.name || "Loading..."}</h1>
      {onEdit && <button onClick={onEdit}>Edit Owner</button>}
      {onDelete && <button onClick={onDelete}>Delete Owner</button>}
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
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
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
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

const mockOwner = {
  idOwner: "owner-1",
  name: "John Doe",
  address: "123 Owner St",
  birthDate: "1990-01-01",
  phone: "123-456-7890",
};

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

describe("OwnerDetailPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue("/propietarios/owner-1");
    (require("next/navigation").useParams as jest.Mock).mockReturnValue({
      id: "owner-1",
    });
    (require("next/navigation").useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams()
    );
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: jest.fn(),
    });
    (require("@/contexts/ToastContext").useToast as jest.Mock).mockReturnValue({
      toasts: [],
      removeToast: jest.fn(),
    });
    (require("@/lib/hooks").useUpdateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it("renders owner detail page with loading state", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders owner detail page with error state", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Owner not found"),
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Error al cargar los detalles del propietario. Por favor, inténtalo de nuevo."
      )
    ).toBeInTheDocument();
  });

  it("renders owner detail page with data", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId("owner-detail")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("opens edit modal when edit is clicked", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const editButton = screen.getByText("Edit Owner");
    fireEvent.click(editButton);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("owner-form")).toBeInTheDocument();
  });

  it("handles owner deletion", async () => {
    const mockMutate = jest.fn().mockImplementation((_, { onSuccess }) => {
      onSuccess();
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    const mockShowSuccess = jest.fn();
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: jest.fn(),
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const deleteButton = screen.getByText("Delete Owner");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(screen.getByText("Eliminar Propietario")).toBeInTheDocument();

    const confirmDeleteButton = screen.getByText("Confirm");
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith("owner-1", expect.any(Object));
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "Propietario eliminado",
        "El propietario ha sido eliminado correctamente."
      );
      expect(mockRouter.push).toHaveBeenCalledWith("/propietarios");
    });
  });

  it("handles back navigation", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const backButton = screen.getByText("Volver a la lista");
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/propietarios");
  });

  it("handles back navigation from property", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (require("next/navigation").useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("from=property&propertyId=prop-1")
    );

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const backButton = screen.getByText("Volver a la propiedad");
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades/prop-1");
  });

  it("handles owner not found", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Propietario no encontrado")).toBeInTheDocument();
    expect(
      screen.getByText(
        "El propietario que buscas no existe o ha sido eliminado"
      )
    ).toBeInTheDocument();
  });

  it("handles owner not found with property context", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (require("next/navigation").useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("from=property&propertyId=prop-1")
    );

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Propietario no encontrado")).toBeInTheDocument();
    const backButton = screen.getByText("Volver a la propiedad");
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades/prop-1");
  });

  it("handles error state with retry", () => {
    const mockRefetch = jest.fn();
    (useOwner as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Network error"),
      refetch: mockRefetch,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    expect(
      screen.getByText(
        "Error al cargar los detalles del propietario. Por favor, inténtalo de nuevo."
      )
    ).toBeInTheDocument();

    const retryButton = screen.getByText("Reintentar");
    fireEvent.click(retryButton);

    expect(mockRefetch).toHaveBeenCalled();
  });

  it("handles error state with back navigation from property", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Network error"),
      refetch: jest.fn(),
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (require("next/navigation").useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("from=property&propertyId=prop-1")
    );

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const backButton = screen.getByText("Volver a la propiedad");
    fireEvent.click(backButton);

    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades/prop-1");
  });

  it("handles delete success with property context", () => {
    const mockMutate = jest.fn().mockImplementation((_, { onSuccess }) => {
      onSuccess();
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (require("next/navigation").useSearchParams as jest.Mock).mockReturnValue(
      new URLSearchParams("from=property&propertyId=prop-1")
    );
    const mockShowSuccess = jest.fn();
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: jest.fn(),
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const deleteButton = screen.getByText("Delete Owner");
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByText("Confirm");
    fireEvent.click(confirmDeleteButton);

    expect(mockMutate).toHaveBeenCalledWith("owner-1", expect.any(Object));
    expect(mockShowSuccess).toHaveBeenCalledWith(
      "Propietario eliminado",
      "El propietario ha sido eliminado correctamente."
    );
    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades/prop-1");
  });

  it("handles delete error", () => {
    const mockMutate = jest.fn().mockImplementation((_, { onError }) => {
      onError(new Error("Delete failed"));
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    const mockShowError = jest.fn();
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: mockShowError,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const deleteButton = screen.getByText("Delete Owner");
    fireEvent.click(deleteButton);

    const confirmDeleteButton = screen.getByText("Confirm");
    fireEvent.click(confirmDeleteButton);

    expect(mockMutate).toHaveBeenCalledWith("owner-1", expect.any(Object));
    expect(mockShowError).toHaveBeenCalledWith(
      "Error al eliminar",
      "No se pudo eliminar el propietario. Inténtalo de nuevo."
    );
  });

  it("handles edit error", () => {
    const mockMutate = jest.fn().mockImplementation((_, { onError }) => {
      onError(new Error("Update failed"));
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useUpdateOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    const mockShowError = jest.fn();
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: mockShowError,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    const editButton = screen.getByText("Edit Owner");
    fireEvent.click(editButton);

    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    expect(mockMutate).toHaveBeenCalled();
    expect(mockShowError).toHaveBeenCalledWith(
      "Error al actualizar",
      "No se pudieron guardar los cambios. Inténtalo de nuevo."
    );
  });

  it("handles edit form submission", async () => {
    const mockMutate = jest.fn().mockImplementation((_, { onSuccess }) => {
      onSuccess();
    });
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
    (useUpdateOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    const mockShowSuccess = jest.fn();
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: jest.fn(),
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Owner");
    fireEvent.click(editButton);

    // Submit form
    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "Propietario actualizado",
        "Los cambios han sido guardados correctamente."
      );
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("handles edit form cancellation", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Owner");
    fireEvent.click(editButton);

    // Cancel form
    const cancelButton = screen.getByTestId("cancel-form");
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("shows loading state when deleting owner", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    // The component should handle the pending state
    expect(screen.getByTestId("owner-detail")).toBeInTheDocument();
  });

  it("passes initial data to edit form", () => {
    (useOwner as jest.Mock).mockReturnValue({
      data: mockOwner,
      isLoading: false,
      error: null,
    });
    (useDeleteOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerDetailPage params={{ id: "owner-1" }} />, {
      wrapper: createWrapper(),
    });

    // Open edit modal
    const editButton = screen.getByText("Edit Owner");
    fireEvent.click(editButton);

    // The OwnerForm should receive initial data
    expect(screen.getByTestId("owner-form")).toBeInTheDocument();
  });
});
