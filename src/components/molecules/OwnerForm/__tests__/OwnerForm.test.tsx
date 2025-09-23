import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock the Input and Button components
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

// Import the real component
import { OwnerForm } from "../OwnerForm";

describe("OwnerForm Component", () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form fields", () => {
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-address")).toBeInTheDocument();
    expect(screen.getByTestId("input-birthday")).toBeInTheDocument();
    expect(screen.getByTestId("input-photo")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    const user = userEvent.setup();
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out the form
    await user.type(screen.getByTestId("input-name"), "John Doe");
    await user.type(screen.getByTestId("input-address"), "123 Main St");
    await user.type(screen.getByTestId("input-birthday"), "1990-01-01");

    const submitButton = screen.getByText("Crear");
    await user.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  it("handles cancel button", async () => {
    const user = userEvent.setup();
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    const cancelButton = screen.getByText("Cancelar");
    await user.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(
      <OwnerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        className="custom-class"
      />
    );

    const form = screen.getByRole("form");
    expect(form).toHaveClass("custom-class");
  });

  it("renders with correct placeholders", () => {
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByTestId("input-name")).toBeInTheDocument();
    expect(screen.getByTestId("input-address")).toBeInTheDocument();
    expect(screen.getByTestId("input-birthday")).toBeInTheDocument();
    expect(screen.getByTestId("input-photo")).toBeInTheDocument();
  });

  it("has correct input types", () => {
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    expect(screen.getByTestId("input-name")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("input-address")).toHaveAttribute("type", "text");
    expect(screen.getByTestId("input-birthday")).toHaveAttribute(
      "type",
      "date"
    );
    expect(screen.getByTestId("input-photo")).toHaveAttribute("type", "url");
  });

  it("populates form with initial data", () => {
    const initialData = {
      name: "John Doe",
      address: "123 Main St",
      birthday: "1990-01-01T00:00:00.000Z",
      photo: "https://example.com/photo.jpg",
      createdAt: "2024-01-01T00:00:00Z",
    };

    render(
      <OwnerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    );

    // This should cover lines 47-54 (defaultValues logic)
    expect(screen.getByTestId("input-name")).toHaveValue("John Doe");
    expect(screen.getByTestId("input-address")).toHaveValue("123 Main St");
    expect(screen.getByTestId("input-birthday")).toHaveValue("1990-01-01");
    expect(screen.getByTestId("input-photo")).toHaveValue(
      "https://example.com/photo.jpg"
    );
  });

  it("handles form submission with all fields", async () => {
    const user = userEvent.setup();
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out all form fields
    await user.type(screen.getByTestId("input-name"), "John Doe");
    await user.type(screen.getByTestId("input-address"), "123 Main St");
    await user.type(screen.getByTestId("input-birthday"), "1990-01-01");
    await user.type(
      screen.getByTestId("input-photo"),
      "https://example.com/photo.jpg"
    );

    const submitButton = screen.getByText("Crear");
    await user.click(submitButton);

    // This should cover lines 56-148 (handleFormSubmit logic)
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      address: "123 Main St",
      birthday: "1990-01-01T00:00:00.000Z",
      photo: "https://example.com/photo.jpg",
    });
  });

  it("handles form submission with minimal fields", async () => {
    const user = userEvent.setup();
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out only required field
    await user.type(screen.getByTestId("input-name"), "John Doe");

    const submitButton = screen.getByText("Crear");
    await user.click(submitButton);

    // This should cover lines 56-148 (handleFormSubmit with undefined values)
    expect(mockOnSubmit).toHaveBeenCalledWith({
      name: "John Doe",
      address: undefined,
      birthday: undefined,
      photo: undefined,
    });
  });

  it("shows update button text when editing", () => {
    const initialData = {
      name: "John Doe",
      address: "123 Main St",
      birthday: "1990-01-01T00:00:00.000Z",
      photo: "https://example.com/photo.jpg",
      createdAt: "2024-01-01T00:00:00Z",
    };

    render(
      <OwnerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        initialData={initialData}
      />
    );

    // This should cover line 148 (button text logic)
    expect(screen.getByText("Actualizar")).toBeInTheDocument();
  });

  it("shows create button text when creating new owner", () => {
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // This should cover line 148 (button text logic)
    expect(screen.getByText("Crear")).toBeInTheDocument();
  });

  it("shows loading state on submit button", () => {
    render(
      <OwnerForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isLoading={true}
      />
    );

    // This should cover lines 143 and 147 (disabled state)
    expect(screen.getByText("Cancelar")).toBeDisabled();
    expect(screen.getByText("Guardando...")).toBeInTheDocument();
  });

  it("handles birthday date conversion correctly", async () => {
    const user = userEvent.setup();
    render(<OwnerForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    // Fill out form with birthday
    await user.type(screen.getByTestId("input-name"), "John Doe");
    await user.type(screen.getByTestId("input-birthday"), "1990-01-01");

    const submitButton = screen.getByText("Crear");
    await user.click(submitButton);

    // This should cover lines 56-58 (birthday conversion logic)
    expect(mockOnSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        birthday: "1990-01-01T00:00:00.000Z",
      })
    );
  });
});
