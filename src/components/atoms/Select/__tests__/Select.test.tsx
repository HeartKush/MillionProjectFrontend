import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "../Select";

describe("Select", () => {
  const mockOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders select with options", () => {
    render(
      <Select>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("renders with placeholder", () => {
    render(
      <Select placeholder="Choose an option">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByText("Choose an option")).toBeInTheDocument();
  });

  it("handles value change", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(
      <Select onChange={onChange}>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "option2");

    expect(onChange).toHaveBeenCalled();
  });

  it("renders with default value", () => {
    render(
      <Select defaultValue="option2">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveValue("option2");
  });

  it("renders as disabled", () => {
    render(
      <Select disabled>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("applies custom className", () => {
    render(
      <Select className="custom-class">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByRole("combobox")).toHaveClass("custom-class");
  });

  it("renders with label", () => {
    render(
      <Select label="Select Option">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByText("Select Option")).toBeInTheDocument();
  });

  it("renders with error state", () => {
    render(
      <Select error="This field is required">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveClass("form-input-error");
  });

  it("renders with required indicator", () => {
    render(
      <Select label="Select Option" required>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("forwards ref correctly", () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select ref={ref}>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(ref.current).toBeInstanceOf(HTMLSelectElement);
  });

  it("handles focus and blur events", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    const select = screen.getByRole("combobox");

    // Focus the select
    await user.click(select);
    expect(select).toHaveFocus();

    // Blur the select
    await user.tab();
    expect(select).not.toHaveFocus();
  });

  it("renders with left icon", () => {
    const LeftIcon = () => <span data-testid="left-icon">🔍</span>;

    render(
      <Select leftIcon={<LeftIcon />}>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByTestId("left-icon")).toBeInTheDocument();
  });

  it("renders with helper text", () => {
    render(
      <Select helperText="Please select an option">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByText("Please select an option")).toBeInTheDocument();
  });

  it("renders with both error and helper text (error takes precedence)", () => {
    render(
      <Select
        error="This field is required"
        helperText="Please select an option"
      >
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(
      screen.queryByText("Please select an option")
    ).not.toBeInTheDocument();
  });

  it("applies focus styles when focused", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    const select = screen.getByRole("combobox");
    await user.click(select);

    expect(select).toHaveClass("ring-2", "ring-blue-500/20", "border-blue-500");
  });

  it("applies disabled styles when disabled", () => {
    render(
      <Select disabled>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("opacity-50", "cursor-not-allowed");
  });

  it("applies error styles when error is present", () => {
    render(
      <Select error="This field is required">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("form-input-error");
  });

  it("applies left icon padding when leftIcon is present", () => {
    const LeftIcon = () => <span data-testid="left-icon">🔍</span>;

    render(
      <Select leftIcon={<LeftIcon />}>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("pl-10");
  });

  it("renders error icon when error is present", () => {
    render(
      <Select error="This field is required">
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    // Check for error icon in the right side
    const errorIcons = screen.getAllByTestId("alert-circle");
    expect(errorIcons).toHaveLength(2); // One in the select, one in the error message
  });

  it("renders chevron down icon", () => {
    render(
      <Select>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    // Check for chevron down icon
    const chevronIcon = screen.getByTestId("chevron-down");
    expect(chevronIcon).toBeInTheDocument();
  });

  it("renders without label when label is not provided", () => {
    render(
      <Select>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.queryByText("Select Option")).not.toBeInTheDocument();
  });

  it("renders without helper text when not provided", () => {
    render(
      <Select>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(
      screen.queryByText("Please select an option")
    ).not.toBeInTheDocument();
  });

  it("renders without left icon when not provided", () => {
    render(
      <Select>
        {mockOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    );

    expect(screen.queryByTestId("left-icon")).not.toBeInTheDocument();
  });
});
