import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils/test-utils";
import StatusIndicator from "../StatusIndicator";

describe("StatusIndicator", () => {
  it("renders idle status correctly", () => {
    render(<StatusIndicator status="Idle" />);

    expect(screen.getByText("🤖")).toBeInTheDocument();
    expect(screen.getByText("Robot Ready")).toBeInTheDocument();
    expect(screen.getByText("Waiting for next assignment")).toBeInTheDocument();
  });

  it("renders error status correctly", () => {
    render(<StatusIndicator status="Error" />);

    expect(screen.getByText("⚠️")).toBeInTheDocument();
    expect(screen.getByText("System Error")).toBeInTheDocument();
    expect(screen.getByText("Requires maintenance attention")).toBeInTheDocument();
  });

  it("renders charging status correctly", () => {
    render(<StatusIndicator status="Charging" />);

    expect(screen.getByText("🔋")).toBeInTheDocument();
    expect(screen.getByText("Charging")).toBeInTheDocument();
    expect(screen.getByText("Battery recharging in progress")).toBeInTheDocument();
  });

  it("renders returning status correctly", () => {
    render(<StatusIndicator status="Returning" />);

    expect(screen.getByText("🏠")).toBeInTheDocument();
    expect(screen.getByText("Returning to Base")).toBeInTheDocument();
    expect(screen.getByText("Heading back to charging station")).toBeInTheDocument();
  });

  it("renders on delivery status correctly", () => {
    render(<StatusIndicator status="On Delivery" />);

    expect(screen.getByText("🚚")).toBeInTheDocument();
    expect(screen.getByText("On Delivery")).toBeInTheDocument();
    expect(screen.getByText("Delivering order to customer")).toBeInTheDocument();
  });
});
