import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { OwnerDetailView } from "../OwnerDetailView";

// Mock OwnerDetail component
jest.mock("@/components/molecules", () => ({
  OwnerDetail: ({ owner, onEdit, onDelete }: any) => (
    <div data-testid="owner-detail">
      <h1>{owner.name}</h1>
      <p>{owner.email}</p>
      {onEdit && <button onClick={onEdit}>Edit</button>}
      {onDelete && <button onClick={onDelete}>Delete</button>}
    </div>
  ),
}));

// Mock Button component
jest.mock("@/components/atoms", () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

describe("OwnerDetailView", () => {
  const mockOwner = {
    id: "owner-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "123-456-7890",
  };

  const mockOnBack = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders owner details", () => {
    render(
      <OwnerDetailView
        owner={mockOwner}
        onBack={mockOnBack}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId("owner-detail")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });

  it("renders back button when onBack is provided", () => {
    render(
      <OwnerDetailView
        owner={mockOwner}
        onBack={mockOnBack}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const backButton = screen.getByRole("button", {
      name: /volver a la lista/i,
    });
    expect(backButton).toBeInTheDocument();
    expect(backButton).toHaveClass(
      "flex items-center text-blue-600 hover:text-blue-500"
    );
  });

  it("does not render back button when onBack is not provided", () => {
    render(
      <OwnerDetailView
        owner={mockOwner}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(
      screen.queryByRole("button", { name: /volver a la lista/i })
    ).not.toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", () => {
    render(
      <OwnerDetailView
        owner={mockOwner}
        onBack={mockOnBack}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const backButton = screen.getByRole("button", {
      name: /volver a la lista/i,
    });
    fireEvent.click(backButton);

    expect(mockOnBack).toHaveBeenCalledTimes(1);
  });

  it("uses custom back button text", () => {
    render(
      <OwnerDetailView
        owner={mockOwner}
        onBack={mockOnBack}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        backButtonText="Custom Back Text"
      />
    );

    expect(
      screen.getByRole("button", { name: /custom back text/i })
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <OwnerDetailView
        owner={mockOwner}
        onBack={mockOnBack}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        className="custom-class"
      />
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("passes onEdit and onDelete to OwnerDetail", () => {
    render(
      <OwnerDetailView
        owner={mockOwner}
        onBack={mockOnBack}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check that the OwnerDetail component receives the callbacks
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("does not pass onEdit and onDelete when not provided", () => {
    render(<OwnerDetailView owner={mockOwner} onBack={mockOnBack} />);

    // Check that the OwnerDetail component does not receive the callbacks
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("handles owner with minimal data", () => {
    const minimalOwner = {
      id: "owner-2",
      name: "Jane Smith",
    };

    render(<OwnerDetailView owner={minimalOwner} onBack={mockOnBack} />);

    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByTestId("owner-detail")).toBeInTheDocument();
  });

  it("renders without any optional props", () => {
    render(<OwnerDetailView owner={mockOwner} />);

    expect(screen.getByTestId("owner-detail")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /volver a la lista/i })
    ).not.toBeInTheDocument();
  });
});
