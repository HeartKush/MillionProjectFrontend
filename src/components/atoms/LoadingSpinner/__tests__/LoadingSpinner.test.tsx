import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("renders loading spinner", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("has correct role and aria-label", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
  });

  it("has screen reader text", () => {
    render(<LoadingSpinner />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByText("Loading...")).toHaveClass("sr-only");
  });

  it("applies medium size by default", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-8", "h-8");
  });

  it("applies small size", () => {
    render(<LoadingSpinner size="sm" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-4", "h-4");
  });

  it("applies large size", () => {
    render(<LoadingSpinner size="lg" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-12", "h-12");
  });

  it("applies custom className", () => {
    render(<LoadingSpinner className="custom-class" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("custom-class");
  });

  it("applies default classes", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass(
      "animate-spin",
      "rounded-full",
      "border-2",
      "border-gray-300",
      "border-t-blue-600"
    );
  });

  it("renders with all size variants", () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);

    let spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-4", "h-4");

    rerender(<LoadingSpinner size="md" />);

    spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-8", "h-8");

    rerender(<LoadingSpinner size="lg" />);

    spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-12", "h-12");
  });

  it("combines custom className with size classes", () => {
    render(<LoadingSpinner size="lg" className="custom-class" />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("w-12", "h-12", "custom-class");
  });

  it("has correct accessibility attributes", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");

    const screenReaderText = screen.getByText("Loading...");
    expect(screenReaderText).toHaveClass("sr-only");
  });
});
