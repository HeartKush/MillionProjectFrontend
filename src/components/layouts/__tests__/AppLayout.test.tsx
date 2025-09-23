import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppLayout } from "../AppLayout";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock the Toast components
jest.mock("@/components/atoms", () => ({
  ToastContainer: ({ toasts, onClose }: any) => (
    <div data-testid="toast-container">
      {toasts.map((toast: any) => (
        <div key={toast.id} data-testid={`toast-${toast.id}`}>
          {toast.title}
          <button onClick={() => onClose(toast.id)}>Close</button>
        </div>
      ))}
    </div>
  ),
}));

// Mock the ToastContext
jest.mock("@/contexts/ToastContext", () => ({
  useToast: jest.fn(),
}));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  Home: jest.fn(() => <svg data-testid="home-icon" />),
  Users: jest.fn(() => <svg data-testid="users-icon" />),
  Menu: jest.fn(() => <svg data-testid="menu-icon" />),
  X: jest.fn(() => <svg data-testid="x-icon" />),
}));

describe("AppLayout", () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
    refresh: jest.fn(),
  };

  const mockToasts = [
    { id: "toast-1", title: "Success", type: "success" },
    { id: "toast-2", title: "Error", type: "error" },
  ];

  const mockUseToast = {
    toasts: mockToasts,
    removeToast: jest.fn(),
    showSuccess: jest.fn(),
    showError: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (require("next/navigation").useRouter as jest.Mock).mockReturnValue(
      mockRouter
    );
    (require("next/navigation").usePathname as jest.Mock).mockReturnValue("/");
    (require("@/contexts/ToastContext").useToast as jest.Mock).mockReturnValue(
      mockUseToast
    );
  });

  it("renders layout with children", () => {
    render(
      <AppLayout>
        <div data-testid="test-content">Test Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("renders header with logo and title", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    expect(screen.getByText("RealEstate Pro")).toBeInTheDocument();
    expect(screen.getByText("Gestión Inmobiliaria")).toBeInTheDocument();
    // Check that home icon exists (there are multiple, so use getAllByTestId)
    const homeIcons = screen.getAllByTestId("home-icon");
    expect(homeIcons.length).toBeGreaterThan(0);
  });

  it("renders desktop navigation tabs", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    expect(screen.getByText("Propiedades")).toBeInTheDocument();
    expect(screen.getByText("Propietarios")).toBeInTheDocument();
    // Check that icons exist (there are multiple, so use getAllByTestId)
    const homeIcons = screen.getAllByTestId("home-icon");
    const usersIcons = screen.getAllByTestId("users-icon");
    expect(homeIcons.length).toBeGreaterThan(0);
    expect(usersIcons.length).toBeGreaterThan(0);
  });

  it("renders mobile menu button", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  it("toggles mobile menu when button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    const menuButton = screen.getByTestId("menu-icon").closest("button");
    await user.click(menuButton!);

    expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    expect(
      screen.getByText("Gestiona tu inventario inmobiliario")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Administra la información de propietarios")
    ).toBeInTheDocument();
  });

  it("closes mobile menu when X button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    // Open mobile menu
    const menuButton = screen.getByTestId("menu-icon").closest("button");
    await user.click(menuButton!);

    // Close mobile menu
    const closeButton = screen.getByTestId("x-icon").closest("button");
    await user.click(closeButton!);

    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
    expect(
      screen.queryByText("Gestiona tu inventario inmobiliario")
    ).not.toBeInTheDocument();
  });

  it("navigates to properties when Properties tab is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    const propertiesTab = screen.getByText("Propiedades");
    await user.click(propertiesTab);

    expect(mockRouter.push).toHaveBeenCalledWith("/");
  });

  it("navigates to owners when Owners tab is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    const ownersTab = screen.getByText("Propietarios");
    await user.click(ownersTab);

    expect(mockRouter.push).toHaveBeenCalledWith("/propietarios");
  });

  it("closes mobile menu when tab is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    // Open mobile menu
    const menuButton = screen.getByTestId("menu-icon").closest("button");
    await user.click(menuButton!);

    // Click on Properties tab in mobile menu (find the one in mobile menu specifically)
    const mobilePropertiesTabs = screen.getAllByText("Propiedades");
    const mobilePropertiesTab = mobilePropertiesTabs.find((tab) =>
      tab.closest("nav")?.classList.contains("space-y-2")
    );
    await user.click(mobilePropertiesTab!);

    expect(mockRouter.push).toHaveBeenCalledWith("/");
    expect(screen.getByTestId("menu-icon")).toBeInTheDocument();
  });

  it("renders ToastContainer with toasts", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
    expect(screen.getByTestId("toast-toast-1")).toBeInTheDocument();
    expect(screen.getByTestId("toast-toast-2")).toBeInTheDocument();
    expect(screen.getByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("calls removeToast when toast close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    const closeButtons = screen.getAllByText("Close");
    await user.click(closeButtons[0]);

    expect(mockUseToast.removeToast).toHaveBeenCalledWith("toast-1");
  });

  it("shows active state for current path", () => {
    (require("next/navigation").usePathname as jest.Mock).mockReturnValue(
      "/propietarios"
    );

    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    // Open mobile menu to see active state
    const menuButton = screen.getByTestId("menu-icon").closest("button");
    fireEvent.click(menuButton!);

    // Find the owners tab in mobile menu specifically
    const ownersTabs = screen.getAllByText("Propietarios");
    const mobileOwnersTab = ownersTabs
      .find((tab) => tab.closest("nav")?.classList.contains("space-y-2"))
      ?.closest("button");
    expect(mobileOwnersTab).toHaveClass(
      "bg-gradient-to-r",
      "from-blue-600",
      "to-purple-600"
    );
  });

  it("renders floating action button on mobile", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    // Find the FAB button specifically by its classes
    const fab = document.querySelector(".fab.lg\\:hidden.no-print");
    expect(fab).toBeInTheDocument();
    expect(fab).toHaveClass("fab", "lg:hidden", "no-print");
  });

  it("applies correct CSS classes to main layout", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    const mainElement = screen.getByText("Test Content").closest("main");
    expect(mainElement).toHaveClass(
      "relative",
      "z-10",
      "container",
      "mx-auto",
      "px-4",
      "py-8"
    );
  });

  it("renders background decorative elements", () => {
    render(
      <AppLayout>
        <div>Test Content</div>
      </AppLayout>
    );

    const backgroundElements = document.querySelectorAll(
      ".absolute.inset-0.overflow-hidden.pointer-events-none > div"
    );
    expect(backgroundElements).toHaveLength(3);
  });
});
