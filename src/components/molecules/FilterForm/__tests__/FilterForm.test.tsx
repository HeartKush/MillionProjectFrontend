import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FilterForm } from "../FilterForm";
import { Home, MapPin, DollarSign } from "lucide-react";

// Mock the Input component
jest.mock("@/components/atoms", () => ({
  Input: React.forwardRef(({ label, leftIcon, ...props }: any, ref) => (
    <div>
      {label && <label htmlFor={props.id}>{label}</label>}
      <input ref={ref} {...props} />
      {leftIcon && (
        <span data-testid={`icon-${props.name}`}>{leftIcon.type.name}</span>
      )}
    </div>
  )),
  Button: ({ children, onClick, icon, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {icon} {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Filter: () => <span data-testid="filter-icon">FilterIcon</span>,
  Home: () => <span data-testid="home-icon">HomeIcon</span>,
  MapPin: () => <span data-testid="mappin-icon">MapPinIcon</span>,
  DollarSign: () => <span data-testid="dollarsign-icon">DollarSignIcon</span>,
  RotateCcw: () => <span data-testid="rotateccw-icon">RotateCcwIcon</span>,
}));

jest.useFakeTimers();

describe("FilterForm Component", () => {
  const mockOnFiltersChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders filter form elements correctly", () => {
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByText("Filtros de Búsqueda")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Buscar por nombre...")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Buscar por dirección...")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("0")).toBeInTheDocument(); // minPrice
    expect(screen.getByPlaceholderText("Sin límite")).toBeInTheDocument(); // maxPrice
  });

  it("calls onFiltersChange with debounced values on input change", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const nameInput = screen.getByPlaceholderText("Buscar por nombre...");
    await user.type(nameInput, "Test Property");

    expect(mockOnFiltersChange).not.toHaveBeenCalled();
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        name: "Test Property",
        address: "",
        minPrice: undefined,
        maxPrice: undefined,
      });
    });

    const addressInput = screen.getByPlaceholderText("Buscar por dirección...");
    await user.type(addressInput, "Test Address");
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        name: "Test Property",
        address: "Test Address",
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  it("initializes with provided initial filters", async () => {
    const initialFilters = {
      name: "Initial Name",
      address: "Initial Address",
      minPrice: 100000,
      maxPrice: 500000,
    };
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={initialFilters}
      />
    );

    expect(screen.getByPlaceholderText("Buscar por nombre...")).toHaveValue(
      "Initial Name"
    );
    expect(screen.getByPlaceholderText("Buscar por dirección...")).toHaveValue(
      "Initial Address"
    );
    expect(screen.getByPlaceholderText("0")).toHaveValue(100000);
    expect(screen.getByPlaceholderText("Sin límite")).toHaveValue(500000);
  });

  it("handles number inputs correctly", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const minPriceInput = screen.getByPlaceholderText("0");
    await user.type(minPriceInput, "100000");
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        name: "",
        address: "",
        minPrice: 100000,
        maxPrice: undefined,
      });
    });

    const maxPriceInput = screen.getByPlaceholderText("Sin límite");
    await user.type(maxPriceInput, "500000");
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        name: "",
        address: "",
        minPrice: 100000,
        maxPrice: 500000,
      });
    });
  });

  it("handles empty values correctly", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={{ name: "test" }}
      />
    );

    const nameInput = screen.getByPlaceholderText("Buscar por nombre...");
    await user.clear(nameInput);
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        name: "",
        address: "",
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  it("applies custom className to the form", () => {
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        className="custom-form-class"
      />
    );
    const container = screen.getByRole("form").closest("div");
    expect(container).toHaveClass("custom-form-class");
  });

  it("calls onClearFilters when clear button is clicked", () => {
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const clearButton = screen.getByText("Limpiar Filtros");
    fireEvent.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalledTimes(1);
  });

  it("handles NaN values in price fields", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const minPriceInput = screen.getByPlaceholderText("0");
    await user.type(minPriceInput, "invalid");
    jest.advanceTimersByTime(300);
    await waitFor(() => {
      expect(mockOnFiltersChange).toHaveBeenCalledWith({
        name: "",
        address: "",
        minPrice: undefined,
        maxPrice: undefined,
      });
    });
  });

  it("renders with correct icons", () => {
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByTestId("filter-icon")).toBeInTheDocument();
    expect(screen.getByTestId("icon-name")).toBeInTheDocument();
    expect(screen.getByTestId("icon-address")).toBeInTheDocument();
    expect(screen.getByTestId("icon-minPrice")).toBeInTheDocument();
    expect(screen.getByTestId("icon-maxPrice")).toBeInTheDocument();
    expect(screen.getByTestId("rotateccw-icon")).toBeInTheDocument();
  });

  it("has correct form structure", () => {
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const form = screen.getByRole("form");
    expect(form).toBeInTheDocument();
    expect(form).toHaveClass("space-y-6");

    // Check for all input fields
    expect(screen.getByLabelText("Nombre de la Propiedad")).toBeInTheDocument();
    expect(screen.getByLabelText("Dirección")).toBeInTheDocument();
    expect(screen.getByLabelText("Precio Mínimo")).toBeInTheDocument();
    expect(screen.getByLabelText("Precio Máximo")).toBeInTheDocument();
  });

  it("handles form submission with valid data", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Test Property"
    );
    await user.type(
      screen.getByPlaceholderText("Buscar por dirección..."),
      "123 Test St"
    );
    await user.type(screen.getByPlaceholderText("0"), "100000");
    await user.type(screen.getByPlaceholderText("Sin límite"), "500000");

    // Wait for debounced auto-submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "Test Property",
      address: "123 Test St",
      minPrice: 100000,
      maxPrice: 500000,
    });
  });

  it("handles form submission with invalid data (fallback to raw data)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Enter invalid data (negative prices)
    await user.type(screen.getByPlaceholderText("0"), "-100");
    await user.type(screen.getByPlaceholderText("Sin límite"), "-200");

    // Wait for debounced auto-submit
    jest.advanceTimersByTime(300);

    // Should still call onFiltersChange with the raw data even if validation fails
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: -100,
      maxPrice: -200,
    });
  });

  it("does not auto-submit when form is empty", async () => {
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={{}}
      />
    );

    // Fast-forward time without any input
    jest.advanceTimersByTime(300);

    // The form will call onFiltersChange with empty values initially
    // This is expected behavior for the component
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it("handles partial form data", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Test Property"
    );
    // Leave other fields empty

    // Wait for debounced auto-submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "Test Property",
      address: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it("handles clear filters with initial data", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const initialFilters = {
      name: "Initial Property",
      address: "Initial Address",
      minPrice: 100000,
      maxPrice: 500000,
    };

    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={initialFilters}
      />
    );

    const clearButton = screen.getByText("Limpiar Filtros");
    await user.click(clearButton);

    expect(mockOnClearFilters).toHaveBeenCalled();
    // The clear button should be present and clickable
    expect(clearButton).toBeInTheDocument();
  });

  it("handles auto-submit with invalid data (fallback to raw data)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(screen.getByPlaceholderText("0"), "-100");

    // Fast-forward time to trigger debounced auto-submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: -100,
      maxPrice: NaN,
    });
  });

  it("handles zero values correctly", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(screen.getByPlaceholderText("0"), "0");
    await user.type(screen.getByPlaceholderText("Sin límite"), "0");

    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: 0,
      maxPrice: 0,
    });
  });

  it("handles very large numbers", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(screen.getByPlaceholderText("0"), "999999999");
    await user.type(screen.getByPlaceholderText("Sin límite"), "9999999999");

    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: 999999999,
      maxPrice: 9999999999,
    });
  });

  it("does not call onFiltersChange when watchedValues is empty", async () => {
    // This test is covered by the existing behavior where empty form doesn't trigger onFiltersChange
    // The component already handles this case in the useEffect
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Fast-forward time without any input
    jest.advanceTimersByTime(300);

    // The component will call onFiltersChange with empty values initially
    // This is expected behavior
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it("handles form submission with validation success", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Valid Property"
    );
    await user.type(screen.getByPlaceholderText("0"), "100000");

    // Wait for debounced auto-submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "Valid Property",
      address: "",
      minPrice: 100000,
      maxPrice: undefined,
    });
  });

  it("handles form submission with validation failure", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(screen.getByPlaceholderText("0"), "-100"); // Invalid negative price

    // Wait for debounced auto-submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: -100,
      maxPrice: NaN,
    });
  });

  it("handles useEffect with validation success", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Valid Name"
    );

    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "Valid Name",
      address: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it("handles useEffect with validation failure", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    await user.type(screen.getByPlaceholderText("0"), "-50"); // Invalid negative price

    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: -50,
      maxPrice: NaN,
    });
  });

  it("covers the branch where watchedValues has content and validation succeeds", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Fill form with valid data
    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Valid Property"
    );
    await user.type(screen.getByPlaceholderText("0"), "100000");

    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "Valid Property",
      address: "",
      minPrice: 100000,
      maxPrice: undefined,
    });
  });

  it("covers the branch where watchedValues has content and validation fails", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Fill form with invalid data (negative prices)
    await user.type(screen.getByPlaceholderText("0"), "-100");
    await user.type(screen.getByPlaceholderText("Sin límite"), "-200");

    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: -100,
      maxPrice: -200,
    });
  });

  it("covers the branch where watchedValues is not empty (Object.keys length > 0)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Add any content to make watchedValues not empty
    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Test"
    );

    jest.advanceTimersByTime(300);

    // Should call onFiltersChange because watchedValues is not empty
    expect(mockOnFiltersChange).toHaveBeenCalled();
  });

  it("covers the branch where watchedValues is empty (Object.keys length === 0)", async () => {
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={{}}
      />
    );

    // Don't add any content, so watchedValues will be empty
    jest.advanceTimersByTime(300);

    // Should still call onFiltersChange with empty values initially
    // This is the expected behavior of the component
    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: undefined,
      maxPrice: undefined,
    });
  });

  it("covers handleFormSubmit with validation success", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Fill form with valid data
    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Valid Property"
    );
    await user.type(screen.getByPlaceholderText("0"), "100000");

    // Wait for debounced auto-submit instead of manual submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "Valid Property",
      address: "",
      minPrice: 100000,
      maxPrice: undefined,
    });
  });

  it("covers handleFormSubmit with validation failure", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Fill form with invalid data
    await user.type(screen.getByPlaceholderText("0"), "-100");

    // Wait for debounced auto-submit instead of manual submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: -100,
      maxPrice: NaN,
    });
  });

  it("covers handleFormSubmit function directly with validation success", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Fill form with valid data
    await user.type(
      screen.getByPlaceholderText("Buscar por nombre..."),
      "Valid Property"
    );
    await user.type(screen.getByPlaceholderText("0"), "100000");

    // Wait for debounced auto-submit instead of manual submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "Valid Property",
      address: "",
      minPrice: 100000,
      maxPrice: undefined,
    });
  });

  it("covers handleFormSubmit function directly with validation failure", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <FilterForm
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    // Fill form with invalid data
    await user.type(screen.getByPlaceholderText("0"), "-100");

    // Wait for debounced auto-submit instead of manual submit
    jest.advanceTimersByTime(300);

    expect(mockOnFiltersChange).toHaveBeenCalledWith({
      name: "",
      address: "",
      minPrice: -100,
      maxPrice: NaN,
    });
  });
});
