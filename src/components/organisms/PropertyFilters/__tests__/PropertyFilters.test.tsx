import React from "react";
import { render, screen } from "@testing-library/react";
import { PropertyFilters } from "../PropertyFilters";
import type { PropertyFilters as PropertyFiltersType } from "@/lib/types";

// Mock the FilterForm component
jest.mock("@/components/molecules", () => ({
  FilterForm: ({
    onFiltersChange,
    onClearFilters,
    initialFilters,
    className,
  }: any) => (
    <div data-testid="filter-form" className={className}>
      <div>Initial filters: {JSON.stringify(initialFilters)}</div>
      <button onClick={() => onFiltersChange?.({ name: "test" })}>
        Apply Filters
      </button>
      <button onClick={() => onClearFilters?.()}>Clear Filters</button>
    </div>
  ),
}));

describe("PropertyFilters", () => {
  const mockOnFiltersChange = jest.fn();
  const mockOnClearFilters = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with correct title and description", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByText("Filtros de Búsqueda")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Busca propiedades por nombre, dirección o rango de precios"
      )
    ).toBeInTheDocument();
  });

  it("renders FilterForm component", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByTestId("filter-form")).toBeInTheDocument();
  });

  it("passes props to FilterForm correctly", () => {
    const initialFilters: PropertyFiltersType = {
      name: "Test Property",
      minPrice: 100000,
    };

    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={initialFilters}
      />
    );

    expect(
      screen.getByText(/Initial filters.*Test Property/)
    ).toBeInTheDocument();
  });

  it("handles empty initial filters", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={{}}
      />
    );

    expect(screen.getByText(/Initial filters.*{}/)).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        className="custom-class"
      />
    );

    const container = screen
      .getByText("Filtros de Búsqueda")
      .closest("div")?.parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("renders with correct styling", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const container = screen
      .getByText("Filtros de Búsqueda")
      .closest("div")?.parentElement;
    expect(container).toHaveClass(
      "bg-white",
      "p-6",
      "rounded-lg",
      "shadow-md",
      "border",
      "border-gray-200"
    );
  });

  it("renders title with correct styling", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const title = screen.getByText("Filtros de Búsqueda");
    expect(title).toHaveClass(
      "text-lg",
      "font-semibold",
      "text-gray-900",
      "mb-2"
    );
  });

  it("renders description with correct styling", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    const description = screen.getByText(
      "Busca propiedades por nombre, dirección o rango de precios"
    );
    expect(description).toHaveClass("text-sm", "text-gray-600");
  });

  it("handles undefined initialFilters", () => {
    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
      />
    );

    expect(screen.getByText(/Initial filters.*{}/)).toBeInTheDocument();
  });

  it("passes all required props to FilterForm", () => {
    const initialFilters: PropertyFiltersType = {
      name: "Test",
      address: "Test Address",
      minPrice: 100000,
      maxPrice: 500000,
    };

    render(
      <PropertyFilters
        onFiltersChange={mockOnFiltersChange}
        onClearFilters={mockOnClearFilters}
        initialFilters={initialFilters}
        className="custom-class"
      />
    );

    const filterForm = screen.getByTestId("filter-form");
    expect(filterForm).toBeInTheDocument();
    expect(filterForm).toHaveClass("custom-class");
  });

  it("renders without crashing when callbacks are not provided", () => {
    render(
      <PropertyFilters onFiltersChange={jest.fn()} onClearFilters={jest.fn()} />
    );

    expect(screen.getByText("Filtros de Búsqueda")).toBeInTheDocument();
    expect(screen.getByTestId("filter-form")).toBeInTheDocument();
  });
});
