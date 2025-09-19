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
  Button: ({ children, onClick, size, variant, className, ...props }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-size={size}
      data-variant={variant}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/lib/hooks", () => ({
  useOwners: jest.fn(),
}));

// Import the real component
import { OwnerList } from "../OwnerList";
import { useOwners } from "@/lib/hooks";

const mockOwners = [
  {
    idOwner: "owner-1",
    name: "John Doe",
    address: "123 Main St",
    photo: "https://example.com/photo1.jpg",
    birthday: "1990-01-01T00:00:00.000Z",
  },
  {
    idOwner: "owner-2",
    name: "Jane Smith",
    address: "456 Oak Ave",
    photo: "https://example.com/photo2.jpg",
    birthday: "1985-05-15T00:00:00.000Z",
  },
];

describe("OwnerList Component", () => {
  const mockOnEditOwner = jest.fn();
  const mockOnDeleteOwner = jest.fn();
  const mockOnViewOwner = jest.fn();
  const mockUseOwners = useOwners as jest.MockedFunction<typeof useOwners>;

  const createMockQueryResult = (overrides: any = {}) => ({
    data: mockOwners,
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
    mockUseOwners.mockReturnValue(createMockQueryResult());
  });

  it("renders owner list", () => {
    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
    expect(screen.getByText("👤 Propietarios")).toBeInTheDocument();
    expect(screen.getByText(/👤.*John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/👤.*Jane Smith/)).toBeInTheDocument();
  });

  it("handles edit owner", () => {
    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    const editButton = screen.getAllByText("✏️")[0];
    fireEvent.click(editButton);

    expect(mockOnEditOwner).toHaveBeenCalledWith(mockOwners[0]);
  });

  it("handles delete owner", () => {
    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    const deleteButton = screen.getAllByText("🗑️")[0];
    fireEvent.click(deleteButton);

    expect(mockOnDeleteOwner).toHaveBeenCalledWith("owner-1");
  });

  it("handles view owner", () => {
    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    const viewButton = screen.getAllByText("👁️ Ver")[0];
    fireEvent.click(viewButton);

    expect(mockOnViewOwner).toHaveBeenCalledWith("owner-1");
  });

  it("applies custom className", () => {
    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
        className="custom-class"
      />
    );

    const list = screen.getByTestId("owner-list");
    expect(list).toHaveClass("custom-class");
  });

  it("handles empty owners array", () => {
    mockUseOwners.mockReturnValue(createMockQueryResult({ data: [] }));

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(
      screen.getByText("No se encontraron propietarios")
    ).toBeInTheDocument();
  });

  it("handles loading state", () => {
    mockUseOwners.mockReturnValue(
      createMockQueryResult({
        data: null,
        isLoading: true,
        isSuccess: false,
        status: "pending" as const,
      })
    );

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("handles error state", () => {
    const mockRefetch = jest.fn();
    mockUseOwners.mockReturnValue(
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
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText("Reintentar")).toBeInTheDocument();
  });

  it("calls refetch when retry button is clicked", () => {
    const mockRefetch = jest.fn();
    mockUseOwners.mockReturnValue(
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
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    const retryButton = screen.getByText("Reintentar");
    fireEvent.click(retryButton);

    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("handles owners with missing name", () => {
    const ownersWithMissingName = [
      {
        idOwner: "owner-1",
        name: undefined,
        address: "123 Main St",
        photo: "https://example.com/photo1.jpg",
        birthday: "1990-01-01T00:00:00.000Z",
      },
    ];

    mockUseOwners.mockReturnValue(
      createMockQueryResult({
        data: ownersWithMissingName,
      })
    );

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByText("👤 Sin nombre")).toBeInTheDocument();
  });

  it("handles owners with missing photo", () => {
    const ownersWithoutPhoto = [
      {
        idOwner: "owner-1",
        name: "John Doe",
        address: "123 Main St",
        photo: undefined,
        birthday: "1990-01-01T00:00:00.000Z",
      },
    ];

    mockUseOwners.mockReturnValue(
      createMockQueryResult({
        data: ownersWithoutPhoto,
      })
    );

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByText("J")).toBeInTheDocument(); // First letter of "John Doe"
  });

  it("handles owners with empty name", () => {
    const ownersWithEmptyName = [
      {
        idOwner: "owner-1",
        name: "",
        address: "123 Main St",
        photo: undefined,
        birthday: "1990-01-01T00:00:00.000Z",
      },
    ];

    mockUseOwners.mockReturnValue(
      createMockQueryResult({
        data: ownersWithEmptyName,
      })
    );

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByText("👤 Sin nombre")).toBeInTheDocument();
    expect(screen.getByText("?")).toBeInTheDocument(); // Fallback for empty name
  });

  it("handles single owner count display", () => {
    const singleOwner = [mockOwners[0]];

    mockUseOwners.mockReturnValue(
      createMockQueryResult({
        data: singleOwner,
      })
    );

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByText(/1.*propietario registrado/)).toBeInTheDocument();
  });

  it("handles multiple owners count display", () => {
    mockUseOwners.mockReturnValue(createMockQueryResult());

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(screen.getByText(/2.*propietarios registrados/)).toBeInTheDocument();
  });

  it("renders without action callbacks", () => {
    mockUseOwners.mockReturnValue(createMockQueryResult());

    render(<OwnerList />);

    expect(screen.getByTestId("owner-list")).toBeInTheDocument();
    expect(screen.queryByText("👁️ Ver")).not.toBeInTheDocument();
    expect(screen.queryByText("✏️")).not.toBeInTheDocument();
    expect(screen.queryByText("🗑️")).not.toBeInTheDocument();
  });

  it("handles null owners data", () => {
    mockUseOwners.mockReturnValue(createMockQueryResult({ data: null }));

    render(
      <OwnerList
        onEditOwner={mockOnEditOwner}
        onDeleteOwner={mockOnDeleteOwner}
        onViewOwner={mockOnViewOwner}
      />
    );

    expect(
      screen.getByText("No se encontraron propietarios")
    ).toBeInTheDocument();
  });
});
