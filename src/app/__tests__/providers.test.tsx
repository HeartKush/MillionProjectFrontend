import React from "react";
import { render, screen } from "@testing-library/react";
import { Providers } from "../providers";

// Mock the QueryClient and QueryClientProvider
jest.mock("@tanstack/react-query", () => ({
  QueryClient: jest.fn().mockImplementation(() => ({
    setQueryData: jest.fn(),
    getQueryData: jest.fn(),
    invalidateQueries: jest.fn(),
  })),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="query-client-provider">{children}</div>
  ),
}));

// Mock the ReactQueryDevtools
jest.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => (
    <div data-testid="react-query-devtools">DevTools</div>
  ),
}));

describe("Providers", () => {
  it("renders children inside QueryClientProvider", () => {
    render(
      <Providers>
        <div data-testid="test-child">Test Content</div>
      </Providers>
    );

    expect(screen.getByTestId("query-client-provider")).toBeInTheDocument();
    expect(screen.getByTestId("test-child")).toBeInTheDocument();
  });

  it("renders ReactQueryDevtools", () => {
    render(
      <Providers>
        <div>Test Content</div>
      </Providers>
    );

    expect(screen.getByTestId("react-query-devtools")).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    render(
      <Providers>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </Providers>
    );

    expect(screen.getByTestId("child-1")).toBeInTheDocument();
    expect(screen.getByTestId("child-2")).toBeInTheDocument();
    expect(screen.getByTestId("child-3")).toBeInTheDocument();
  });

  it("renders without children", () => {
    render(<Providers>{null}</Providers>);

    expect(screen.getByTestId("query-client-provider")).toBeInTheDocument();
    expect(screen.getByTestId("react-query-devtools")).toBeInTheDocument();
  });

  it("renders with complex children structure", () => {
    render(
      <Providers>
        <header>Header</header>
        <main>
          <section>Section 1</section>
          <section>Section 2</section>
        </main>
        <footer>Footer</footer>
      </Providers>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Section 1")).toBeInTheDocument();
    expect(screen.getByText("Section 2")).toBeInTheDocument();
    expect(screen.getByText("Footer")).toBeInTheDocument();
  });

  it("renders with QueryClientProvider", () => {
    render(
      <Providers>
        <div>Test Content</div>
      </Providers>
    );

    expect(screen.getByTestId("query-client-provider")).toBeInTheDocument();
  });
});
