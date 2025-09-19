import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the dependencies
jest.mock("@/components/atoms", () => ({
  Input: React.forwardRef<HTMLInputElement, any>(
    ({ id, placeholder, type = "text", error, disabled, ...props }, ref) => (
      <input
        ref={ref}
        id={id}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
        className={error ? "error" : ""}
        data-testid={`input-${id}`}
        data-error={error}
        {...props}
      />
    )
  ),
  Button: ({ children, onClick, type, variant, disabled, ...props }: any) => (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/lib/hooks", () => ({
  useOwners: jest.fn(),
}));

// Import the real component
import { PropertyForm } from "../PropertyForm";
import { useOwners } from "@/lib/hooks";

describe("PropertyForm", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockUseOwners = useOwners as jest.MockedFunction<typeof useOwners>;

  const mockOwners = [
    { idOwner: "owner-1", name: "John Doe" },
    { idOwner: "owner-2", name: "Jane Smith" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseOwners.mockReturnValue({
      data: mockOwners,
      isLoading: false,
      error: null,
    } as any);
  });

  it("renders form fields", () => {
    render(<PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByTestId("property-form")).toBeInTheDocument();
    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-address")).toBeInTheDocument();
    expect(screen.getByTestId("input-price")).toBeInTheDocument();
    expect(screen.getByTestId("input-year")).toBeInTheDocument();
    expect(screen.getByTestId("input-imageUrl")).toBeInTheDocument();
    expect(screen.getByTestId("input-codeInternal")).toBeInTheDocument();
  });

  it("handles form submission with all fields", async () => {
    const user = userEvent.setup();
    render(<PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out all form fields
    await user.type(screen.getByTestId("input-name"), "Test Property");
    await user.type(screen.getByTestId("input-address"), "123 Test St");
    await user.type(screen.getByTestId("input-price"), "1000000");
    await user.clear(screen.getByTestId("input-year"));
    await user.type(screen.getByTestId("input-year"), "2010");
    await user.type(screen.getByTestId("input-codeInternal"), "PROP-001");
    await user.type(
      screen.getByTestId("input-imageUrl"),
      "https://example.com/image.jpg"
    );

    // Select owner
    const ownerSelect = screen.getByTestId("input-ownerId");
    await user.selectOptions(ownerSelect, "owner-1");

    // Verify form fields are filled
    expect(screen.getByTestId("input-name")).toHaveValue("Test Property");
    expect(screen.getByTestId("input-address")).toHaveValue("123 Test St");
    expect(screen.getByTestId("input-price")).toHaveValue(1000000);
    expect(screen.getByTestId("input-year")).toHaveValue(2010);
    expect(screen.getByTestId("input-codeInternal")).toHaveValue("PROP-001");
    expect(screen.getByTestId("input-imageUrl")).toHaveValue(
      "https://example.com/image.jpg"
    );
    expect(ownerSelect).toHaveValue("owner-1");

    // Submit the form to trigger handleFormSubmit (lines 79-89)
    const submitButton = screen.getByText("Crear");
    await user.click(submitButton);

    // Verify that onSubmit was called with the correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Test Property",
        address: "123 Test St",
        price: 1000000,
        codeInternal: "PROP-001",
        year: 2010,
        idOwner: "owner-1",
        imageUrl: "https://example.com/image.jpg",
        imageEnabled: true,
      });
    });
  });

  it("handles form submission with minimal fields", async () => {
    const user = userEvent.setup();
    render(<PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out only required fields
    await user.type(screen.getByTestId("input-name"), "Test Property");
    await user.type(screen.getByTestId("input-address"), "123 Test St");
    await user.type(screen.getByTestId("input-price"), "1000000");
    await user.clear(screen.getByTestId("input-year"));
    await user.type(screen.getByTestId("input-year"), "2010");

    // Select owner
    const ownerSelect = screen.getByTestId("input-ownerId");
    await user.selectOptions(ownerSelect, "owner-1");

    // Verify required form fields are filled
    expect(screen.getByTestId("input-name")).toHaveValue("Test Property");
    expect(screen.getByTestId("input-address")).toHaveValue("123 Test St");
    expect(screen.getByTestId("input-price")).toHaveValue(1000000);
    expect(screen.getByTestId("input-year")).toHaveValue(2010);
    expect(ownerSelect).toHaveValue("owner-1");

    // Verify optional fields are empty
    expect(screen.getByTestId("input-codeInternal")).toHaveValue("");
    expect(screen.getByTestId("input-imageUrl")).toHaveValue("");

    // Submit the form to trigger handleFormSubmit (lines 79-89)
    const submitButton = screen.getByText("Crear");
    await user.click(submitButton);

    // Verify that onSubmit was called with the correct data (minimal fields)
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "Test Property",
        address: "123 Test St",
        price: 1000000,
        codeInternal: undefined, // Empty string becomes undefined
        year: 2010,
        idOwner: "owner-1",
        imageUrl: undefined, // Empty string becomes undefined
        imageEnabled: true,
      });
    });
  });

  it("handles cancel button", async () => {
    const user = userEvent.setup();
    render(<PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText("Cancelar");
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(
      <PropertyForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        className="custom-class"
      />
    );

    const form = screen.getByTestId("property-form");
    expect(form).toHaveClass("custom-class");
  });

  it("renders owner options", () => {
    render(<PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText("Seleccionar propietario")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("shows update button text when editing", () => {
    const initialData = {
      name: "Test Property",
      address: "123 Test St",
      price: 1000000,
      year: 2020,
      idOwner: "owner-1",
    };

    render(
      <PropertyForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    );

    expect(screen.getByText("Actualizar")).toBeInTheDocument();
  });

  it("shows create button text when creating new property", () => {
    render(<PropertyForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByText("Crear")).toBeInTheDocument();
  });

  it("shows loading state on submit button", () => {
    render(
      <PropertyForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    expect(screen.getByText("Cancelar")).toBeDisabled();
    expect(screen.getByText("Guardando...")).toBeInTheDocument();
  });
});
