import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock Next.js router
const mockPush = jest.fn();
const mockBack = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(() => ({
    push: mockPush,
    back: mockBack,
  })),
}));

// Mock the toast helpers
jest.mock("@/contexts/ToastContext", () => ({
  useToastHelpers: () => ({
    showSuccess: jest.fn(),
    showError: jest.fn(),
  }),
}));

// Mock the property traces hook
jest.mock("@/lib/hooks/usePropertyTraces", () => ({
  usePropertyTraces: () => ({
    data: [],
    isLoading: false,
    error: null,
  }),
}));

// Mock the owner hook
jest.mock("@/lib/hooks/useOwners", () => ({
  useOwner: () => ({
    data: {
      idOwner: "owner-1",
      name: "Test Owner",
      address: "Owner Address",
      createdAt: "2024-01-01T00:00:00Z",
    },
    isLoading: false,
    error: null,
  }),
}));

// Mock the property traces hook
const mockCreateTrace = jest.fn();
const mockUpdateTrace = jest.fn();
const mockDeleteTrace = jest.fn();
const mockUsePropertyTraces = jest.fn();

jest.mock("@/lib/hooks/usePropertyTraces", () => ({
  usePropertyTraces: () => mockUsePropertyTraces(),
  useCreatePropertyTrace: () => ({
    mutate: mockCreateTrace,
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
  }),
  useUpdatePropertyTrace: () => ({
    mutate: mockUpdateTrace,
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
  }),
  useDeletePropertyTrace: () => ({
    mutate: mockDeleteTrace,
    mutateAsync: jest.fn().mockResolvedValue({}),
    isPending: false,
    error: null,
  }),
}));

// Mock the Card component and utility functions
jest.mock("@/components/atoms", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="property-detail" className={className}>
      {children}
    </div>
  ),
  Button: ({ children, onClick, variant, className, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
  Modal: ({ children, isOpen, onClose, title, size }: any) =>
    isOpen ? (
      <div data-testid="modal" data-title={title} data-size={size}>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

// Mock the molecules components
jest.mock("@/components/molecules", () => ({
  PropertyTraceModal: ({
    isOpen,
    onClose,
    onSubmit,
    propertyId,
    initialData,
  }: any) =>
    isOpen ? (
      <div data-testid="property-trace-modal" data-property-id={propertyId}>
        <button onClick={onClose}>Close Trace Modal</button>
        <button
          onClick={() =>
            onSubmit({
              dateSale: "2024-01-01",
              name: "Test",
              value: 1000000,
              tax: 10000,
              idProperty: propertyId,
            })
          }
        >
          Submit Trace
        </button>
        {initialData && <div data-testid="edit-mode">Edit Mode</div>}
      </div>
    ) : null,
  ConfirmModal: ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading,
  }: any) =>
    isOpen ? (
      <div data-testid="confirm-modal" data-title={title}>
        <p>{message}</p>
        <button onClick={onClose}>Cancel</button>
        <button onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Deleting..." : "Confirm"}
        </button>
      </div>
    ) : null,
  PropertyTraceList: ({
    traces,
    isLoading,
    error,
    onCreate,
    onEdit,
    onDelete,
  }: any) => (
    <div data-testid="property-trace-list">
      <h3>Property Traces</h3>
      {isLoading && <div>Loading traces...</div>}
      {error && <div>Error: {error}</div>}
      <button onClick={onCreate}>Create Trace</button>
      {traces && traces.length > 0 && (
        <div>
          {traces.map((trace: any, index: number) => (
            <div key={index}>
              Trace {index + 1}
              <button onClick={() => onEdit(trace)}>Edit</button>
              <button onClick={() => onDelete(trace.idTrace || trace.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  ),
}));

jest.mock("@/lib/utils", () => ({
  formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
}));

// Import the real component
import { PropertyDetail } from "../PropertyDetail";

const mockProperty = {
  idProperty: "prop-1",
  idOwner: "owner-1",
  name: "Test Property",
  address: "123 Test Street",
  price: 1000000,
  imageUrl: "https://example.com/image.jpg",
  year: 2020,
  codeInternal: "PROP-001",
  createdAt: "2024-01-01T00:00:00Z",
};

describe("PropertyDetail Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePropertyTraces.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  it("renders property information correctly", () => {
    render(<PropertyDetail property={mockProperty} ownerName="Test Owner" />);

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.getByText("PROP-001")).toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(<PropertyDetail property={mockProperty} />);

    const image = screen.getByAltText("Test Property");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("handles missing image gracefully", () => {
    const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };
    render(<PropertyDetail property={propertyWithoutImage} />);

    expect(screen.getByText("Test Property")).toBeInTheDocument();
    // Should still render the property name
  });

  it("handles missing property name", () => {
    const propertyWithoutName = { ...mockProperty, name: undefined };
    render(<PropertyDetail property={propertyWithoutName} />);

    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
  });

  it("handles missing address", () => {
    const propertyWithoutAddress = { ...mockProperty, address: undefined };
    render(<PropertyDetail property={propertyWithoutAddress} />);

    expect(screen.getByText("Sin dirección")).toBeInTheDocument();
  });

  it("handles missing code internal", () => {
    const propertyWithoutCode = { ...mockProperty, codeInternal: undefined };
    render(<PropertyDetail property={propertyWithoutCode} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("renders owner information", () => {
    render(<PropertyDetail property={mockProperty} ownerName="Test Owner" />);

    expect(screen.getByText("Test Owner")).toBeInTheDocument();
  });

  it("renders owner as clickable link when ownerName is provided", () => {
    render(<PropertyDetail property={mockProperty} ownerName="Test Owner" />);

    const ownerButton = screen.getByText("Test Owner");
    expect(ownerButton).toBeInTheDocument();
    expect(ownerButton).toHaveClass("text-blue-600");
  });

  it("renders owner as unassigned when no ownerName", () => {
    render(<PropertyDetail property={mockProperty} />);

    expect(screen.getByText("Sin asignar")).toBeInTheDocument();
  });

  it("renders property trace list", () => {
    render(<PropertyDetail property={mockProperty} />);

    expect(screen.getByTestId("property-trace-list")).toBeInTheDocument();
    expect(screen.getByText("Property Traces")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<PropertyDetail property={mockProperty} className="custom-class" />);

    const card = screen.getByTestId("property-detail");
    expect(card).toHaveClass("custom-class");
  });

  it("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(<PropertyDetail property={mockProperty} onEdit={mockOnEdit} />);

    const editButton = screen.getByText("Editar Propiedad");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = jest.fn();
    render(<PropertyDetail property={mockProperty} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("Eliminar");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("opens property trace modal when create trace is clicked", () => {
    render(<PropertyDetail property={mockProperty} />);

    const createButton = screen.getByText("Create Trace");
    fireEvent.click(createButton);

    expect(screen.getByTestId("property-trace-modal")).toBeInTheDocument();
  });

  it("opens property trace modal in edit mode when edit trace is clicked", () => {
    const mockTraces = [
      {
        idTrace: "trace-1",
        idPropertyTrace: "trace-1",
        name: "Test Trace",
        value: 1000000,
        tax: 10000,
      },
    ];

    mockUsePropertyTraces.mockReturnValue({
      data: mockTraces,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByTestId("property-trace-modal")).toBeInTheDocument();
    expect(screen.getByTestId("edit-mode")).toBeInTheDocument();
  });

  it("opens confirm modal when delete trace is clicked", () => {
    const mockTraces = [
      {
        idTrace: "trace-1",
        idPropertyTrace: "trace-1",
        name: "Test Trace",
        value: 1000000,
        tax: 10000,
      },
    ];

    mockUsePropertyTraces.mockReturnValue({
      data: mockTraces,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(screen.getByTestId("confirm-modal")).toHaveAttribute(
      "data-title",
      "Eliminar Transacción"
    );
  });

  it("handles trace submission successfully", async () => {
    const user = userEvent.setup();
    render(<PropertyDetail property={mockProperty} />);

    // Open modal
    const createButton = screen.getByText("Create Trace");
    fireEvent.click(createButton);

    // Submit trace
    const submitButton = screen.getByText("Submit Trace");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId("property-trace-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("handles trace deletion successfully", async () => {
    const user = userEvent.setup();
    const mockTraces = [
      {
        idTrace: "trace-1",
        idPropertyTrace: "trace-1",
        name: "Test Trace",
        value: 1000000,
        tax: 10000,
      },
    ];

    mockUsePropertyTraces.mockReturnValue({
      data: mockTraces,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    // Open delete modal
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    // Confirm deletion
    const confirmButton = screen.getByText("Confirm");
    await user.click(confirmButton);

    await waitFor(() => {
      expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });
  });

  it("handles trace loading state", () => {
    mockUsePropertyTraces.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    expect(screen.getByText("Loading traces...")).toBeInTheDocument();
  });

  it("handles trace error state", () => {
    mockUsePropertyTraces.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error("Failed to load traces"),
    });

    render(<PropertyDetail property={mockProperty} />);

    expect(
      screen.getByText("Error: Failed to load traces")
    ).toBeInTheDocument();
  });

  it("navigates to owner detail when owner is clicked", () => {
    const { useRouter } = require("next/navigation");
    const mockUseRouter = useRouter as jest.Mock;

    // Clear previous calls
    mockPush.mockClear();

    render(<PropertyDetail property={mockProperty} ownerName="Test Owner" />);

    const ownerButton = screen.getByText("Test Owner");
    fireEvent.click(ownerButton);

    expect(mockPush).toHaveBeenCalledWith(
      `/propietarios/${mockProperty.idOwner}?from=property&propertyId=${mockProperty.idProperty}`
    );
  });

  it("closes modal when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<PropertyDetail property={mockProperty} />);

    // Open modal
    const createButton = screen.getByText("Create Trace");
    fireEvent.click(createButton);

    expect(screen.getByTestId("property-trace-modal")).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByText("Close Trace Modal");
    await user.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId("property-trace-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("handles trace submission error", async () => {
    const user = userEvent.setup();
    render(<PropertyDetail property={mockProperty} />);

    // Open modal
    const createButton = screen.getByText("Create Trace");
    fireEvent.click(createButton);

    expect(screen.getByTestId("property-trace-modal")).toBeInTheDocument();

    // Submit trace
    const submitButton = screen.getByText("Submit Trace");
    await user.click(submitButton);

    // The modal should close after submission
    await waitFor(() => {
      expect(
        screen.queryByTestId("property-trace-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("handles trace update successfully", async () => {
    const user = userEvent.setup();
    const mockTraces = [
      {
        idTrace: "trace-1",
        idPropertyTrace: "trace-1",
        name: "Test Trace",
        value: 1000000,
        tax: 10000,
      },
    ];

    mockUsePropertyTraces.mockReturnValue({
      data: mockTraces,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    // Open edit modal
    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByTestId("property-trace-modal")).toBeInTheDocument();
    expect(screen.getByTestId("edit-mode")).toBeInTheDocument();

    // Submit update
    const submitButton = screen.getByText("Submit Trace");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId("property-trace-modal")
      ).not.toBeInTheDocument();
    });
  });

  it("handles trace deletion error", async () => {
    const user = userEvent.setup();
    const mockTraces = [
      {
        idTrace: "trace-1",
        idPropertyTrace: "trace-1",
        name: "Test Trace",
        value: 1000000,
        tax: 10000,
      },
    ];

    mockUsePropertyTraces.mockReturnValue({
      data: mockTraces,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    // Open delete modal
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    // Confirm deletion
    const confirmButton = screen.getByText("Confirm");
    await user.click(confirmButton);

    // The modal should close after confirmation
    await waitFor(() => {
      expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });
  });

  it("cancels trace deletion", async () => {
    const user = userEvent.setup();
    const mockTraces = [
      {
        idTrace: "trace-1",
        idPropertyTrace: "trace-1",
        name: "Test Trace",
        value: 1000000,
        tax: 10000,
      },
    ];

    mockUsePropertyTraces.mockReturnValue({
      data: mockTraces,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    // Open delete modal
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();

    // Cancel deletion
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId("confirm-modal")).not.toBeInTheDocument();
    });
  });

  it("shows loading state when mutations are pending", () => {
    // Mock mutations as pending
    jest.doMock("@/lib/hooks/usePropertyTraces", () => ({
      usePropertyTraces: () => mockUsePropertyTraces(),
      useCreatePropertyTrace: () => ({
        mutate: mockCreateTrace,
        mutateAsync: jest.fn().mockResolvedValue({}),
        isPending: true,
        error: null,
      }),
      useUpdatePropertyTrace: () => ({
        mutate: mockUpdateTrace,
        mutateAsync: jest.fn().mockResolvedValue({}),
        isPending: false,
        error: null,
      }),
      useDeletePropertyTrace: () => ({
        mutate: mockDeleteTrace,
        mutateAsync: jest.fn().mockResolvedValue({}),
        isPending: false,
        error: null,
      }),
    }));

    render(<PropertyDetail property={mockProperty} />);

    // Open modal
    const createButton = screen.getByText("Create Trace");
    fireEvent.click(createButton);

    // Check that the modal shows loading state
    expect(screen.getByTestId("property-trace-modal")).toBeInTheDocument();
  });

  it("shows loading state when delete mutation is pending", () => {
    const mockTraces = [
      {
        idTrace: "trace-1",
        idPropertyTrace: "trace-1",
        name: "Test Trace",
        value: 1000000,
        tax: 10000,
      },
    ];

    mockUsePropertyTraces.mockReturnValue({
      data: mockTraces,
      isLoading: false,
      error: null,
    });

    render(<PropertyDetail property={mockProperty} />);

    // Open delete modal
    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    // Check that the confirm modal is open
    expect(screen.getByTestId("confirm-modal")).toBeInTheDocument();
    expect(
      screen.getByText(
        "¿Estás seguro de que quieres eliminar esta transacción? Esta acción no se puede deshacer."
      )
    ).toBeInTheDocument();
  });

  it("handles missing property id gracefully", () => {
    const propertyWithoutId = { ...mockProperty, idProperty: undefined };
    render(<PropertyDetail property={propertyWithoutId} />);

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("handles missing owner id gracefully", () => {
    const propertyWithoutOwnerId = { ...mockProperty, idOwner: undefined };
    render(
      <PropertyDetail
        property={propertyWithoutOwnerId}
        ownerName="Test Owner"
      />
    );

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Owner")).toBeInTheDocument();
  });
});
