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
  PropertyDetail: ({ property }: any) => (
    <div data-testid="property-detail">
      <h1>{property.name}</h1>
      <p>{property.address}</p>
      <p>Price: {property.price}</p>
    </div>
  ),
}));

jest.mock("@/lib/hooks", () => ({
  useProperty: jest.fn(),
}));

// Import the real component
import { PropertyDetailView } from "../PropertyDetailView";
import { useProperty } from "@/lib/hooks";

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

describe("PropertyDetailView Component", () => {
  const mockUseProperty = useProperty as jest.MockedFunction<
    typeof useProperty
  >;

  const createMockQueryResult = (overrides: any = {}) => ({
    data: mockProperty,
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
  });

  it("renders property detail view", () => {
    mockUseProperty.mockReturnValue(createMockQueryResult());

    render(<PropertyDetailView propertyId="prop-1" />);

    expect(screen.getByTestId("property-detail")).toBeInTheDocument();
    expect(screen.getByText("Test Property")).toBeInTheDocument();
    expect(screen.getByText("123 Test Street")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    mockUseProperty.mockReturnValue(createMockQueryResult());

    render(<PropertyDetailView propertyId="prop-1" className="custom-class" />);

    const view = screen
      .getByTestId("property-detail")
      .closest("div")?.parentElement;
    expect(view).toHaveClass("custom-class");
  });

  it("handles loading state", () => {
    mockUseProperty.mockReturnValue(
      createMockQueryResult({
        data: null,
        isLoading: true,
        isSuccess: false,
        status: "pending" as const,
      })
    );

    render(<PropertyDetailView propertyId="prop-1" />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("handles error state", () => {
    const mockRefetch = jest.fn();
    mockUseProperty.mockReturnValue(
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

    render(<PropertyDetailView propertyId="prop-1" />);

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Reintentar")).toBeInTheDocument();
  });

  it("handles property not found", () => {
    mockUseProperty.mockReturnValue(createMockQueryResult({ data: null }));

    render(<PropertyDetailView propertyId="prop-1" />);

    expect(screen.getByText("Propiedad no encontrada")).toBeInTheDocument();
  });

  it("handles back button", () => {
    const mockOnBack = jest.fn();
    mockUseProperty.mockReturnValue(createMockQueryResult());

    render(<PropertyDetailView propertyId="prop-1" onBack={mockOnBack} />);

    const backButton = screen.getByText("Volver a la lista");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("handles retry button click", () => {
    const mockRefetch = jest.fn();
    mockUseProperty.mockReturnValue(
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

    render(<PropertyDetailView propertyId="prop-1" />);

    const retryButton = screen.getByText("Reintentar");
    fireEvent.click(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("handles back button in error state", () => {
    const mockOnBack = jest.fn();
    const mockRefetch = jest.fn();
    mockUseProperty.mockReturnValue(
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

    render(<PropertyDetailView propertyId="prop-1" onBack={mockOnBack} />);

    const backButton = screen.getByText("Volver");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("handles back button when property not found", () => {
    const mockOnBack = jest.fn();
    mockUseProperty.mockReturnValue(createMockQueryResult({ data: null }));

    render(<PropertyDetailView propertyId="prop-1" onBack={mockOnBack} />);

    const backButton = screen.getByText("Volver a la lista");
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });
});
