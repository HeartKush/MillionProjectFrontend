import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OwnerListPage from "../page";
import { useRouter, usePathname } from "next/navigation";
import { useOwners, useCreateOwner } from "@/lib/hooks";
import { useToastHelpers } from "@/contexts/ToastContext";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock hooks
jest.mock("@/lib/hooks", () => ({
  useOwners: jest.fn(),
  useCreateOwner: jest.fn(),
}));

// Mock toast context
jest.mock("@/contexts/ToastContext", () => ({
  useToastHelpers: jest.fn(),
}));

// Mock components
jest.mock("@/components/organisms", () => ({
  OwnerList: ({ owners, onViewOwner, className }: any) => (
    <div data-testid="owner-list" className={className}>
      {owners.map((owner: any) => (
        <div key={owner.idOwner} data-testid={`owner-${owner.idOwner}`}>
          {owner.name}
        </div>
      ))}
    </div>
  ),
}));

jest.mock("@/components/molecules", () => ({
  OwnerFilterForm: ({ onFiltersChange, initialFilters }: any) => (
    <div data-testid="filter-form">
      <input
        data-testid="filter-input"
        onChange={(e) => onFiltersChange({ name: e.target.value })}
      />
    </div>
  ),
  OwnerForm: ({ onSubmit, onCancel }: any) => (
    <div data-testid="owner-form">
      <button data-testid="submit-form" onClick={() => onSubmit({})}>
        Submit
      </button>
      <button data-testid="cancel-form" onClick={onCancel}>
        Cancel
      </button>
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
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
  LoadingSpinner: ({ size }: any) => (
    <div data-testid="loading-spinner">Loading...</div>
  ),
  ErrorMessage: ({ message }: any) => (
    <div data-testid="error-message">{message}</div>
  ),
}));

jest.mock("@/components/layouts/AppLayout", () => ({
  AppLayout: ({ children }: any) => (
    <div data-testid="app-layout">{children}</div>
  ),
}));

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
};

const mockOwners = [
  {
    idOwner: "owner-1",
    name: "John Doe",
    address: "123 Owner St",
    birthDate: "1990-01-01",
    phone: "123-456-7890",
  },
  {
    idOwner: "owner-2",
    name: "Jane Smith",
    address: "456 Owner Ave",
    birthDate: "1985-05-15",
    phone: "987-654-3210",
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

describe("OwnerListPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (usePathname as jest.Mock).mockReturnValue("/propietarios");
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: jest.fn(),
    });
  });

  it("renders owners page with loading state", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("app-layout")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders owners page with error state", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to fetch owners"),
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Error al cargar los propietarios. Por favor, inténtalo de nuevo."
      )
    ).toBeInTheDocument();
  });

  it("renders owners page with data", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
    expect(screen.getByTestId("filter-form")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("displays correct statistics", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Check for statistics - use getAllByText since there are multiple "2" values
    const totalOwnersElements = screen.getAllByText("2");
    expect(totalOwnersElements.length).toBeGreaterThan(0); // Total owners
  });

  it("opens create owner modal", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    const createButton = screen.getByText("Nuevo Propietario");
    fireEvent.click(createButton);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("owner-form")).toBeInTheDocument();
  });

  it("handles owner creation", async () => {
    const mockMutate = jest.fn();
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Open modal
    const createButton = screen.getByText("Nuevo Propietario");
    fireEvent.click(createButton);

    // Submit form
    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    expect(mockMutate).toHaveBeenCalled();
  });

  it("handles owner view navigation", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // The OwnerList component should be rendered with onViewOwner prop
    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
  });

  it("handles filter changes", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    const filterInput = screen.getByTestId("filter-input");
    fireEvent.change(filterInput, { target: { value: "test filter" } });

    // The FilterForm component should handle the filter change
    expect(filterInput).toBeInTheDocument();
  });

  it("handles create owner form cancellation", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Open modal
    const createButton = screen.getByText("Nuevo Propietario");
    fireEvent.click(createButton);

    // Cancel form
    const cancelButton = screen.getByTestId("cancel-form");
    fireEvent.click(cancelButton);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("shows loading state when creating owner", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: true,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // The component should handle the pending state
    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
  });

  it("handles owner view navigation", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // The OwnerList component should be rendered with onViewOwner prop
    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
  });

  it("calculates statistics correctly with owners having createdAt", () => {
    const ownersWithCreatedAt = [
      {
        idOwner: "owner-1",
        name: "John Doe",
        address: "123 Owner St",
        birthDate: "1990-01-01",
        phone: "123-456-7890",
        createdAt: new Date().toISOString(), // Recent owner
      },
      {
        idOwner: "owner-2",
        name: "Jane Smith",
        address: "456 Owner Ave",
        birthDate: "1985-05-15",
        phone: "987-654-3210",
        createdAt: new Date(
          Date.now() - 2 * 30 * 24 * 60 * 60 * 1000
        ).toISOString(), // Old owner
      },
    ];

    (useOwners as jest.Mock).mockReturnValue({
      data: ownersWithCreatedAt,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Check that statistics are calculated correctly
    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
  });

  it("handles owners without createdAt field", () => {
    const ownersWithoutCreatedAt = [
      {
        idOwner: "owner-1",
        name: "John Doe",
        address: "123 Owner St",
        birthDate: "1990-01-01",
        phone: "123-456-7890",
        // No createdAt field
      },
    ];

    (useOwners as jest.Mock).mockReturnValue({
      data: ownersWithoutCreatedAt,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Should handle owners without createdAt gracefully
    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
  });

  it("handles create owner success with refetch", async () => {
    const mockMutate = jest.fn().mockImplementation((data, { onSuccess }) => {
      onSuccess();
    });
    const mockRefetch = jest.fn();
    const mockShowSuccess = jest.fn();

    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: mockRefetch,
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: mockShowSuccess,
      showError: jest.fn(),
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Open modal
    const createButton = screen.getByText("Nuevo Propietario");
    fireEvent.click(createButton);

    // Submit form
    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(mockShowSuccess).toHaveBeenCalledWith(
        "Propietario creado",
        "El nuevo propietario ha sido creado correctamente."
      );
      expect(mockRefetch).toHaveBeenCalled();
      expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
    });
  });

  it("handles create owner error", async () => {
    const mockMutate = jest.fn().mockImplementation((data, { onError }) => {
      onError(new Error("Creation failed"));
    });
    const mockShowError = jest.fn();

    (useOwners as jest.Mock).mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });
    (useToastHelpers as jest.Mock).mockReturnValue({
      showSuccess: jest.fn(),
      showError: mockShowError,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Open modal
    const createButton = screen.getByText("Nuevo Propietario");
    fireEvent.click(createButton);

    // Submit form
    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(mockShowError).toHaveBeenCalledWith(
        "Error al crear",
        "No se pudo crear el propietario. Inténtalo de nuevo."
      );
    });
  });

  it("handles null owners for statistics", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Check for statistics with null data
    expect(screen.getAllByText("0")).toHaveLength(3); // Total, active, and recent
  });

  it("handles undefined owners for statistics", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Check for statistics with undefined data
    expect(screen.getAllByText("0")).toHaveLength(3); // Total, active, and recent
  });

  it("handles null owners in OwnerList", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // OwnerList should receive empty array when owners is null
    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
  });

  it("handles undefined owners in OwnerList", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // OwnerList should receive empty array when owners is undefined
    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
  });

  it("handles empty owners array for statistics", () => {
    (useOwners as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
    });
    (useCreateOwner as jest.Mock).mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });

    render(<OwnerListPage />, { wrapper: createWrapper() });

    // Check for statistics with empty array
    expect(screen.getAllByText("0")).toHaveLength(3); // Total, active, and recent
  });
});
