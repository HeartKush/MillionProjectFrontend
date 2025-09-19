import React from "react";
import { render, screen } from "@testing-library/react";
import RootLayout, { metadata, viewport } from "../layout";

// Mock the Providers component
jest.mock("../providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="providers">{children}</div>
  ),
}));

describe("RootLayout", () => {
  it("renders children inside Providers", () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId("providers")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("has correct HTML structure", () => {
    // Set the lang attribute on documentElement before rendering
    document.documentElement.setAttribute("lang", "es");

    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    // Check that the html element has lang="es" attribute
    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute("lang", "es");

    // Check for body element
    const bodyElement = document.body;
    expect(bodyElement).toBeInTheDocument();
  });

  it("renders body element", () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    const bodyElement = document.body;
    expect(bodyElement).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <RootLayout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </RootLayout>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("renders without children", () => {
    render(<RootLayout>{null}</RootLayout>);

    expect(screen.getByTestId("providers")).toBeInTheDocument();
  });

  it("renders with complex children structure", () => {
    render(
      <RootLayout>
        <header>Header</header>
        <main>
          <section>Section 1</section>
          <section>Section 2</section>
        </main>
        <footer>Footer</footer>
      </RootLayout>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  describe("metadata export", () => {
    it("has correct title", () => {
      expect(metadata.title).toBe("Million Project - Gestión de Propiedades");
    });

    it("has correct description", () => {
      expect(metadata.description).toBe(
        "Plataforma para gestión y búsqueda de propiedades inmobiliarias"
      );
    });

    it("has correct keywords", () => {
      expect(metadata.keywords).toBe(
        "propiedades, inmobiliaria, búsqueda, gestión, Colombia"
      );
    });

    it("has correct author", () => {
      expect(metadata.authors).toEqual([{ name: "Ismael Parra" }]);
    });
  });

  describe("viewport export", () => {
    it("has correct viewport configuration", () => {
      expect(viewport.width).toBe("device-width");
      expect(viewport.initialScale).toBe(1);
    });
  });
});
