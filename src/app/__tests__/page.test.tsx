import React from "react";
import { render, screen } from "@testing-library/react";
import HomePage from "../page";

// Mock Next.js redirect
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

describe("HomePage", () => {
  it("redirects to /propiedades", () => {
    const { redirect } = require("next/navigation");

    render(<HomePage />);

    expect(redirect).toHaveBeenCalledWith("/propiedades");
  });

  it("calls redirect at least once", () => {
    const { redirect } = require("next/navigation");

    render(<HomePage />);

    expect(redirect).toHaveBeenCalled();
  });

  it("calls redirect with correct path", () => {
    const { redirect } = require("next/navigation");

    render(<HomePage />);

    expect(redirect).toHaveBeenCalledWith("/propiedades");
  });
});
