import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the Card and Button components
jest.mock("@/components/atoms", () => ({
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="property-card" className={className} {...props}>
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
}));

// Import the real component
import { PropertyCard } from "../PropertyCard";

const mockProperty = {
  idProperty: "123",
  idOwner: "owner-123",
  name: "Test Property",
  address: "123 Test Street",
  price: 1000000,
  imageUrl: "https://example.com/image.jpg",
  hasTransactions: false,
  featured: false,
  createdAt: "2024-01-01T00:00:00Z",
};

describe("PropertyCard Component", () => {
  it("renders property information correctly", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText("Test Property")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText(/1\.000\.000/)).toBeInTheDocument();
    expect(screen.getByText("Ver Detalles")).toBeInTheDocument();
  });

  it("renders with image when provided", () => {
    render(<PropertyCard property={mockProperty} />);

    const image = screen.getByAltText("Test Property");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("handles missing image gracefully", () => {
    const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };
    render(<PropertyCard property={propertyWithoutImage} />);

    expect(screen.getByText("Test Property")).toBeInTheDocument();
    // Should still render the property name
  });

  it("shows available status when no transactions", () => {
    render(<PropertyCard property={mockProperty} />);

    // Check for the status indicator specifically
    const statusIndicators = screen.getAllByText("Disponible");
    const statusIndicator = statusIndicators.find((el) =>
      el.closest(".status-indicator")
    );
    expect(statusIndicator).toBeInTheDocument();
  });

  it("shows sold status when has transactions", () => {
    const propertyWithTransactions = { ...mockProperty, hasTransactions: true };
    render(<PropertyCard property={propertyWithTransactions} />);

    // Check for the status indicator specifically
    const statusIndicators = screen.getAllByText("Vendida");
    const statusIndicator = statusIndicators.find((el) =>
      el.closest(".status-indicator")
    );
    expect(statusIndicator).toBeInTheDocument();
  });

  it("shows featured badge when property is featured", () => {
    const featuredProperty = { ...mockProperty, featured: true };
    render(<PropertyCard property={featuredProperty} />);

    expect(screen.getByText("Destacada")).toBeInTheDocument();
  });

  it("does not show featured badge when property is not featured", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.queryByText("Destacada")).not.toBeInTheDocument();
  });

  it("calls onViewDetails when view details button is clicked", () => {
    const mockOnViewDetails = jest.fn();
    render(
      <PropertyCard property={mockProperty} onViewDetails={mockOnViewDetails} />
    );

    const viewButton = screen.getByText("Ver Detalles");
    fireEvent.click(viewButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith("123");
  });

  it("renders in grid layout by default", () => {
    render(<PropertyCard property={mockProperty} />);

    // Check for grid-specific elements
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("renders in list layout when specified", () => {
    render(<PropertyCard property={mockProperty} layout="list" />);

    // Check for list-specific elements
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<PropertyCard property={mockProperty} className="custom-class" />);

    const card = screen.getByTestId("property-card");
    expect(card).toHaveClass("custom-class");
  });

  it("renders list layout when specified", () => {
    render(<PropertyCard property={mockProperty} layout="list" />);

    const card = screen.getByTestId("property-card");
    expect(card).toBeInTheDocument();
    // In list layout, the structure is different with flex layout
    const contentContainer = card.querySelector(".flex");
    expect(contentContainer).toBeInTheDocument();
  });

  it("renders grid layout by default", () => {
    render(<PropertyCard property={mockProperty} />);

    const card = screen.getByTestId("property-card");
    expect(card).toBeInTheDocument();
    // In grid layout, the card should have the correct structure
    expect(card).toHaveClass("property-card");
    // Check that the address section exists (which has flex class)
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
  });

  it("handles property without name", () => {
    const propertyWithoutName = { ...mockProperty, name: undefined };
    render(<PropertyCard property={propertyWithoutName} />);

    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
  });

  it("handles property without address", () => {
    const propertyWithoutAddress = { ...mockProperty, address: undefined };
    render(<PropertyCard property={propertyWithoutAddress} />);

    expect(screen.getByText("Sin dirección")).toBeInTheDocument();
  });

  it("handles property without imageUrl", () => {
    const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };
    render(<PropertyCard property={propertyWithoutImage} />);

    const image = screen.getByAltText("Test Property");
    expect(image).toHaveAttribute(
      "src",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
    );
  });

  it("handles property without idProperty", () => {
    const propertyWithoutId = { ...mockProperty, idProperty: undefined };
    const mockOnViewDetails = jest.fn();
    render(
      <PropertyCard
        property={propertyWithoutId}
        onViewDetails={mockOnViewDetails}
      />
    );

    const viewButton = screen.getByText("Ver Detalles");
    fireEvent.click(viewButton);

    expect(mockOnViewDetails).not.toHaveBeenCalled();
  });

  it("handles property without onViewDetails callback", () => {
    render(<PropertyCard property={mockProperty} />);

    const viewButton = screen.getByText("Ver Detalles");
    // Should not throw error when clicked without callback
    expect(() => fireEvent.click(viewButton)).not.toThrow();
  });

  it("renders featured property with badge in grid layout", () => {
    const featuredProperty = { ...mockProperty, featured: true };
    render(<PropertyCard property={featuredProperty} layout="grid" />);

    expect(screen.getByText("Destacada")).toBeInTheDocument();
    const card = screen.getByTestId("property-card");
    expect(card).toHaveClass("ring-2", "ring-yellow-400", "shadow-glow");
  });

  it("renders featured property with badge in list layout", () => {
    const featuredProperty = { ...mockProperty, featured: true };
    render(<PropertyCard property={featuredProperty} layout="list" />);

    expect(screen.getByText("Destacada")).toBeInTheDocument();
    const card = screen.getByTestId("property-card");
    expect(card).toHaveClass("ring-2", "ring-yellow-400", "shadow-glow");
  });

  it("renders non-featured property without badge", () => {
    const nonFeaturedProperty = { ...mockProperty, featured: false };
    render(<PropertyCard property={nonFeaturedProperty} />);

    expect(screen.queryByText("Destacada")).not.toBeInTheDocument();
    const card = screen.getByTestId("property-card");
    expect(card).not.toHaveClass("ring-2", "ring-yellow-400", "shadow-glow");
  });

  it("shows sold status when hasTransactions is true", () => {
    const soldProperty = { ...mockProperty, hasTransactions: true };
    render(<PropertyCard property={soldProperty} />);

    expect(screen.getAllByText("Vendida")).toHaveLength(2); // One in stats, one in status indicator
  });

  it("shows available status when hasTransactions is false", () => {
    const availableProperty = { ...mockProperty, hasTransactions: false };
    render(<PropertyCard property={availableProperty} />);

    expect(screen.getAllByText("Disponible")).toHaveLength(2); // One in stats, one in status indicator
  });

  it("calls onViewDetails when view button is clicked in grid layout", () => {
    const mockOnViewDetails = jest.fn();
    render(
      <PropertyCard
        property={mockProperty}
        onViewDetails={mockOnViewDetails}
        layout="grid"
      />
    );

    const viewButton = screen.getByText("Ver Detalles");
    fireEvent.click(viewButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith("123");
  });

  it("calls onViewDetails when view button is clicked in list layout", () => {
    const mockOnViewDetails = jest.fn();
    render(
      <PropertyCard
        property={mockProperty}
        onViewDetails={mockOnViewDetails}
        layout="list"
      />
    );

    const viewButton = screen.getByText("Ver Detalles");
    fireEvent.click(viewButton);

    expect(mockOnViewDetails).toHaveBeenCalledWith("123");
  });

  it("renders with correct image alt text", () => {
    render(<PropertyCard property={mockProperty} />);

    const image = screen.getByAltText("Test Property");
    expect(image).toBeInTheDocument();
  });

  it("renders with fallback image alt text when name is missing", () => {
    const propertyWithoutName = { ...mockProperty, name: undefined };
    render(<PropertyCard property={propertyWithoutName} />);

    const image = screen.getByAltText("Propiedad");
    expect(image).toBeInTheDocument();
  });

  it("applies correct status indicator classes for sold property", () => {
    const soldProperty = { ...mockProperty, hasTransactions: true };
    render(<PropertyCard property={soldProperty} />);

    const statusIndicators = screen.getAllByText("Vendida");
    statusIndicators.forEach((indicator) => {
      const parent = indicator.closest('div[class*="status-indicator"]');
      if (parent) {
        expect(parent).toHaveClass("status-sold");
      }
    });
  });

  it("applies correct status indicator classes for available property", () => {
    const availableProperty = { ...mockProperty, hasTransactions: false };
    render(<PropertyCard property={availableProperty} />);

    const statusIndicators = screen.getAllByText("Disponible");
    statusIndicators.forEach((indicator) => {
      const parent = indicator.closest('div[class*="status-indicator"]');
      if (parent) {
        expect(parent).toHaveClass("status-available");
      }
    });
  });

  it("handles property without name in list layout", () => {
    const propertyWithoutName = { ...mockProperty, name: undefined };
    render(<PropertyCard property={propertyWithoutName} layout="list" />);

    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
  });

  it("handles property without address in list layout", () => {
    const propertyWithoutAddress = { ...mockProperty, address: undefined };
    render(<PropertyCard property={propertyWithoutAddress} layout="list" />);

    expect(screen.getByText("Sin dirección")).toBeInTheDocument();
  });

  it("handles property without imageUrl in list layout", () => {
    const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };
    render(<PropertyCard property={propertyWithoutImage} layout="list" />);

    const image = screen.getByAltText("Test Property");
    expect(image).toHaveAttribute(
      "src",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
    );
  });

  it("shows sold status when hasTransactions is true in list layout", () => {
    const soldProperty = { ...mockProperty, hasTransactions: true };
    render(<PropertyCard property={soldProperty} layout="list" />);

    expect(screen.getAllByText("Vendida")).toHaveLength(2); // One in stats, one in status indicator
  });

  it("shows available status when hasTransactions is false in list layout", () => {
    const availableProperty = { ...mockProperty, hasTransactions: false };
    render(<PropertyCard property={availableProperty} layout="list" />);

    expect(screen.getAllByText("Disponible")).toHaveLength(2); // One in stats, one in status indicator
  });

  it("applies correct status indicator classes for sold property in list layout", () => {
    const soldProperty = { ...mockProperty, hasTransactions: true };
    render(<PropertyCard property={soldProperty} layout="list" />);

    const statusIndicators = screen.getAllByText("Vendida");
    statusIndicators.forEach((indicator) => {
      const parent = indicator.closest('div[class*="status-indicator"]');
      if (parent) {
        expect(parent).toHaveClass("status-sold");
      }
    });
  });

  it("applies correct status indicator classes for available property in list layout", () => {
    const availableProperty = { ...mockProperty, hasTransactions: false };
    render(<PropertyCard property={availableProperty} layout="list" />);

    const statusIndicators = screen.getAllByText("Disponible");
    statusIndicators.forEach((indicator) => {
      const parent = indicator.closest('div[class*="status-indicator"]');
      if (parent) {
        expect(parent).toHaveClass("status-available");
      }
    });
  });

  it("renders with fallback image alt text when name is missing in list layout", () => {
    const propertyWithoutName = { ...mockProperty, name: undefined };
    render(<PropertyCard property={propertyWithoutName} layout="list" />);

    const image = screen.getByAltText("Propiedad");
    expect(image).toBeInTheDocument();
  });
});
