import React from "react";
import { render, screen } from "@testing-library/react";

// Mock the Card component and utility functions
jest.mock("@/components/atoms", () => ({
  Card: ({ title, subtitle, imageUrl, children, className }: any) => (
    <div data-testid="property-detail" className={className}>
      <h2>{title}</h2>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}));

jest.mock("@/lib/utils", () => ({
  formatCurrency: (amount: number) => `$${amount.toLocaleString()}`,
  formatDate: (date: string) => new Date(date).toLocaleDateString(),
}));

// Import the real component
import { PropertyDetail } from "../PropertyDetail";

const mockProperty = {
  idProperty: "prop-1",
  idOwner: "owner-1",
  name: "Test Property",
  address: "123 Test Street",
  price: 1000000,
  imageUrl: "https://example.com/image.jpg",
  year: 2020,
  codeInternal: "PROP-001",
};

describe("PropertyDetail Component", () => {
  it("renders property information correctly", () => {
    render(<PropertyDetail property={mockProperty} />);

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
    expect(screen.getByText("$1,000,000")).toBeInTheDocument();
    expect(screen.getByText("2020")).toBeInTheDocument();
    expect(screen.getByText("PROP-001")).toBeInTheDocument();
  });

  it("renders image when imageUrl is provided", () => {
    render(<PropertyDetail property={mockProperty} />);

    const image = screen.getByAltText("Test Property");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
    expect(image).toHaveClass("w-full h-64 object-cover rounded-lg");
  });

  it("handles missing image gracefully", () => {
    const propertyWithoutImage = { ...mockProperty, imageUrl: undefined };
    render(<PropertyDetail property={propertyWithoutImage} />);

    expect(screen.queryByAltText("Test Property")).not.toBeInTheDocument();
  });

  it("handles missing property name", () => {
    const propertyWithoutName = { ...mockProperty, name: undefined };
    render(<PropertyDetail property={propertyWithoutName} />);

    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
  });

  it("handles missing property address", () => {
    const propertyWithoutAddress = { ...mockProperty, address: undefined };
    render(<PropertyDetail property={propertyWithoutAddress} />);

    expect(screen.getByText("Sin dirección")).toBeInTheDocument();
  });

  it("handles missing year", () => {
    const propertyWithoutYear = { ...mockProperty, year: undefined as any };
    render(<PropertyDetail property={propertyWithoutYear} />);

    expect(screen.getByText("Precio:")).toBeInTheDocument();
  });

  it("handles missing code internal", () => {
    const propertyWithoutCode = { ...mockProperty, codeInternal: undefined };
    render(<PropertyDetail property={propertyWithoutCode} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<PropertyDetail property={mockProperty} className="custom-class" />);

    const detail = screen.getByTestId("property-detail");
    expect(detail).toHaveClass("custom-class");
  });
});
