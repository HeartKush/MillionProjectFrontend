import React from "react";
import { render, screen } from "@testing-library/react";
import { LoadingSpinner } from "../LoadingSpinner";

describe("LoadingSpinner Component", () => {
  it("renders with default props", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin", "text-blue-600", "w-8", "h-8");
  });

  it("applies custom className", () => {
    render(<LoadingSpinner className="custom-class" />);

    const container = screen.getByRole("status").parentElement;
    expect(container).toHaveClass("custom-class");
  });

  it("renders with different sizes", () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    expect(screen.getByRole("status")).toHaveClass("w-4", "h-4");

    rerender(<LoadingSpinner size="md" />);
    expect(screen.getByRole("status")).toHaveClass("w-8", "h-8");

    rerender(<LoadingSpinner size="lg" />);
    expect(screen.getByRole("status")).toHaveClass("w-12", "h-12");

    rerender(<LoadingSpinner size="xl" />);
    expect(screen.getByRole("status")).toHaveClass("w-16", "h-16");
  });

  it("renders with text", () => {
    render(<LoadingSpinner text="Loading..." />);

    // Use getAllByText since there are multiple "Loading..." elements
    const loadingTexts = screen.getAllByText("Loading...");
    expect(loadingTexts).toHaveLength(2); // One visible, one sr-only
    expect(loadingTexts[0]).toHaveClass("text-gray-600", "font-medium");
  });

  it("renders dots variant", () => {
    render(<LoadingSpinner variant="dots" />);

    // Dots variant doesn't have role="status", so check for dots directly
    const dots = screen.getAllByText("", { selector: "div" });
    const bounceDots = dots.filter((dot) =>
      dot.classList.contains("animate-bounce")
    );
    expect(bounceDots).toHaveLength(3); // Three dots
    expect(bounceDots[0]).toHaveClass(
      "bg-blue-600",
      "rounded-full",
      "animate-bounce"
    );
  });

  it("renders pulse variant", () => {
    render(<LoadingSpinner variant="pulse" />);

    // Pulse variant doesn't have role="status", so check for pulse element by class
    const pulse = document.querySelector(".animate-pulse");
    expect(pulse).toHaveClass(
      "bg-gradient-to-r",
      "from-blue-600",
      "to-purple-600",
      "rounded-full",
      "animate-pulse"
    );
  });

  it("renders default variant with Loader2 icon", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("lucide", "lucide-loader-circle");
  });

  it("has correct accessibility attributes", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveAttribute("aria-label", "Loading");
    expect(screen.getByText("Loading...")).toBeInTheDocument(); // sr-only text
  });

  it("combines custom className with size classes", () => {
    render(<LoadingSpinner size="lg" className="custom-class" />);

    const container = screen.getByRole("status").parentElement;
    expect(container).toHaveClass("custom-class");
    expect(screen.getByRole("status")).toHaveClass("w-12", "h-12");
  });

  it("renders dots variant with different sizes", () => {
    const { rerender } = render(<LoadingSpinner variant="dots" size="sm" />);
    const dots = screen.getAllByText("", { selector: "div" });
    const bounceDots = dots.filter((dot) =>
      dot.classList.contains("animate-bounce")
    );
    expect(bounceDots[0]).toHaveClass("w-2", "h-2");

    rerender(<LoadingSpinner variant="dots" size="lg" />);
    const newDots = screen.getAllByText("", { selector: "div" });
    const newBounceDots = newDots.filter((dot) =>
      dot.classList.contains("animate-bounce")
    );
    expect(newBounceDots[0]).toHaveClass("w-4", "h-4");
  });

  it("renders pulse variant with different sizes", () => {
    const { rerender } = render(<LoadingSpinner variant="pulse" size="sm" />);
    const pulse = document.querySelector(".animate-pulse");
    expect(pulse).toHaveClass("w-4", "h-4");

    rerender(<LoadingSpinner variant="pulse" size="lg" />);
    const newPulse = document.querySelector(".animate-pulse");
    expect(newPulse).toHaveClass("w-12", "h-12");
  });
});
