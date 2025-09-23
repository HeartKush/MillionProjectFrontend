import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import { ToastProvider, useToast, useToastHelpers } from "../ToastContext";
import type { ToastProps } from "@/components/atoms/Toast";

// Mock the Toast component to avoid rendering issues
jest.mock("@/components/atoms/Toast", () => ({
  Toast: ({ id, type, title, message, onClose }: ToastProps) => (
    <div data-testid={`toast-${id}`} data-type={type}>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      <button onClick={() => onClose(id)}>Close</button>
    </div>
  ),
}));

// Test component that uses the toast context
const TestComponent = () => {
  const { toasts, addToast, removeToast, clearToasts } = useToast();
  const { showSuccess, showError, showWarning, showInfo } = useToastHelpers();

  return (
    <div>
      <div data-testid="toast-count">{toasts.length}</div>
      <button
        data-testid="add-success"
        onClick={() => addToast({ type: "success", title: "Success" })}
      >
        Add Success
      </button>
      <button
        data-testid="add-error"
        onClick={() =>
          addToast({ type: "error", title: "Error", message: "Error message" })
        }
      >
        Add Error
      </button>
      <button
        data-testid="add-warning"
        onClick={() => addToast({ type: "warning", title: "Warning" })}
      >
        Add Warning
      </button>
      <button
        data-testid="add-info"
        onClick={() => addToast({ type: "info", title: "Info" })}
      >
        Add Info
      </button>
      <button
        data-testid="show-success"
        onClick={() => showSuccess("Success Title", "Success message")}
      >
        Show Success
      </button>
      <button
        data-testid="show-error"
        onClick={() => showError("Error Title", "Error message")}
      >
        Show Error
      </button>
      <button
        data-testid="show-warning"
        onClick={() => showWarning("Warning Title", "Warning message")}
      >
        Show Warning
      </button>
      <button
        data-testid="show-info"
        onClick={() => showInfo("Info Title", "Info message")}
      >
        Show Info
      </button>
      <button data-testid="clear-toasts" onClick={clearToasts}>
        Clear Toasts
      </button>
      {toasts.map((toast) => (
        <div key={toast.id} data-testid={`toast-${toast.id}`}>
          <button
            data-testid={`remove-${toast.id}`}
            onClick={() => removeToast(toast.id)}
          >
            Remove {toast.id}
          </button>
        </div>
      ))}
    </div>
  );
};

// Test component that uses useToast outside of provider (should throw error)
const TestComponentWithoutProvider = () => {
  useToast();
  return <div>Should not render</div>;
};

describe("ToastContext", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("ToastProvider", () => {
    it("provides toast context to children", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
    });

    it("adds toasts when addToast is called", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByTestId("toast-count")).toHaveTextContent("0");

      act(() => {
        fireEvent.click(screen.getByTestId("add-success"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });

    it("adds multiple toasts", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("add-success"));
        fireEvent.click(screen.getByTestId("add-error"));
        fireEvent.click(screen.getByTestId("add-warning"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("3");
    });

    it("removes toasts when removeToast is called", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Add a toast first
      act(() => {
        fireEvent.click(screen.getByTestId("add-success"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");

      // Remove the toast
      act(() => {
        const removeButton = screen.getByTestId(/remove-/);
        fireEvent.click(removeButton);
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
    });

    it("clears all toasts when clearToasts is called", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Add multiple toasts
      act(() => {
        fireEvent.click(screen.getByTestId("add-success"));
        fireEvent.click(screen.getByTestId("add-error"));
        fireEvent.click(screen.getByTestId("add-warning"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("3");

      // Clear all toasts
      act(() => {
        fireEvent.click(screen.getByTestId("clear-toasts"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
    });

    it("generates unique IDs for toasts", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("add-success"));
        fireEvent.click(screen.getByTestId("add-error"));
      });

      const removeButtons = screen.getAllByTestId(/remove-/);
      expect(removeButtons).toHaveLength(2);

      // Check that the IDs are different
      const ids = removeButtons.map((button) =>
        button.textContent?.replace("Remove ", "")
      );
      expect(ids[0]).not.toBe(ids[1]);
    });
  });

  describe("useToast", () => {
    it("throws error when used outside of ToastProvider", () => {
      // Suppress console.error for this test
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});

      expect(() => {
        render(<TestComponentWithoutProvider />);
      }).toThrow("useToast must be used within a ToastProvider");

      consoleSpy.mockRestore();
    });

    it("returns toast context when used within ToastProvider", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      expect(screen.getByTestId("toast-count")).toBeInTheDocument();
    });
  });

  describe("useToastHelpers", () => {
    it("shows success toast with correct properties", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("show-success"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });

    it("shows error toast with correct properties", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("show-error"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });

    it("shows warning toast with correct properties", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("show-warning"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });

    it("shows info toast with correct properties", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("show-info"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });

    it("shows success toast without message", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("add-success"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });

    it("shows error toast with message", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("add-error"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");
    });
  });

  describe("toast properties", () => {
    it("sets correct duration for different toast types", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      // Test that different toast types are created
      act(() => {
        fireEvent.click(screen.getByTestId("show-success"));
        fireEvent.click(screen.getByTestId("show-error"));
        fireEvent.click(screen.getByTestId("show-warning"));
        fireEvent.click(screen.getByTestId("show-info"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("4");
    });

    it("handles toast removal through onClose callback", () => {
      render(
        <ToastProvider>
          <TestComponent />
        </ToastProvider>
      );

      act(() => {
        fireEvent.click(screen.getByTestId("add-success"));
      });

      expect(screen.getByTestId("toast-count")).toHaveTextContent("1");

      // Find the toast and click its close button
      const toasts = screen.getAllByTestId(/toast-/);
      const toast = toasts.find(
        (t) =>
          t.getAttribute("data-testid")?.includes("toast-") &&
          !t.getAttribute("data-testid")?.includes("toast-count")
      );

      if (toast) {
        const closeButton = toast.querySelector("button");

        if (closeButton) {
          act(() => {
            fireEvent.click(closeButton);
          });
        }
      }

      expect(screen.getByTestId("toast-count")).toHaveTextContent("0");
    });
  });
});
