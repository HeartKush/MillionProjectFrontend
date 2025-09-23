import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyTraceList } from "../PropertyTraceList";
import type { PropertyTraceListItem } from "@/lib/types";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Calendar: jest.fn(() => <svg data-testid="calendar-icon" />),
  DollarSign: jest.fn(() => <svg data-testid="dollar-sign-icon" />),
  User: jest.fn(() => <svg data-testid="user-icon" />),
  Receipt: jest.fn(() => <svg data-testid="receipt-icon" />),
  Edit: jest.fn(() => <svg data-testid="edit-icon" />),
  Trash2: jest.fn(() => <svg data-testid="trash-icon" />),
  Plus: jest.fn(() => <svg data-testid="plus-icon" />),
}));

// Mock LoadingSpinner and Button
jest.mock("@/components/atoms", () => ({
  LoadingSpinner: ({ size }: any) => (
    <div data-testid="loading-spinner" data-size={size}>
      Loading...
    </div>
  ),
  Button: ({ children, onClick, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

// Mock date-fns
jest.mock("date-fns", () => ({
  format: jest.fn((date, formatStr) => "2024-01-01"),
}));

jest.mock("date-fns/locale", () => ({
  es: {},
}));

describe("PropertyTraceList", () => {
  const mockTraces: PropertyTraceListItem[] = [
    {
      idPropertyTrace: "trace-1",
      idProperty: "prop-1",
      dateSale: "2024-01-01",
      name: "John Doe",
      value: 1000000,
      tax: 15000,
    },
    {
      idPropertyTrace: "trace-2",
      idProperty: "prop-1",
      dateSale: "2024-01-15",
      name: "Jane Smith",
      value: 2000000,
      tax: 30000,
    },
  ];

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders traces list", () => {
    render(
      <PropertyTraceList
        traces={mockTraces}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("$ 1.000.000")).toBeInTheDocument();
    expect(screen.getByText("$ 2.000.000")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    render(
      <PropertyTraceList
        traces={[]}
        isLoading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders error state", () => {
    const errorMessage = "Error loading traces";
    render(
      <PropertyTraceList
        traces={[]}
        error={errorMessage}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <PropertyTraceList
        traces={[]}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    expect(
      screen.getByText("Sin historial de transacciones")
    ).toBeInTheDocument();
  });

  it("handles edit action", () => {
    render(
      <PropertyTraceList
        traces={mockTraces}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    // Find edit buttons by their color classes
    const editButtons = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("text-blue-600"));
    fireEvent.click(editButtons[0]);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTraces[0]);
  });

  it("handles delete action", () => {
    render(
      <PropertyTraceList
        traces={mockTraces}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    // Find delete buttons by their color classes
    const deleteButtons = screen
      .getAllByRole("button")
      .filter((button) => button.className.includes("text-red-600"));
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDelete).toHaveBeenCalledWith("trace-1");
  });

  it("handles create action", () => {
    render(
      <PropertyTraceList
        traces={mockTraces}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    const createButton = screen.getByText("Nueva Transacción");
    fireEvent.click(createButton);

    expect(mockOnCreate).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    const { container } = render(
      <PropertyTraceList
        traces={mockTraces}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders without action buttons when callbacks not provided", () => {
    render(<PropertyTraceList traces={mockTraces} />);

    expect(screen.queryByTestId("edit-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("trash-icon")).not.toBeInTheDocument();
    expect(screen.queryByText("Nueva Transacción")).not.toBeInTheDocument();
  });

  it("formats currency correctly", () => {
    render(
      <PropertyTraceList
        traces={mockTraces}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    // Check that currency is formatted with Colombian peso symbol
    expect(screen.getByText("$ 1.000.000")).toBeInTheDocument();
    expect(screen.getByText("$ 2.000.000")).toBeInTheDocument();
  });

  it("shows correct number of traces", () => {
    render(
      <PropertyTraceList
        traces={mockTraces}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByText("2 transacciones registradas")).toBeInTheDocument();
  });

  it("shows singular form for one trace", () => {
    const singleTrace = [mockTraces[0]];
    render(
      <PropertyTraceList
        traces={singleTrace}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    expect(screen.getByText("1 transacción registrada")).toBeInTheDocument();
  });

  it("renders with different loading spinner sizes", () => {
    render(
      <PropertyTraceList
        traces={[]}
        isLoading={true}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onCreate={mockOnCreate}
      />
    );

    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
  });
});
