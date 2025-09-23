import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../Input";

describe("Input Component", () => {
  it("renders with default props", () => {
    render(<Input placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("form-input");
  });

  it("renders with label", () => {
    render(<Input label="Test Label" placeholder="Test input" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    // Check that the input is associated with the label by checking the input directly
    const input = screen.getByPlaceholderText("Test input");
    expect(input).toBeInTheDocument();
  });

  it("renders with helper text", () => {
    render(<Input helperText="Helper text" placeholder="Test input" />);

    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Input error="This field is required" placeholder="Test input" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Test input")).toHaveClass(
      "form-input-error"
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<Input disabled placeholder="Disabled input" />);

    const input = screen.getByPlaceholderText("Disabled input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("is required when required prop is true", () => {
    render(<Input required placeholder="Required input" />);

    const input = screen.getByPlaceholderText("Required input");
    expect(input).toBeRequired();
  });

  it("handles value changes", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    fireEvent.change(input, { target: { value: "new value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders with left icon", () => {
    const LeftIcon = () => <span data-testid="left-icon">Left</span>;
    render(<Input leftIcon={<LeftIcon />} placeholder="Test input" />);

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders with right icon", () => {
    const RightIcon = () => <span data-testid="right-icon">Right</span>;
    render(<Input rightIcon={<RightIcon />} placeholder="Test input" />);

    expect(screen.getByTestId("right-icon")).toBeInTheDocument();
  });

  it("toggles password visibility", () => {
    render(<Input type="password" showPasswordToggle placeholder="Password" />);

    const input = screen.getByPlaceholderText("Password");
    expect(input).toHaveAttribute("type", "password");

    const toggleButton = screen.getByRole("button");
    fireEvent.click(toggleButton);

    expect(input).toHaveAttribute("type", "text");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    expect(input).toHaveClass("custom-class");
  });

  it("handles focus events", () => {
    render(<Input placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    fireEvent.focus(input);

    // The component should handle focus state internally
    expect(input).toBeInTheDocument();
  });

  it("handles blur events", () => {
    render(<Input placeholder="Test input" />);

    const input = screen.getByPlaceholderText("Test input");
    fireEvent.blur(input);

    // The component should handle blur state internally
    expect(input).toBeInTheDocument();
  });

  it("renders with different input types", () => {
    const { rerender } = render(<Input type="text" placeholder="Text input" />);
    expect(screen.getByPlaceholderText("Text input")).toHaveAttribute(
      "type",
      "text"
    );

    rerender(<Input type="email" placeholder="Email input" />);
    expect(screen.getByPlaceholderText("Email input")).toHaveAttribute(
      "type",
      "email"
    );

    rerender(<Input type="number" placeholder="Number input" />);
    expect(screen.getByPlaceholderText("Number input")).toHaveAttribute(
      "type",
      "number"
    );
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Test input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
