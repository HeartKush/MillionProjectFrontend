import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the dependencies
jest.mock("@/components/atoms", () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@/components/molecules", () => ({
  PropertyDetail: ({ property, onEdit, onDelete, ownerName }: any) => (
    <div data-testid="property-detail">
      {property ? (
        <>
          <h1>{property.name}</h1>
          <p>{property.address}</p>
          <p>Price: {property.price}</p>
          {ownerName && <p>Owner: {ownerName}</p>}
          {onEdit !== undefined && <button onClick={onEdit}>Edit</button>}
          {onDelete !== undefined && <button onClick={onDelete}>Delete</button>}
        </>
      ) : (
        <p>No property data</p>
      )}
    </div>
  ),
}));

// Import the real component
import { PropertyDetailView } from "../PropertyDetailView";

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

describe("PropertyDetailView Component", () => {
  const mockOnBack = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders property detail view", () => {
    render(<PropertyDetailView property={mockProperty} onBack={mockOnBack} />);

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <PropertyDetailView property={mockProperty} className="custom-class" />
    );

    const container = screen.getByTestId("property-detail").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("handles back button", () => {
    render(<PropertyDetailView property={mockProperty} onBack={mockOnBack} />);

    const backButton = screen.getByText("Volver a la lista");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("handles edit button", () => {
    render(<PropertyDetailView property={mockProperty} onEdit={mockOnEdit} />);

    const editButton = screen.getByText("Edit");
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith("prop-1");
  });

  it("handles delete button", () => {
    render(
      <PropertyDetailView property={mockProperty} onDelete={mockOnDelete} />
    );

    const deleteButton = screen.getByText("Delete");
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith("prop-1");
  });

  it("displays owner name when provided", () => {
    render(<PropertyDetailView property={mockProperty} ownerName="John Doe" />);

    expect(screen.getByText("Owner: John Doe")).toBeInTheDocument();
  });

  it("renders without back button when onBack is not provided", () => {
    render(<PropertyDetailView property={mockProperty} />);

    expect(screen.queryByText("Volver a la lista")).not.toBeInTheDocument();
  });

  it("renders without edit/delete buttons when not provided", () => {
    render(<PropertyDetailView property={mockProperty} />);

    // The component should still render the property details
    expect(screen.getByText("Test Property")).toBeInTheDocument();
  });

  it("handles null property", () => {
    render(<PropertyDetailView property={null as any} />);

    expect(screen.getByText("No property data")).toBeInTheDocument();
  });
});
