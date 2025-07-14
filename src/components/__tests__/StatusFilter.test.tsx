import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../../test/utils/test-utils";
import StatusFilter from "../StatusFilter";

const mockRobotCounts = {
  All: 10,
  Idle: 3,
  "On Delivery": 4,
  Charging: 2,
  Error: 1,
  Returning: 0,
};

describe("StatusFilter", () => {
  const mockOnFilterChange = vi.fn();

  beforeEach(() => {
    mockOnFilterChange.mockClear();
  });

  it("renders filter label and select element", () => {
    render(<StatusFilter selectedFilter="All" onFilterChange={mockOnFilterChange} robotCounts={mockRobotCounts} />);

    expect(screen.getByText("Filter by Status:")).toBeInTheDocument();
    expect(screen.getByDisplayValue("All (10)")).toBeInTheDocument();
  });

  it("displays all status options with counts", () => {
    render(<StatusFilter selectedFilter="All" onFilterChange={mockOnFilterChange} robotCounts={mockRobotCounts} />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Check that options include counts
    expect(screen.getByDisplayValue("All (10)")).toBeInTheDocument();
  });

  it("calls onFilterChange when selection changes", () => {
    render(<StatusFilter selectedFilter="All" onFilterChange={mockOnFilterChange} robotCounts={mockRobotCounts} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "Idle" } });

    expect(mockOnFilterChange).toHaveBeenCalledWith("Idle");
  });

  it("shows correct selected value", () => {
    render(<StatusFilter selectedFilter="Idle" onFilterChange={mockOnFilterChange} robotCounts={mockRobotCounts} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("Idle");
  });
});
