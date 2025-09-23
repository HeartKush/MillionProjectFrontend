import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { PropertyTraceModal } from "../PropertyTraceModal";
import type {
  CreatePropertyTraceRequest,
  PropertyTraceListItem,
} from "@/lib/types";

// Mock the Modal component
jest.mock("@/components/atoms", () => ({
  Modal: ({ children, isOpen, onClose, title, size }: any) =>
    isOpen ? (
      <div data-testid="modal" data-title={title} data-size={size}>
        <button onClick={onClose}>Close</button>
        {children}
      </div>
    ) : null,
}));

// Mock the PropertyTraceForm component
jest.mock("@/components/molecules", () => ({
  PropertyTraceForm: ({
    onSubmit,
    onCancel,
    initialData,
    isLoading,
    propertyValue,
    propertyId,
  }: any) => (
    <div data-testid="property-trace-form">
      <div data-testid="property-id">{propertyId}</div>
      <div data-testid="property-value">
        {propertyValue?.toString() || "undefined"}
      </div>
      <div data-testid="is-loading">{isLoading.toString()}</div>
      <div data-testid="has-initial-data">{(!!initialData).toString()}</div>
      <button
        data-testid="submit-form"
        onClick={() => onSubmit({ dateSale: "2024-01-01", value: 1000000 })}
      >
        Submit
      </button>
      <button data-testid="cancel-form" onClick={onCancel}>
        Cancel
      </button>
    </div>
  ),
}));

describe("PropertyTraceModal", () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockPropertyId = "prop-123";
  const mockPropertyValue = 5000000;

  const mockInitialData: PropertyTraceListItem = {
    idPropertyTrace: "trace-1",
    idProperty: "prop-123",
    dateSale: "2024-01-01",
    name: "Test Buyer",
    value: 1000000,
    tax: 15000,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when open", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
      />
    );

    expect(screen.getByTestId("modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-title",
      "Nueva Transacción"
    );
    expect(screen.getByTestId("modal")).toHaveAttribute("data-size", "lg");
  });

  it("does not render modal when closed", () => {
    render(
      <PropertyTraceModal
        isOpen={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
      />
    );

    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  it("shows correct title for new transaction", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
      />
    );

    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-title",
      "Nueva Transacción"
    );
  });

  it("shows correct title for edit transaction", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
        initialData={mockInitialData}
      />
    );

    expect(screen.getByTestId("modal")).toHaveAttribute(
      "data-title",
      "Editar Transacción"
    );
  });

  it("passes correct props to PropertyTraceForm", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
        initialData={mockInitialData}
        isLoading={true}
      />
    );

    expect(screen.getByTestId("property-trace-form")).toBeInTheDocument();
    expect(screen.getByTestId("property-id")).toHaveTextContent(mockPropertyId);
    expect(screen.getByTestId("property-value")).toHaveTextContent(
      mockPropertyValue.toString()
    );
    expect(screen.getByTestId("is-loading")).toHaveTextContent("true");
    expect(screen.getByTestId("has-initial-data")).toHaveTextContent("true");
  });

  it("handles form submission with property ID", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
      />
    );

    const submitButton = screen.getByTestId("submit-form");
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      dateSale: "2024-01-01",
      value: 1000000,
      idProperty: mockPropertyId,
    });
  });

  it("handles form cancellation", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
      />
    );

    const cancelButton = screen.getByTestId("cancel-form");
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("handles modal close", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
      />
    );

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("works without property value", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
      />
    );

    expect(screen.getByTestId("property-trace-form")).toBeInTheDocument();
    expect(screen.getByTestId("property-id")).toHaveTextContent(mockPropertyId);
    expect(screen.getByTestId("property-value")).toHaveTextContent("undefined");
  });

  it("works without initial data", () => {
    render(
      <PropertyTraceModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        propertyId={mockPropertyId}
        propertyValue={mockPropertyValue}
      />
    );

    expect(screen.getByTestId("has-initial-data")).toHaveTextContent("false");
  });
});
