import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PropertyListByOwner } from "../PropertyListByOwner";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the Card component
jest.mock("@/components/atoms", () => ({
  Card: ({ children, className, onClick }: any) => (
    <div className={className} onClick={onClick} data-testid="property-card">
      {children}
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Home: jest.fn(() => <svg data-testid="home-icon" />),
  MapPin: jest.fn(() => <svg data-testid="map-pin-icon" />),
  Calendar: jest.fn(() => <svg data-testid="calendar-icon" />),
  DollarSign: jest.fn(() => <svg data-testid="dollar-sign-icon" />),
  Eye: jest.fn(() => <svg data-testid="eye-icon" />),
}));

// Mock the usePropertiesByOwner hook
jest.mock("@/lib/hooks/useProperties", () => ({
  usePropertiesByOwner: jest.fn(),
}));

// Mock the formatCurrency utility
jest.mock("@/lib/utils", () => ({
  formatCurrency: jest.fn((amount) => `$${amount.toLocaleString()}`),
}));

describe("PropertyListByOwner", () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  };

  const mockProperties = [
    {
      idProperty: "prop-1",
      name: "Property 1",
      address: "123 Main St",
      price: 100000,
      imageUrl: "https://example.com/image1.jpg",
    },
    {
      idProperty: "prop-2",
      name: "Property 2",
      address: "456 Oak Ave",
      price: 200000,
      imageUrl: null,
    },
  ];

  const defaultProps = {
    ownerId: "owner-1",
    ownerName: "John Doe",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue(
      mockRouter
    );
    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: mockProperties,
      isLoading: false,
      error: null,
    });
  });

  it("renders properties list correctly", () => {
    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("Propiedades de John Doe")).toBeInTheDocument();
    expect(screen.getByText("2 propiedades registradas")).toBeInTheDocument();
    expect(screen.getByText("Property 1")).toBeInTheDocument();
    expect(screen.getByText("Property 2")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("456 Oak Ave")).toBeInTheDocument();
  });

  it("renders loading state", () => {
    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("Propiedades de John Doe")).toBeInTheDocument();
    expect(screen.getByText("Cargando propiedades...")).toBeInTheDocument();

    // Check for skeleton loaders
    const skeletonElements = document.querySelectorAll(".animate-pulse");
    expect(skeletonElements).toHaveLength(3);
  });

  it("renders error state", () => {
    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error("Failed to fetch"),
    });

    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("Propiedades de John Doe")).toBeInTheDocument();
    expect(
      screen.getByText("Error al cargar las propiedades")
    ).toBeInTheDocument();
  });

  it("renders empty state when no properties", () => {
    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("Propiedades de John Doe")).toBeInTheDocument();
    expect(screen.getByText("0 propiedades registradas")).toBeInTheDocument();
    expect(screen.getByText("Sin propiedades registradas")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Este propietario no tiene propiedades asociadas en el sistema."
      )
    ).toBeInTheDocument();
  });

  it("renders with default owner name when not provided", () => {
    render(<PropertyListByOwner ownerId="owner-1" />);

    expect(
      screen.getByText("Propiedades de este propietario")
    ).toBeInTheDocument();
  });

  it("navigates to property detail when property card is clicked", async () => {
    const user = userEvent.setup();
    render(<PropertyListByOwner {...defaultProps} />);

    const propertyCard = screen.getAllByTestId("property-card")[0];
    await user.click(propertyCard);

    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades/prop-1");
  });

  it("navigates to property detail when view button is clicked", async () => {
    const user = userEvent.setup();
    render(<PropertyListByOwner {...defaultProps} />);

    const viewButtons = screen.getAllByText("Ver detalles");
    await user.click(viewButtons[0]);

    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades/prop-1");
  });

  it("renders property images correctly", () => {
    render(<PropertyListByOwner {...defaultProps} />);

    const image1 = screen.getByAltText("Property 1");
    const image2 = screen.getByAltText("Property 2");

    expect(image1).toHaveAttribute("src", "https://example.com/image1.jpg");
    expect(image2).toHaveAttribute(
      "src",
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=800"
    );
  });

  it("renders property prices correctly", () => {
    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("$100,000")).toBeInTheDocument();
    expect(screen.getByText("$200,000")).toBeInTheDocument();
  });

  it("renders summary statistics", () => {
    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("Total Propiedades")).toBeInTheDocument();
    expect(screen.getByText("Valor Total")).toBeInTheDocument();
    expect(screen.getByText("Valor Promedio")).toBeInTheDocument();
    expect(screen.getByText("$300,000")).toBeInTheDocument(); // Total value
    expect(screen.getByText("$150,000")).toBeInTheDocument(); // Average value
  });

  it("does not render summary statistics when no properties", () => {
    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });

    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.queryByText("Total Propiedades")).not.toBeInTheDocument();
    expect(screen.queryByText("Valor Total")).not.toBeInTheDocument();
    expect(screen.queryByText("Valor Promedio")).not.toBeInTheDocument();
  });

  it("handles properties with missing data", () => {
    const propertiesWithMissingData = [
      {
        idProperty: "prop-1",
        name: null,
        address: null,
        price: 0,
        imageUrl: null,
      },
    ];

    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: propertiesWithMissingData,
      isLoading: false,
      error: null,
    });

    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
    expect(screen.getByText("Sin dirección")).toBeInTheDocument();
    // Check that $0 appears (there are multiple instances)
    const zeroElements = screen.getAllByText("$0");
    expect(zeroElements.length).toBeGreaterThan(0);
  });

  it("applies custom className", () => {
    render(<PropertyListByOwner {...defaultProps} className="custom-class" />);

    const container = screen
      .getByText("Propiedades de John Doe")
      .closest(".custom-class");
    expect(container).toBeInTheDocument();
  });

  it("renders all required icons", () => {
    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByTestId("home-icon")).toBeInTheDocument();
    // Check that map-pin-icon exists (there are multiple instances)
    const mapPinIcons = screen.getAllByTestId("map-pin-icon");
    expect(mapPinIcons.length).toBeGreaterThan(0);
    // Check that eye-icon exists (there are multiple instances)
    const eyeIcons = screen.getAllByTestId("eye-icon");
    expect(eyeIcons.length).toBeGreaterThan(0);
  });

  it("handles single property correctly", () => {
    const singleProperty = [mockProperties[0]];

    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: singleProperty,
      isLoading: false,
      error: null,
    });

    render(<PropertyListByOwner {...defaultProps} />);

    // Check for the property name and that Property 2 is not present
    expect(screen.getByText("Property 1")).toBeInTheDocument();
    expect(screen.queryByText("Property 2")).not.toBeInTheDocument();

    // Check that we have exactly one property card
    const propertyCards = screen.getAllByTestId("property-card");
    expect(propertyCards).toHaveLength(1);
  });

  it("stops event propagation when view button is clicked", async () => {
    const user = userEvent.setup();
    render(<PropertyListByOwner {...defaultProps} />);

    const viewButtons = screen.getAllByText("Ver detalles");

    // Mock stopPropagation
    const mockStopPropagation = jest.fn();
    const mockEvent = {
      stopPropagation: mockStopPropagation,
    };

    // Simulate click on view button
    fireEvent.click(viewButtons[0], mockEvent);

    expect(mockRouter.push).toHaveBeenCalledWith("/propiedades/prop-1");
  });

  it("renders with null properties data", () => {
    (
      require("@/lib/hooks/useProperties").usePropertiesByOwner as jest.Mock
    ).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    });

    render(<PropertyListByOwner {...defaultProps} />);

    expect(screen.getByText("Sin propiedades registradas")).toBeInTheDocument();
  });
});
