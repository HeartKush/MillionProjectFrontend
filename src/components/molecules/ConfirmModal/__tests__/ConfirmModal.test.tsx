import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfirmModal } from "../ConfirmModal";

// Mock the Modal and Button components
jest.mock("@/components/atoms", () => ({
  Modal: ({ isOpen, onClose, children, title, size }: any) =>
    isOpen ? (
      <div data-testid="modal" data-size={size}>
        <div data-testid="modal-title">{title}</div>
        {children}
        <button onClick={onClose} data-testid="modal-close">
          Close Modal
        </button>
      </div>
    ) : null,
  Button: ({ children, onClick, variant, disabled, className, type }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      disabled={disabled}
      className={className}
      type={type}
      data-testid={`button-${variant || "default"}`}
    >
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  AlertTriangle: jest.fn(() => <svg data-testid="alert-triangle-icon" />),
  CheckCircle: jest.fn(() => <svg data-testid="check-circle-icon" />),
}));

describe("ConfirmModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    title: "Confirm Action",
    message: "Are you sure you want to proceed?",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when isOpen is true", () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(
      screen.getByText("Are you sure you want to proceed?")
    ).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("renders with default button texts", () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Confirmar")).toBeInTheDocument();
  });

  it("renders with custom button texts", () => {
    render(
      <ConfirmModal {...defaultProps} confirmText="Delete" cancelText="Keep" />
    );

    expect(screen.getByText("Keep")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders danger variant by default", () => {
    render(<ConfirmModal {...defaultProps} />);

    expect(screen.getByTestId("alert-triangle-icon")).toBeInTheDocument();
    expect(screen.getByTestId("button-danger")).toBeInTheDocument();
  });

  it("renders warning variant", () => {
    render(<ConfirmModal {...defaultProps} variant="warning" />);

    expect(screen.getByTestId("alert-triangle-icon")).toBeInTheDocument();
    expect(screen.getByTestId("button-primary")).toBeInTheDocument();
  });

  it("renders info variant", () => {
    render(<ConfirmModal {...defaultProps} variant="info" />);

    expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument();
    expect(screen.getByTestId("button-primary")).toBeInTheDocument();
  });

  it("calls onClose when cancel button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByText("Cancelar");
    await user.click(cancelButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByText("Confirmar");
    await user.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables buttons when isLoading is true", () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);

    const cancelButton = screen.getByTestId("button-ghost");
    const confirmButton = screen.getByTestId("button-danger");

    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toBeDisabled();
  });

  it("shows loading text when isLoading is true", () => {
    render(<ConfirmModal {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Procesando...")).toBeInTheDocument();
    expect(screen.queryByText("Confirmar")).not.toBeInTheDocument();
  });

  it("passes correct props to Modal", () => {
    render(<ConfirmModal {...defaultProps} />);

    const modal = screen.getByTestId("modal");
    expect(modal).toHaveAttribute("data-size", "sm");
    expect(screen.getByTestId("modal-title")).toHaveTextContent("");
  });

  it("calls onClose when modal close button is clicked", async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);

    const modalCloseButton = screen.getByTestId("modal-close");
    await user.click(modalCloseButton);

    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("applies correct button variants for different confirmation types", () => {
    const { rerender } = render(
      <ConfirmModal {...defaultProps} variant="danger" />
    );
    expect(screen.getByTestId("button-danger")).toBeInTheDocument();

    rerender(<ConfirmModal {...defaultProps} variant="warning" />);
    expect(screen.getByTestId("button-primary")).toBeInTheDocument();

    rerender(<ConfirmModal {...defaultProps} variant="info" />);
    expect(screen.getByTestId("button-primary")).toBeInTheDocument();
  });

  it("renders with custom className on buttons", () => {
    render(<ConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByTestId("button-ghost");
    const confirmButton = screen.getByTestId("button-danger");

    expect(cancelButton).toHaveClass("px-6");
    expect(confirmButton).toHaveClass("px-6");
  });

  it("sets correct button types", () => {
    render(<ConfirmModal {...defaultProps} />);

    const cancelButton = screen.getByTestId("button-ghost");
    const confirmButton = screen.getByTestId("button-danger");

    expect(cancelButton).toHaveAttribute("type", "button");
    expect(confirmButton).toHaveAttribute("type", "button");
  });

  it("handles multiple clicks correctly", async () => {
    const user = userEvent.setup();
    render(<ConfirmModal {...defaultProps} />);

    const confirmButton = screen.getByText("Confirmar");
    await user.click(confirmButton);
    await user.click(confirmButton);

    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(2);
  });
});
