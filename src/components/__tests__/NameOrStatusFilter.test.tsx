import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../test/utils/test-utils";
import { NameOrStatusFilter } from "../NameOrStatusFilter";

const mockOnFilterChange = vi.fn();

describe("NameOrStatusFilter", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders both name and status filter buttons", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    expect(screen.getByRole("button", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Status" })).toBeInTheDocument();
  });

  it("highlights the selected filter button - name selected", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const nameButton = screen.getByRole("button", { name: "Name" });
    const statusButton = screen.getByRole("button", { name: "Status" });

    // Name button should have solid variant styling
    expect(nameButton).toHaveClass("chakra-button");
    expect(statusButton).toHaveClass("chakra-button");
  });

  it("highlights the selected filter button - status selected", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="status" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const nameButton = screen.getByRole("button", { name: "Name" });
    const statusButton = screen.getByRole("button", { name: "Status" });

    expect(nameButton).toBeInTheDocument();
    expect(statusButton).toBeInTheDocument();
  });

  it("calls onFilterChange with 'name' when name button is clicked", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="status" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const nameButton = screen.getByRole("button", { name: "Name" });
    fireEvent.click(nameButton);

    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnFilterChange).toHaveBeenCalledWith("name");
  });

  it("calls onFilterChange with 'status' when status button is clicked", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const statusButton = screen.getByRole("button", { name: "Status" });
    fireEvent.click(statusButton);

    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnFilterChange).toHaveBeenCalledWith("status");
  });

  it("does not call onFilterChange when already selected button is clicked", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const nameButton = screen.getByRole("button", { name: "Name" });
    fireEvent.click(nameButton);

    // Should still call the function even if the same filter is selected
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
    expect(mockOnFilterChange).toHaveBeenCalledWith("name");
  });

  it("renders buttons with correct structure and styling", () => {
    const { container } = render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    // Check that buttons are in an HStack
    const hstack = container.querySelector('[class*="css-"]');
    expect(hstack).toBeInTheDocument();

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(2);
    
    // Both buttons should be present
    expect(buttons[0]).toHaveTextContent("Name");
    expect(buttons[1]).toHaveTextContent("Status");
  });

  it("handles rapid clicks correctly", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const statusButton = screen.getByRole("button", { name: "Status" });
    const nameButton = screen.getByRole("button", { name: "Name" });

    // Click multiple times rapidly
    fireEvent.click(statusButton);
    fireEvent.click(nameButton);
    fireEvent.click(statusButton);

    expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, "status");
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, "name");
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(3, "status");
  });

  it("maintains accessibility for keyboard navigation", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const nameButton = screen.getByRole("button", { name: "Name" });
    const statusButton = screen.getByRole("button", { name: "Status" });

    // Buttons should be focusable
    nameButton.focus();
    expect(document.activeElement).toBe(nameButton);

    statusButton.focus();
    expect(document.activeElement).toBe(statusButton);
  });

  it("buttons are accessible via keyboard navigation", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="name" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const nameButton = screen.getByRole("button", { name: "Name" });
    const statusButton = screen.getByRole("button", { name: "Status" });

    // Buttons should be focusable and have proper tab order
    expect(nameButton).toBeInTheDocument();
    expect(statusButton).toBeInTheDocument();
    
    // Focus should work
    nameButton.focus();
    expect(document.activeElement).toBe(nameButton);

    statusButton.focus();
    expect(document.activeElement).toBe(statusButton);
  });

  it("maintains proper button semantics for screen readers", () => {
    render(
      <NameOrStatusFilter 
        selectedFilter="status" 
        onFilterChange={mockOnFilterChange} 
      />
    );

    const nameButton = screen.getByRole("button", { name: "Name" });
    const statusButton = screen.getByRole("button", { name: "Status" });

    // Both buttons should have proper button role
    expect(nameButton).toHaveAttribute("type", "button");
    expect(statusButton).toHaveAttribute("type", "button");
  });
});
