import React from "react";
import { render, screen } from "@testing-library/react";
import { Card } from "../Card";

describe("Card Component", () => {
  it("renders children", () => {
    render(
      <Card>
        <div data-testid="card-content">Card Content</div>
      </Card>
    );

    expect(screen.getByTestId("card-content")).toBeInTheDocument();
  });

  it("renders with title", () => {
    render(
      <Card title="Test Title">
        <div>Card Content</div>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
  });

  it("renders with subtitle", () => {
    render(
      <Card subtitle="Test Subtitle">
        <div>Card Content</div>
      </Card>
    );

    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
  });

  it("renders with image", () => {
    render(
      <Card imageUrl="https://example.com/image.jpg" title="Test Title">
        <div>Card Content</div>
      </Card>
    );

    const image = screen.getByAltText("Test Title");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg");
  });

  it("renders with image and no title", () => {
    render(
      <Card imageUrl="https://example.com/image.jpg">
        <div>Card Content</div>
      </Card>
    );

    const image = screen.getByAltText("Card image");
    expect(image).toBeInTheDocument();
  });

  it("renders with actions", () => {
    render(
      <Card
        actions={
          <>
            <button>Action 1</button>
            <button>Action 2</button>
          </>
        }
      >
        <div>Card Content</div>
      </Card>
    );

    expect(screen.getByText("Action 1")).toBeInTheDocument();
    expect(screen.getByText("Action 2")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(
      <Card className="custom-class">
        <div>Card Content</div>
      </Card>
    );

    // Find the outermost card div (the one with custom className)
    const card = screen.getByText("Card Content").closest(".card-elevated");
    expect(card).toHaveClass("custom-class");
  });

  it("applies default classes", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );

    // Find the outermost card div (the one with default classes)
    const card = screen.getByText("Card Content").closest(".card-elevated");
    expect(card).toHaveClass("card-elevated", "overflow-hidden");
  });

  it("renders without optional props", () => {
    render(
      <Card>
        <div>Card Content</div>
      </Card>
    );

    expect(screen.getByText("Card Content")).toBeInTheDocument();
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders with all props", () => {
    render(
      <Card
        title="Test Title"
        subtitle="Test Subtitle"
        imageUrl="https://example.com/image.jpg"
        actions={<button>Test Action</button>}
        className="custom-class"
      >
        <div>Card Content</div>
      </Card>
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Subtitle")).toBeInTheDocument();
    expect(screen.getByAltText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Action")).toBeInTheDocument();
    expect(screen.getByText("Card Content")).toBeInTheDocument();
  });

  it("passes through additional props", () => {
    render(
      <Card data-testid="card-element" aria-label="Test Card">
        <div>Card Content</div>
      </Card>
    );

    const card = screen.getByTestId("card-element");
    expect(card).toHaveAttribute("aria-label", "Test Card");
  });
});
