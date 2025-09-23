import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

// Mock the OwnerCard component
jest.mock("@/components/molecules", () => ({
  OwnerCard: ({ owner, onViewOwner }: any) => (
    <div data-testid={`owner-card-${owner.idOwner}`}>
      <div>{owner.name}</div>
      <div>{owner.address}</div>
      {onViewOwner && (
        <button onClick={() => onViewOwner(owner.idOwner)}>Ver Detalles</button>
      )}
    </div>
  ),
}));

// Import the real component
import { OwnerList } from "../OwnerList";

const mockOwners = [
  {
    idOwner: "owner-1",
    name: "John Doe",
    address: "123 Main St",
    photo: "https://example.com/photo1.jpg",
    birthday: "1990-01-01T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    idOwner: "owner-2",
    name: "Jane Smith",
    address: "456 Oak Ave",
    photo: "https://example.com/photo2.jpg",
    birthday: "1985-05-15T00:00:00.000Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
];

describe("OwnerList Component", () => {
  const mockOnViewOwner = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders owner list", () => {
    render(<OwnerList owners={mockOwners} onViewOwner={mockOnViewOwner} />);

    expect(screen.getByTestId("owner-card-owner-1")).toBeInTheDocument();
    expect(screen.getByTestId("owner-card-owner-2")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles view owner", () => {
    render(<OwnerList owners={mockOwners} onViewOwner={mockOnViewOwner} />);

    const viewButtons = screen.getAllByText("Ver Detalles");
    fireEvent.click(viewButtons[0]);

    expect(mockOnViewOwner).toHaveBeenCalledWith("owner-1");
  });

  it("applies custom className", () => {
    render(
      <OwnerList
        owners={mockOwners}
        onViewOwner={mockOnViewOwner}
        className="custom-class"
      />
    );

    const container = screen
      .getByTestId("owner-card-owner-1")
      .closest(".custom-class");
    expect(container).toBeInTheDocument();
  });

  it("handles empty owners array", () => {
    render(<OwnerList owners={[]} onViewOwner={mockOnViewOwner} />);

    expect(
      screen.getByText("No hay propietarios registrados")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Crea tu primer propietario para comenzar")
    ).toBeInTheDocument();
  });

  it("renders without action callbacks", () => {
    render(<OwnerList owners={mockOwners} />);

    expect(screen.getByTestId("owner-card-owner-1")).toBeInTheDocument();
    expect(screen.getByTestId("owner-card-owner-2")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("handles single owner", () => {
    const singleOwner = [mockOwners[0]];

    render(<OwnerList owners={singleOwner} onViewOwner={mockOnViewOwner} />);

    expect(screen.getByTestId("owner-card-owner-1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByTestId("owner-card-owner-2")).not.toBeInTheDocument();
  });

  it("handles multiple owners", () => {
    render(<OwnerList owners={mockOwners} onViewOwner={mockOnViewOwner} />);

    expect(screen.getByTestId("owner-card-owner-1")).toBeInTheDocument();
    expect(screen.getByTestId("owner-card-owner-2")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });
});
