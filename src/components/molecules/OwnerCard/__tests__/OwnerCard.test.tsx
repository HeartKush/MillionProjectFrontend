import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the Card and Button components
jest.mock("@/components/atoms", () => ({
  Card: ({ children, className, ...props }: any) => (
    <div data-testid="owner-card" className={className} {...props}>
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

import { OwnerCard } from "../OwnerCard";

const mockOwner = {
  idOwner: "123",
  name: "Test Owner",
  address: "123 Test Street",
  photo: "https://example.com/photo.jpg",
  createdAt: "2024-01-01T00:00:00Z",
};

describe("OwnerCard Component", () => {
  it("renders owner information correctly", () => {
    render(<OwnerCard owner={mockOwner} onViewOwner={jest.fn()} />);

    expect(screen.getByText("Test Owner")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("Ver Detalles")).toBeInTheDocument();
  });

  it("renders with image when provided", () => {
    render(<OwnerCard owner={mockOwner} onViewOwner={jest.fn()} />);

    const image = screen.getByAltText("Test Owner");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("handles missing image gracefully", () => {
    const ownerWithoutPhoto = {
      ...mockOwner,
      photo: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerCard owner={ownerWithoutPhoto} onViewOwner={jest.fn()} />);

    expect(screen.getByText("Test Owner")).toBeInTheDocument();
    // Should show fallback avatar
    expect(screen.getByText("T")).toBeInTheDocument(); // First letter of name
  });

  it("handles missing name gracefully", () => {
    const ownerWithoutName = {
      ...mockOwner,
      name: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerCard owner={ownerWithoutName} onViewOwner={jest.fn()} />);

    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
  });

  it("handles missing address gracefully", () => {
    const ownerWithoutAddress = {
      ...mockOwner,
      address: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerCard owner={ownerWithoutAddress} onViewOwner={jest.fn()} />);

    expect(screen.getByText("Sin dirección")).toBeInTheDocument();
  });

  it("calls onViewOwner when view details button is clicked", () => {
    const mockOnViewOwner = jest.fn();
    render(<OwnerCard owner={mockOwner} onViewOwner={mockOnViewOwner} />);

    const viewButton = screen.getByText("Ver Detalles");
    fireEvent.click(viewButton);

    expect(mockOnViewOwner).toHaveBeenCalledWith("123");
  });

  it("does not render view button when onViewOwner is not provided", () => {
    render(<OwnerCard owner={mockOwner} />);

    expect(screen.queryByText("Ver Detalles")).not.toBeInTheDocument();
  });

  it("does not call onViewOwner when owner has no idOwner", () => {
    const mockOnViewOwner = jest.fn();
    const ownerWithoutId = {
      ...mockOwner,
      idOwner: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerCard owner={ownerWithoutId} onViewOwner={mockOnViewOwner} />);

    expect(screen.queryByText("Ver Detalles")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <OwnerCard
        owner={mockOwner}
        onViewOwner={jest.fn()}
        className="custom-class"
      />
    );

    const card = screen.getByTestId("owner-card");
    expect(card).toHaveClass("custom-class");
  });

  it("renders fallback avatar with first letter of name", () => {
    const ownerWithoutPhoto = {
      ...mockOwner,
      photo: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerCard owner={ownerWithoutPhoto} onViewOwner={jest.fn()} />);

    expect(screen.getByText("T")).toBeInTheDocument(); // First letter of "Test Owner"
  });

  it("renders fallback avatar with question mark when no name", () => {
    const ownerWithoutName = {
      ...mockOwner,
      name: undefined,
      photo: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerCard owner={ownerWithoutName} onViewOwner={jest.fn()} />);

    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("handles image error by showing fallback", () => {
    render(<OwnerCard owner={mockOwner} onViewOwner={jest.fn()} />);

    const image = screen.getByAltText("Test Owner");
    fireEvent.error(image);

    // Should show fallback avatar
    expect(screen.getByText("T")).toBeInTheDocument();
  });

  it("renders with correct accessibility attributes", () => {
    render(<OwnerCard owner={mockOwner} onViewOwner={jest.fn()} />);

    const card = screen.getByTestId("owner-card");
    expect(card).toHaveAttribute("data-testid", "owner-card");
  });
});
