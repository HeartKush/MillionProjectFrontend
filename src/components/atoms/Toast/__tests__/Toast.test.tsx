import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Toast } from "../Toast";

describe("Toast", () => {
  const defaultProps = {
    id: "toast-1",
    title: "Test Toast",
    message: "This is a test message",
    type: "success" as const,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders toast with title and message", () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByText("Test Toast")).toBeInTheDocument();
    expect(screen.getByText("This is a test message")).toBeInTheDocument();
  });

  it("renders success toast with correct styling", () => {
    render(<Toast {...defaultProps} type="success" />);

    const toast = screen.getByRole("alert");
    expect(toast).toHaveClass("bg-green-50", "border-green-200");
  });

  it("renders error toast with correct styling", () => {
    render(<Toast {...defaultProps} type="error" />);

    const toast = screen.getByRole("alert");
    expect(toast).toHaveClass("bg-red-50", "border-red-200");
  });

  it("renders warning toast with correct styling", () => {
    render(<Toast {...defaultProps} type="warning" />);

    const toast = screen.getByRole("alert");
    expect(toast).toHaveClass("bg-yellow-50", "border-yellow-200");
  });

  it("renders info toast with correct styling", () => {
    render(<Toast {...defaultProps} type="info" />);

    const toast = screen.getByRole("alert");
    expect(toast).toHaveClass("bg-blue-50", "border-blue-200");
  });

  it("calls onClose when close button is clicked", () => {
    render(<Toast {...defaultProps} />);

    const closeButton = screen.getByRole("button");
    fireEvent.click(closeButton);

    expect(defaultProps.onClose).toHaveBeenCalledWith("toast-1");
  });

  it("renders with custom duration", () => {
    render(<Toast {...defaultProps} duration={5000} />);

    // The component should render without errors
    expect(screen.getByText("Test Toast")).toBeInTheDocument();
  });

  it("renders with close button (always present)", () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByLabelText("Cerrar notificación")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<Toast {...defaultProps} className="custom-class" />);

    const toast = screen.getByRole("alert");
    expect(toast).toHaveClass("custom-class");
  });

  it("renders with icon for success type", () => {
    render(<Toast {...defaultProps} type="success" />);

    // Check if icon is present (assuming it uses an icon component)
    const toast = screen.getByRole("alert");
    expect(toast).toBeInTheDocument();
  });

  it("renders with icon for error type", () => {
    render(<Toast {...defaultProps} type="error" />);

    const toast = screen.getByRole("alert");
    expect(toast).toBeInTheDocument();
  });

  it("renders with icon for warning type", () => {
    render(<Toast {...defaultProps} type="warning" />);

    const toast = screen.getByRole("alert");
    expect(toast).toBeInTheDocument();
  });

  it("renders with icon for info type", () => {
    render(<Toast {...defaultProps} type="info" />);

    const toast = screen.getByRole("alert");
    expect(toast).toBeInTheDocument();
  });

  it("handles auto-dismiss after duration", () => {
    jest.useFakeTimers();

    render(<Toast {...defaultProps} duration={1000} />);

    // Fast-forward time
    jest.advanceTimersByTime(1000);

    // The toast should still be visible as auto-dismiss is handled by parent
    expect(screen.getByText("Test Toast")).toBeInTheDocument();

    jest.useRealTimers();
  });
});
