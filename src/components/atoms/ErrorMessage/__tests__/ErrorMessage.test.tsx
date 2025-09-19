import React from "react";
import { render, screen } from "@testing-library/react";
import { ErrorMessage } from "../ErrorMessage";

describe("ErrorMessage Component", () => {
  it("renders error message", () => {
    render(<ErrorMessage message="Test error message" />);

    expect(screen.getByText("Test error message")).toBeInTheDocument();
  });

  it("has correct role attribute", () => {
    render(<ErrorMessage message="Test error message" />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
  });

  it("applies error variant by default", () => {
    render(<ErrorMessage message="Test error message" />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass(
      "text-red-600",
      "bg-red-50",
      "border-red-200"
    );
  });

  it("applies warning variant", () => {
    render(<ErrorMessage message="Test warning message" variant="warning" />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass(
      "text-yellow-600",
      "bg-yellow-50",
      "border-yellow-200"
    );
  });

  it("applies info variant", () => {
    render(<ErrorMessage message="Test info message" variant="info" />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass(
      "text-blue-600",
      "bg-blue-50",
      "border-blue-200"
    );
  });

  it("applies custom className", () => {
    render(
      <ErrorMessage message="Test error message" className="custom-class" />
    );

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass("custom-class");
  });

  it("applies default classes", () => {
    render(<ErrorMessage message="Test error message" />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass("p-4", "rounded-md", "border");
  });

  it("renders with different message types", () => {
    const { rerender } = render(<ErrorMessage message="Short message" />);

    expect(screen.getByText("Short message")).toBeInTheDocument();

    rerender(
      <ErrorMessage message="This is a very long error message that should still be displayed correctly" />
    );

    expect(
      screen.getByText(
        "This is a very long error message that should still be displayed correctly"
      )
    ).toBeInTheDocument();
  });

  it("renders with all variants", () => {
    const { rerender } = render(
      <ErrorMessage message="Error message" variant="error" />
    );

    let errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass("text-red-600");

    rerender(<ErrorMessage message="Warning message" variant="warning" />);

    errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass("text-yellow-600");

    rerender(<ErrorMessage message="Info message" variant="info" />);

    errorElement = screen.getByRole("alert");
    expect(errorElement).toHaveClass("text-blue-600");
  });

  it("has correct text styling", () => {
    render(<ErrorMessage message="Test error message" />);

    const textElement = screen.getByText("Test error message");
    expect(textElement).toHaveClass("text-sm", "font-medium");
  });

  it("renders empty message", () => {
    render(<ErrorMessage message="" />);

    const errorElement = screen.getByRole("alert");
    expect(errorElement).toBeInTheDocument();
    // Check that the paragraph element exists but is empty
    const paragraphElement = errorElement.querySelector("p");
    expect(paragraphElement).toBeInTheDocument();
    expect(paragraphElement).toHaveTextContent("");
  });
});
