import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyList } from "../PropertyList";
import { Grid, List } from "lucide-react";

// Mock the PropertyCard component
jest.mock("@/components/molecules", () => ({
  PropertyCard: ({ property, onViewDetails, layout }: any) => (
    <div data-testid={`property-card-${property.idProperty}`}>
      <h3>{property.name}</h3>
      <p>{property.address}</p>
      <p>${property.price.toLocaleString()}</p>
      <button onClick={() => onViewDetails?.(property.idProperty)}>
        Ver Detalles
      </button>
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Grid: () => <span data-testid="grid-icon">GridIcon</span>,
  List: () => <span data-testid="list-icon">ListIcon</span>,
}));

const mockProperties = [
  {
    idProperty: "prop-1",
    name: "Test Property 1",
    address: "123 Test Street",
    price: 1000000,
    createdAt: "2023-01-01T00:00:00Z",
  },
  {
    idProperty: "prop-2",
    name: "Test Property 2",
    address: "456 Test Avenue",
    price: 2000000,
    createdAt: "2023-01-02T00:00:00Z",
  },
];

describe("PropertyList Component", () => {
  it("renders properties correctly", () => {
    render(<PropertyList properties={mockProperties} />);

    expect(screen.getByText("Propiedades Disponibles")).toBeInTheDocument();
    expect(screen.getByText("Test Property 1")).toBeInTheDocument();
    expect(screen.getByText("Test Property 2")).toBeInTheDocument();
  });

  it("displays correct property count", () => {
    render(<PropertyList properties={mockProperties} />);
    expect(screen.getByText("2 propiedades encontradas")).toBeInTheDocument();
  });

  it("displays singular form for single property", () => {
    render(<PropertyList properties={[mockProperties[0]]} />);
    expect(screen.getByText("1 propiedad encontrada")).toBeInTheDocument();
  });

  it("handles property click", () => {
    const mockOnPropertyClick = jest.fn();
    render(
      <PropertyList
        properties={mockProperties}
        onPropertyClick={mockOnPropertyClick}
      />
    );

    const clickButton = screen.getAllByText("Ver Detalles")[0];
    fireEvent.click(clickButton);

    expect(mockOnPropertyClick).toHaveBeenCalledWith("prop-2");
  });

  it("applies custom className", () => {
    render(
      <PropertyList properties={mockProperties} className="custom-class" />
    );
    const list = screen.getByText("Propiedades Disponibles").closest("div")
      ?.parentElement?.parentElement?.parentElement?.parentElement;
    expect(list).toHaveClass("custom-class");
  });

  it("renders empty state when no properties", () => {
    render(<PropertyList properties={[]} />);

    expect(
      screen.getByText("No se encontraron propiedades")
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "No hay propiedades que coincidan con los filtros aplicados."
      )
    ).toBeInTheDocument();
  });

  it("renders view mode toggle buttons", () => {
    render(<PropertyList properties={mockProperties} />);

    expect(screen.getByTestId("grid-icon")).toBeInTheDocument();
    expect(screen.getByTestId("list-icon")).toBeInTheDocument();
  });

  it("switches between grid and list view", () => {
    render(<PropertyList properties={mockProperties} />);

    const listButton = screen.getByTestId("list-icon").closest("button");
    const gridButton = screen.getByTestId("grid-icon").closest("button");

    // Default should be grid
    expect(gridButton).toHaveClass("bg-white", "shadow-sm", "text-blue-600");
    expect(listButton).toHaveClass("text-gray-500");

    // Click list button
    fireEvent.click(listButton!);
    expect(listButton).toHaveClass("bg-white", "shadow-sm", "text-blue-600");
    expect(gridButton).toHaveClass("text-gray-500");

    // Click grid button
    fireEvent.click(gridButton!);
    expect(gridButton).toHaveClass("bg-white", "shadow-sm", "text-blue-600");
    expect(listButton).toHaveClass("text-gray-500");
  });

  it("renders sort dropdown", () => {
    render(<PropertyList properties={mockProperties} />);

    const sortSelect = screen.getByDisplayValue("Más recientes");
    expect(sortSelect).toBeInTheDocument();
    expect(sortSelect).toHaveClass("form-input");
  });

  it("sorts properties by price ascending", () => {
    render(<PropertyList properties={mockProperties} />);

    const sortSelect = screen.getByDisplayValue("Más recientes");
    fireEvent.change(sortSelect, { target: { value: "price-asc" } });

    // Check that properties are sorted by price (ascending)
    const propertyCards = screen.getAllByTestId(/property-card-/);
    expect(propertyCards[0]).toHaveAttribute(
      "data-testid",
      "property-card-prop-1"
    );
    expect(propertyCards[1]).toHaveAttribute(
      "data-testid",
      "property-card-prop-2"
    );
  });

  it("sorts properties by price descending", () => {
    render(<PropertyList properties={mockProperties} />);

    const sortSelect = screen.getByDisplayValue("Más recientes");
    fireEvent.change(sortSelect, { target: { value: "price-desc" } });

    // Check that properties are sorted by price (descending)
    const propertyCards = screen.getAllByTestId(/property-card-/);
    expect(propertyCards[0]).toHaveAttribute(
      "data-testid",
      "property-card-prop-2"
    );
    expect(propertyCards[1]).toHaveAttribute(
      "data-testid",
      "property-card-prop-1"
    );
  });

  it("sorts properties by name ascending", () => {
    render(<PropertyList properties={mockProperties} />);

    const sortSelect = screen.getByDisplayValue("Más recientes");
    fireEvent.change(sortSelect, { target: { value: "name-asc" } });

    // Check that properties are sorted by name (ascending)
    const propertyCards = screen.getAllByTestId(/property-card-/);
    expect(propertyCards[0]).toHaveAttribute(
      "data-testid",
      "property-card-prop-1"
    );
    expect(propertyCards[1]).toHaveAttribute(
      "data-testid",
      "property-card-prop-2"
    );
  });

  it("sorts properties by name descending", () => {
    render(<PropertyList properties={mockProperties} />);

    const sortSelect = screen.getByDisplayValue("Más recientes");
    fireEvent.change(sortSelect, { target: { value: "name-desc" } });

    // Check that properties are sorted by name (descending)
    const propertyCards = screen.getAllByTestId(/property-card-/);
    expect(propertyCards[0]).toHaveAttribute(
      "data-testid",
      "property-card-prop-2"
    );
    expect(propertyCards[1]).toHaveAttribute(
      "data-testid",
      "property-card-prop-1"
    );
  });

  it("sorts properties by newest by default", () => {
    render(<PropertyList properties={mockProperties} />);

    // Check that properties are sorted by newest (prop-2 should come first)
    const propertyCards = screen.getAllByTestId(/property-card-/);
    expect(propertyCards[0]).toHaveAttribute(
      "data-testid",
      "property-card-prop-2"
    );
    expect(propertyCards[1]).toHaveAttribute(
      "data-testid",
      "property-card-prop-1"
    );
  });

  it("handles properties with missing names gracefully", () => {
    const propertiesWithMissingNames = [
      { ...mockProperties[0], name: undefined },
      { ...mockProperties[1], name: "" },
    ];

    render(<PropertyList properties={propertiesWithMissingNames} />);

    // Should not crash and should still render
    expect(screen.getByText("Propiedades Disponibles")).toBeInTheDocument();
  });

  it("applies correct CSS classes for grid view", () => {
    render(<PropertyList properties={mockProperties} />);

    // Check that the grid view is applied by looking for the class in the DOM
    const gridContainer = document.querySelector(".property-grid");
    expect(gridContainer).toBeInTheDocument();
  });

  it("applies correct CSS classes for list view", () => {
    render(<PropertyList properties={mockProperties} />);

    // Switch to list view
    const listButton = screen.getByTestId("list-icon").closest("button");
    fireEvent.click(listButton!);

    // Check that the list view is applied by looking for the class in the DOM
    const listContainer = document.querySelector(".space-y-4");
    expect(listContainer).toBeInTheDocument();
  });
});
