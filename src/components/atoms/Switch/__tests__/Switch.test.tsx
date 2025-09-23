import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Switch } from "../Switch";

describe("Switch Component", () => {
  it("renders with default props", () => {
    render(<Switch />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).not.toBeChecked();
  });

  it("renders as checked when checked prop is true", () => {
    render(<Switch checked={true} />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  it("renders as unchecked when checked prop is false", () => {
    render(<Switch checked={false} />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();
  });

  it("calls onChange when clicked", () => {
    const handleChange = jest.fn();
    render(<Switch onChange={handleChange} />);

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("is disabled when disabled prop is true", () => {
    render(<Switch disabled={true} />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeDisabled();
  });

  it("does not call onChange when disabled", () => {
    const handleChange = jest.fn();
    render(<Switch disabled={true} onChange={handleChange} />);

    const switchElement = screen.getByRole("switch");
    fireEvent.click(switchElement);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("renders with label", () => {
    render(<Switch label="Test Label" id="test-switch" />);

    expect(screen.getByText("Test Label")).toBeInTheDocument();
    // The label should be associated with the switch via htmlFor
    expect(screen.getByText("Test Label")).toHaveAttribute(
      "for",
      "test-switch"
    );
  });

  it("applies custom className", () => {
    render(<Switch className="custom-class" />);

    const container = screen.getByRole("switch").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("has correct accessibility attributes", () => {
    render(<Switch aria-label="Test Switch" />);

    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-label", "Test Switch");
  });

  it("handles controlled state changes", () => {
    const handleChange = jest.fn();
    const { rerender } = render(
      <Switch checked={false} onChange={handleChange} />
    );

    let switchElement = screen.getByRole("switch");
    expect(switchElement).not.toBeChecked();

    rerender(<Switch checked={true} onChange={handleChange} />);
    switchElement = screen.getByRole("switch");
    expect(switchElement).toBeChecked();
  });

  it("renders with different checked states", () => {
    const { rerender } = render(<Switch checked={false} />);
    expect(screen.getByRole("switch")).not.toBeChecked();

    rerender(<Switch checked={true} />);
    expect(screen.getByRole("switch")).toBeChecked();
  });
});
