import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../Input";

describe("Input Component", () => {
  it("renders with default props", () => {
    render(<Input placeholder="Enter text" />);

    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
  });

  it("renders with different types", () => {
    const { rerender } = render(<Input type="email" placeholder="Email" />);
    expect(screen.getByPlaceholderText("Email")).toHaveAttribute(
      "type",
      "email"
    );

    rerender(<Input type="password" placeholder="Password" />);
    expect(screen.getByPlaceholderText("Password")).toHaveAttribute(
      "type",
      "password"
    );

    rerender(<Input type="number" placeholder="Number" />);
    expect(screen.getByPlaceholderText("Number")).toHaveAttribute(
      "type",
      "number"
    );
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    fireEvent.change(input, { target: { value: "test value" } });

    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "test value" }),
      })
    );
  });

  it("displays error message", () => {
    render(<Input error="This field is required" placeholder="Test input" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test input")).toHaveClass(
      "border-red-500"
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:bg-gray-100");
  });

  it("is required when required prop is true", () => {
    render(<Input required placeholder="Required input" />);

    expect(screen.getByPlaceholderText("Required input")).toBeRequired();
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" placeholder="Custom input" />);

    expect(screen.getByPlaceholderText("Custom input")).toHaveClass(
      "custom-class"
    );
  });

  it("displays current value", () => {
    render(<Input value="Current value" placeholder="Test input" />);

    expect(screen.getByDisplayValue("Current value")).toBeInTheDocument();
  });
});
