import React from "react";
import { render, screen } from "@testing-library/react";
import { ToastContainer } from "../ToastContainer";

// Mock the Toast component
jest.mock("../../Toast", () => ({
  Toast: ({ id, title, message, type, onClose }: any) => (
    <div data-testid={`toast-${id}`} role="alert">
      <h3>{title}</h3>
      <p>{message}</p>
      <button onClick={() => onClose(id)}>Close</button>
    </div>
  ),
}));

describe("ToastContainer", () => {
  const mockToasts = [
    {
      id: "toast-1",
      title: "Success",
      message: "Operation completed successfully",
      type: "success" as const,
      onClose: jest.fn(),
    },
    {
      id: "toast-2",
      title: "Error",
      message: "Something went wrong",
      type: "error" as const,
      onClose: jest.fn(),
    },
  ];

  const defaultProps = {
    toasts: mockToasts,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all toasts", () => {
    render(<ToastContainer {...defaultProps} />);

    expect(screen.getByTestId("toast-toast-1")).toBeInTheDocument();
    expect(screen.getByTestId("toast-toast-2")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders empty container when no toasts", () => {
    render(<ToastContainer toasts={[]} onClose={jest.fn()} />);

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("renders toasts in correct order", () => {
    render(<ToastContainer {...defaultProps} />);

    const container = screen.getByLabelText("Notificaciones");
    const toasts = container.querySelectorAll('[data-testid^="toast-"]');

    expect(toasts[0]).toHaveAttribute("data-testid", "toast-toast-1");
    expect(toasts[1]).toHaveAttribute("data-testid", "toast-toast-2");
  });

  it("applies correct positioning classes", () => {
    render(<ToastContainer {...defaultProps} />);

    const container = screen.getByLabelText("Notificaciones");
    expect(container).toHaveClass("fixed", "top-4", "right-4", "z-50");
  });

  it("renders with custom className", () => {
    render(<ToastContainer {...defaultProps} className="custom-class" />);

    const container = screen.getByLabelText("Notificaciones");
    expect(container).toHaveClass("custom-class");
  });

  it("passes onClose to Toast components", () => {
    const mockOnClose = jest.fn();
    render(<ToastContainer toasts={mockToasts} onClose={mockOnClose} />);

    const closeButtons = screen.getAllByText("Close");
    closeButtons[0].click();

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("handles single toast", () => {
    const singleToast = [mockToasts[0]];
    render(<ToastContainer toasts={singleToast} onClose={jest.fn()} />);

    expect(screen.getByTestId("toast-toast-1")).toBeInTheDocument();
    expect(screen.queryByTestId("toast-toast-2")).not.toBeInTheDocument();
  });

  it("renders with different toast types", () => {
    const mixedToasts = [
      {
        id: "toast-1",
        title: "Info",
        message: "Info message",
        type: "info" as const,
        onClose: jest.fn(),
      },
      {
        id: "toast-2",
        title: "Warning",
        message: "Warning message",
        type: "warning" as const,
        onClose: jest.fn(),
      },
    ];

    render(<ToastContainer toasts={mixedToasts} onClose={jest.fn()} />);

    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Warning")).toBeInTheDocument();
  });

  it("maintains proper spacing between toasts", () => {
    render(<ToastContainer {...defaultProps} />);

    const container = screen.getByLabelText("Notificaciones");
    expect(container).toHaveClass("space-y-2");
  });

  it("renders with proper accessibility attributes", () => {
    render(<ToastContainer {...defaultProps} />);

    const container = screen.getByLabelText("Notificaciones");
    expect(container).toHaveAttribute("aria-live", "polite");
  });
});
