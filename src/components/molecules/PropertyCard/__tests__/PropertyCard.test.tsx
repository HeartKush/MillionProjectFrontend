import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the Button component
jest.mock("@/components/atoms", () => ({
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
};

describe("PropertyCard Component", () => {
  it("renders property information correctly", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.getByText("🏡 Test Property")).toBeInTheDocument();
    expect(screen.getByText("📍 123 Test Street")).toBeInTheDocument();
    expect(screen.getByText(/💰.*1\.000\.000/)).toBeInTheDocument();
    expect(screen.getByText("👁️ Ver Detalles")).toBeInTheDocument();
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

    expect(screen.queryByAltText("Test Property")).not.toBeInTheDocument();
  });

  it("handles missing property name", () => {
    const propertyWithoutName = { ...mockProperty, name: undefined };
    render(<PropertyCard property={propertyWithoutName} />);

    expect(screen.getByText("🏡 Sin nombre")).toBeInTheDocument();
  });

  it("handles missing property address", () => {
    const propertyWithoutAddress = { ...mockProperty, address: undefined };
    render(<PropertyCard property={propertyWithoutAddress} />);

    expect(screen.getByText("📍 Sin dirección")).toBeInTheDocument();
  });

  it("handles onViewDetails callback", () => {
    const mockOnViewDetails = jest.fn();
    render(
      <PropertyCard property={mockProperty} onViewDetails={mockOnViewDetails} />
    );

    const viewButton = screen.getByText("👁️ Ver Detalles");
    fireEvent.click(viewButton);

    expect(mockOnViewDetails).toHaveBeenCalledTimes(1);
  });

  it("applies custom className", () => {
    render(<PropertyCard property={mockProperty} className="custom-class" />);

    const card = screen.getByTestId("property-card");
    expect(card).toHaveClass("custom-class");
  });

  it("handles property without onViewDetails callback", () => {
    render(<PropertyCard property={mockProperty} />);

    const viewButton = screen.getByText("👁️ Ver Detalles");
    expect(viewButton).toBeInTheDocument();

    // Should not throw error when clicked without callback
    expect(() => fireEvent.click(viewButton)).not.toThrow();
  });

  it("renders price with correct formatting", () => {
    const propertyWithDifferentPrice = {
      ...mockProperty,
      price: 2500000,
    };
    render(<PropertyCard property={propertyWithDifferentPrice} />);

    expect(screen.getByText(/💰.*2\.500\.000/)).toBeInTheDocument();
  });

  it("renders with minimal property data", () => {
    const minimalProperty = {
      idProperty: "123",
      idOwner: "owner-123",
      name: "",
      address: "",
      price: 0,
    };
    render(<PropertyCard property={minimalProperty} />);

    expect(screen.getByText("🏡 Sin nombre")).toBeInTheDocument();
    expect(screen.getByText("📍 Sin dirección")).toBeInTheDocument();
    expect(screen.getByText(/💰.*0/)).toBeInTheDocument();
  });

  it("renders with null imageUrl", () => {
    const propertyWithNullImage = { ...mockProperty, imageUrl: null };
    render(<PropertyCard property={propertyWithNullImage} />);

    expect(screen.queryByAltText("Test Property")).not.toBeInTheDocument();
  });

  it("renders with empty string imageUrl", () => {
    const propertyWithEmptyImage = { ...mockProperty, imageUrl: "" };
    render(<PropertyCard property={propertyWithEmptyImage} />);

    expect(screen.queryByAltText("Test Property")).not.toBeInTheDocument();
  });

  it("handles very large price values", () => {
    const propertyWithLargePrice = {
      ...mockProperty,
      price: 999999999,
    };
    render(<PropertyCard property={propertyWithLargePrice} />);

    expect(screen.getByText(/💰.*999\.999\.999/)).toBeInTheDocument();
  });

  it("renders all required elements", () => {
    render(<PropertyCard property={mockProperty} />);

    // Check that all main elements are present
    expect(screen.getByTestId("property-card")).toBeInTheDocument();
    expect(screen.getByText("🏡 Test Property")).toBeInTheDocument();
    expect(screen.getByText("📍 123 Test Street")).toBeInTheDocument();
    expect(screen.getByText(/💰.*1\.000\.000/)).toBeInTheDocument();
    expect(screen.getByText("👁️ Ver Detalles")).toBeInTheDocument();
  });

  it("handles property with special characters in name and address", () => {
    const propertyWithSpecialChars = {
      ...mockProperty,
      name: "Casa & Apartamento @123",
      address: "Calle 123 #45-67, Barrio Centro",
    };
    render(<PropertyCard property={propertyWithSpecialChars} />);

    expect(screen.getByText("🏡 Casa & Apartamento @123")).toBeInTheDocument();
    expect(
      screen.getByText("📍 Calle 123 #45-67, Barrio Centro")
    ).toBeInTheDocument();
  });

  it("renders edit button when onEdit is provided", () => {
    const mockOnEdit = jest.fn();
    render(<PropertyCard property={mockProperty} onEdit={mockOnEdit} />);

    const editButton = screen.getByText("✏️");
    expect(editButton).toBeInTheDocument();
  });

  it("renders delete button when onDelete is provided", () => {
    const mockOnDelete = jest.fn();
    render(<PropertyCard property={mockProperty} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("🗑️");
    expect(deleteButton).toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    render(<PropertyCard property={mockProperty} onEdit={mockOnEdit} />);

    const editButton = screen.getByText("✏️");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProperty);
  });

  it("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = jest.fn();
    render(<PropertyCard property={mockProperty} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByText("🗑️");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("123");
  });

  it("does not render edit button when onEdit is not provided", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.queryByText("✏️")).not.toBeInTheDocument();
  });

  it("does not render delete button when onDelete is not provided", () => {
    render(<PropertyCard property={mockProperty} />);

    expect(screen.queryByText("🗑️")).not.toBeInTheDocument();
  });

  it("does not call onDelete when property has no idProperty", () => {
    const mockOnDelete = jest.fn();
    const propertyWithoutId = { ...mockProperty, idProperty: undefined };
    render(
      <PropertyCard property={propertyWithoutId} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByText("🗑️");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).not.toHaveBeenCalled();
  });

  it("renders both edit and delete buttons when both callbacks are provided", () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      <PropertyCard
        property={mockProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText("✏️")).toBeInTheDocument();
    expect(screen.getByText("🗑️")).toBeInTheDocument();
  });

  it("calls both onEdit and onDelete when both buttons are clicked", () => {
    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();
    render(
      <PropertyCard
        property={mockProperty}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const editButton = screen.getByText("✏️");
    const deleteButton = screen.getByText("🗑️");

    fireEvent.click(editButton);
    fireEvent.click(deleteButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockProperty);
    expect(mockOnDelete).toHaveBeenCalledWith("123");
  });
});
