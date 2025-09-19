import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the dependencies
jest.mock("@/components/atoms", () => ({
  LoadingSpinner: ({ size }: any) => (
    <div data-testid="loading-spinner">Loading...</div>
  ),
  ErrorMessage: ({ message, variant }: any) => (
    <div data-testid="error-message">{message}</div>
  ),
}));

jest.mock("@/components/molecules", () => ({
  PropertyCard: ({ property, onViewDetails, onEdit, onDelete }: any) => (
    <div data-testid={`property-card-${property.idProperty}`}>
      <h3>{property.name}</h3>
      <p>{property.address}</p>
      <button onClick={() => onViewDetails?.(property.idProperty)}>
        Ver Detalles
      </button>
      <button onClick={() => onEdit?.(property)}>Editar</button>
      <button onClick={() => onDelete?.(property.idProperty)}>Eliminar</button>
    </div>
  ),
}));

jest.mock("@/lib/hooks", () => ({
  useProperties: jest.fn(),
}));

// Import the real component
import { PropertyList } from "../PropertyList";
import { useProperties } from "@/lib/hooks";

const mockProperties = [
  {
    idProperty: "prop-1",
    name: "Test Property 1",
    address: "123 Test St",
    price: 100000,
    imageUrl: "https://example.com/image1.jpg",
  },
  {
    idProperty: "prop-2",
    name: "Test Property 2",
    address: "456 Test Ave",
    price: 200000,
    imageUrl: "https://example.com/image2.jpg",
  },
];

describe("PropertyList Component", () => {
  const mockOnPropertyClick = jest.fn();
  const mockOnEditProperty = jest.fn();
  const mockOnDeleteProperty = jest.fn();
  const mockUseProperties = useProperties as jest.MockedFunction<
    typeof useProperties
  >;

  const createMockQueryResult = (overrides: any = {}) => ({
    data: mockProperties,
    isLoading: false,
    error: null,
    refetch: jest.fn(),
    isError: false,
    isPending: false,
    isLoadingError: false,
    isRefetchError: false,
    isSuccess: true,
    isFetching: false,
    isRefetching: false,
    isStale: false,
    isFetched: true,
    isFetchedAfterMount: true,
    isPlaceholderData: false,
    isPreviousData: false,
    status: "success" as const,
    fetchStatus: "idle" as const,
    dataUpdatedAt: Date.now(),
    errorUpdatedAt: 0,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    hasNextPage: false,
    hasPreviousPage: false,
    fetchNextPage: jest.fn(),
    fetchPreviousPage: jest.fn(),
    remove: jest.fn(),
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProperties.mockReturnValue(createMockQueryResult());
  });

  it("renders property list", () => {
    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    expect(screen.getByText("🏠 Propiedades")).toBeInTheDocument();
    expect(screen.getByText("Test Property 1")).toBeInTheDocument();
    expect(screen.getByText("Test Property 2")).toBeInTheDocument();
  });

  it("handles property click", () => {
    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    const clickButton = screen.getAllByText("Ver Detalles")[0];
    fireEvent.click(clickButton);

    expect(mockOnPropertyClick).toHaveBeenCalledWith("prop-1");
  });

  it("handles edit property", () => {
    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    const editButton = screen.getAllByText("Editar")[0];
    fireEvent.click(editButton);

    expect(mockOnEditProperty).toHaveBeenCalledWith(mockProperties[0]);
  });

  it("handles delete property", () => {
    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    const deleteButton = screen.getAllByText("Eliminar")[0];
    fireEvent.click(deleteButton);

    expect(mockOnDeleteProperty).toHaveBeenCalledWith("prop-1");
  });

  it("applies custom className", () => {
    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
        className="custom-class"
      />
    );

    const list = screen.getByText("🏠 Propiedades").closest("div")
      ?.parentElement?.parentElement;
    expect(list).toHaveClass("custom-class");
  });

  it("handles empty properties array", () => {
    mockUseProperties.mockReturnValue(createMockQueryResult({ data: [] }));

    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    expect(
      screen.getByText("No se encontraron propiedades")
    ).toBeInTheDocument();
  });

  it("handles loading state", () => {
    mockUseProperties.mockReturnValue(
      createMockQueryResult({
        data: null,
        isLoading: true,
        isSuccess: false,
        status: "pending" as const,
      })
    );

    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("handles error state", () => {
    const mockRefetch = jest.fn();
    mockUseProperties.mockReturnValue(
      createMockQueryResult({
        data: null,
        isLoading: false,
        error: new Error("Test error"),
        refetch: mockRefetch,
        isError: true,
        isSuccess: false,
        status: "error" as const,
      })
    );

    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Reintentar")).toBeInTheDocument();

    // Click the retry button to cover line 51
    const retryButton = screen.getByText("Reintentar");
    fireEvent.click(retryButton);

    // Verify that refetch was called
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("renders single property count correctly (line 81)", () => {
    // Test with exactly 1 property to cover the singular case
    const singleProperty = [mockProperties[0]];

    mockUseProperties.mockReturnValue(
      createMockQueryResult({
        data: singleProperty,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: "success" as const,
      })
    );

    render(
      <PropertyList
        filters={{}}
        onPropertyClick={mockOnPropertyClick}
        onEditProperty={mockOnEditProperty}
        onDeleteProperty={mockOnDeleteProperty}
      />
    );

    // Verify that the singular form "propiedad encontrada" is displayed
    expect(screen.getByText("✨ 1 propiedad encontrada")).toBeInTheDocument();
  });
});
