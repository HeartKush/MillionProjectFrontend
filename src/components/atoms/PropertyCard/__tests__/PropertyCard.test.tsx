import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyCard } from "../PropertyCard";
import type { PropertyListItem } from "@/lib/types";

// Mock the Card component
jest.mock("@/components/atoms", () => ({
  Card: ({ title, subtitle, imageUrl, actions, children, className }: any) => (
    <div className={className} data-testid="property-card">
      <h3>{title}</h3>
      <p>{subtitle}</p>
      {imageUrl && <img src={imageUrl} alt={title} />}
      <div className="actions">{actions}</div>
      <div className="content">{children}</div>
    </div>
  ),
}));

// Mock the formatCurrency utility
jest.mock("@/lib/utils", () => ({
  formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
}));

describe("PropertyCard", () => {
  const mockProperty: PropertyListItem = {
    idProperty: "prop-123",
    name: "Test Property",
    address: "123 Test Street",
    price: 250000,
    imageUrl: "https://example.com/image.jpg",
  };

  const mockOnViewDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders property information correctly", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText("Test Property")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("$250,000")).toBeInTheDocument();
  });

  it("renders with default values when property data is missing", () => {
    const incompleteProperty: PropertyListItem = {
      idProperty: "prop-456",
      name: "",
      address: "",
      price: 100000,
    };

    render(<PropertyCard property={incompleteProperty} />);

    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
    expect(screen.getByText("Sin dirección")).toBeInTheDocument();
    expect(screen.getByText("$100,000")).toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(<PropertyCard property={mockProperty} />);

    const image = screen.getByAltText("Test Property");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("does not render image when imageUrl is not provided", () => {
    const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };
    render(<PropertyCard property={propertyWithoutImage} />);

    expect(screen.queryByAltText("Test Property")).not.toBeInTheDocument();
  });

  it("calls onViewDetails when view details button is clicked", () => {
    render(
      <PropertyCard property={mockProperty} onViewDetails={mockOnViewDetails} />
    );

    const viewDetailsButton = screen.getByText("Ver detalles");
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith("prop-123");
  });

  it("does not call onViewDetails when property has no idProperty", () => {
    const propertyWithoutId = { ...mockProperty, idProperty: undefined };
    render(
      <PropertyCard
        property={propertyWithoutId}
        onViewDetails={mockOnViewDetails}
      />
    );

    const viewDetailsButton = screen.getByText("Ver detalles");
    fireEvent.click(viewDetailsButton);

    expect(mockOnViewDetails).not.toHaveBeenCalled();
  });

  it("does not call onViewDetails when onViewDetails is not provided", () => {
    render(<PropertyCard property={mockProperty} />);

    const viewDetailsButton = screen.getByText("Ver detalles");
    fireEvent.click(viewDetailsButton);

    // Should not throw an error
    expect(viewDetailsButton).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<PropertyCard property={mockProperty} className="custom-class" />);

    const card = screen.getByTestId("property-card");
    expect(card).toHaveClass("property-card custom-class");
  });

  it("renders price with correct formatting", () => {
    const propertyWithHighPrice = { ...mockProperty, price: 1500000 };
    render(<PropertyCard property={propertyWithHighPrice} />);

    expect(screen.getByText("$1,500,000")).toBeInTheDocument();
  });

  it("renders price label correctly", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText("Precio:")).toBeInTheDocument();
  });
});
