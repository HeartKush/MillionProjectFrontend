import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { OwnerDetail } from "../OwnerDetail";

// Mock the Button component
jest.mock("@/components/atoms", () => ({
  Button: ({ children, onClick, variant, icon }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-testid={`button-${variant}`}
    >
      {icon}
      {children}
    </button>
  ),
}));

// Mock the PropertyListByOwner component
jest.mock("@/components/molecules", () => ({
  PropertyListByOwner: ({ ownerId, ownerName }: any) => (
    <div data-testid="property-list-by-owner">
      Properties for {ownerName} (ID: {ownerId})
    </div>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Edit: jest.fn(() => <svg data-testid="edit-icon" />),
  Trash2: jest.fn(() => <svg data-testid="trash-icon" />),
  Users: jest.fn(() => <svg data-testid="users-icon" />),
  UserCheck: jest.fn(() => <svg data-testid="user-check-icon" />),
  Calendar: jest.fn(() => <svg data-testid="calendar-icon" />),
}));

// Mock date-fns
jest.mock("date-fns", () => ({
  format: jest.fn((date, formatStr, options) => {
    // Mock the formatted date
    return "15 de enero de 1990";
  }),
}));

jest.mock("date-fns/locale", () => ({
  es: {},
}));

describe("OwnerDetail", () => {
  const mockOwner = {
    idOwner: "owner-1",
    name: "John Doe",
    address: "123 Main St",
    birthday: "1990-01-15T00:00:00Z",
    photo: "https://example.com/photo.jpg",
    createdAt: "2024-01-01T00:00:00Z",
  };

  const defaultProps = {
    owner: mockOwner,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders owner information correctly", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Propietario")).toBeInTheDocument();
    expect(screen.getByText("123 Main St")).toBeInTheDocument();
    expect(screen.getByText("15 de enero de 1990")).toBeInTheDocument();
  });

  it("renders owner photo when provided", () => {
    render(<OwnerDetail {...defaultProps} />);

    const photo = screen.getByAltText("John Doe");
    expect(photo).toBeInTheDocument();
    expect(photo).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  it("renders placeholder when no photo is provided", () => {
    const ownerWithoutPhoto = {
      ...mockOwner,
      photo: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerDetail owner={ownerWithoutPhoto} />);

    expect(screen.getByText("J")).toBeInTheDocument(); // First letter of name
    expect(screen.queryByAltText("John Doe")).not.toBeInTheDocument();
  });

  it("renders placeholder when no name is provided", () => {
    const ownerWithoutName = {
      ...mockOwner,
      name: undefined,
      photo: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerDetail owner={ownerWithoutName} />);

    expect(screen.getByText("?")).toBeInTheDocument();
    expect(screen.getByText("Sin nombre")).toBeInTheDocument();
  });

  it("renders address placeholder when no address is provided", () => {
    const ownerWithoutAddress = {
      ...mockOwner,
      address: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerDetail owner={ownerWithoutAddress} />);

    expect(screen.getByText("No especificada")).toBeInTheDocument();
  });

  it("does not render birthday section when birthday is not provided", () => {
    const ownerWithoutBirthday = {
      ...mockOwner,
      birthday: undefined,
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerDetail owner={ownerWithoutBirthday} />);

    expect(screen.queryByText("Fecha de Nacimiento")).not.toBeInTheDocument();
    expect(screen.queryByText("15 de enero de 1990")).not.toBeInTheDocument();
  });

  it("renders owner ID correctly", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.getByText("ID del Propietario:")).toBeInTheDocument();
    expect(screen.getByText("owner-1")).toBeInTheDocument();
  });

  it("renders edit button when onEdit is provided", () => {
    const mockOnEdit = jest.fn();
    render(<OwnerDetail {...defaultProps} onEdit={mockOnEdit} />);

    const editButton = screen.getByTestId("button-primary");
    expect(editButton).toBeInTheDocument();
    expect(screen.getByText("Editar Propietario")).toBeInTheDocument();
    expect(screen.getByTestId("edit-icon")).toBeInTheDocument();
  });

  it("renders delete button when onDelete is provided", () => {
    const mockOnDelete = jest.fn();
    render(<OwnerDetail {...defaultProps} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTestId("button-danger");
    expect(deleteButton).toBeInTheDocument();
    expect(screen.getByText("Eliminar")).toBeInTheDocument();
    expect(screen.getByTestId("trash-icon")).toBeInTheDocument();
  });

  it("does not render edit button when onEdit is not provided", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.queryByText("Editar Propietario")).not.toBeInTheDocument();
  });

  it("does not render delete button when onDelete is not provided", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.queryByText("Eliminar")).not.toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnEdit = jest.fn();
    render(<OwnerDetail {...defaultProps} onEdit={mockOnEdit} />);

    const editButton = screen.getByTestId("button-primary");
    await user.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const mockOnDelete = jest.fn();
    render(<OwnerDetail {...defaultProps} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByTestId("button-danger");
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("renders PropertyListByOwner component", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.getByTestId("property-list-by-owner")).toBeInTheDocument();
    expect(
      screen.getByText("Properties for John Doe (ID: owner-1)")
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<OwnerDetail {...defaultProps} className="custom-class" />);

    const container = screen.getByText("John Doe").closest(".custom-class");
    expect(container).toBeInTheDocument();
  });

  it("renders all required icons", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.getByTestId("users-icon")).toBeInTheDocument();
    expect(screen.getByTestId("user-check-icon")).toBeInTheDocument();
    expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
  });

  it("renders correct section titles", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.getByText("Información Personal")).toBeInTheDocument();
    expect(screen.getByText("Fecha de Nacimiento")).toBeInTheDocument();
    expect(screen.getByText("Datos del propietario")).toBeInTheDocument();
    expect(screen.getByText("Detalles de nacimiento")).toBeInTheDocument();
  });

  it("renders correct field labels", () => {
    render(<OwnerDetail {...defaultProps} />);

    expect(screen.getByText("Dirección")).toBeInTheDocument();
  });

  it("handles owner with minimal information", () => {
    const minimalOwner = {
      idOwner: "owner-2",
      name: "Jane",
      createdAt: "2024-01-01T00:00:00Z",
    };
    render(<OwnerDetail owner={minimalOwner} />);

    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("No especificada")).toBeInTheDocument();
    expect(screen.getByText("owner-2")).toBeInTheDocument();
    expect(screen.queryByText("Fecha de Nacimiento")).not.toBeInTheDocument();
  });
});
