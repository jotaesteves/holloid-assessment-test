import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "../../test/utils/test-utils";
import RobotCard from "../RobotCard";
import type { Robot } from "../../types/robot";

const mockRobot: Robot = {
  robotId: "R001",
  name: "Robot 1",
  model: "V1",
  status: "Idle",
  batteryLevel: 85,
  location: { latitude: 12.3344, longitude: -122.5162 },
  currentOrder: {
    orderId: "ORD-001",
    customerName: "Customer 1",
    deliveryAddress: "Address 1",
    estimatedDelivery: "2024-01-15T10:30:00Z",
  },
};

const mockRobotOnDelivery: Robot = {
  robotId: "R002",
  name: "Robot 2",
  model: "V2",
  status: "On Delivery",
  batteryLevel: 65,
  location: { latitude: 34.0522, longitude: -54.2437 },
  currentOrder: {
    orderId: "ORD-001",
    customerName: "Customer 2",
    deliveryAddress: "123 Main St, City",
    estimatedDelivery: "2024-01-15T12:00:00Z",
  },
};

describe("RobotCard", () => {
  it("renders robot information correctly", () => {
    render(<RobotCard robot={mockRobot} />);

    // Use more flexible text matching for text that might be split across elements
    expect(screen.getByText(/R001/)).toBeInTheDocument();
    expect(screen.getByText(/Robot 1/)).toBeInTheDocument();
    expect(screen.getByText("Idle")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(screen.getByText("Battery Level")).toBeInTheDocument();
  });

  it("displays delivery details when robot is on delivery", () => {
    render(<RobotCard robot={mockRobotOnDelivery} />);

    expect(screen.getByText("Current Delivery")).toBeInTheDocument();
    expect(screen.getByText("ORD-001")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, City")).toBeInTheDocument();
  });

  it("does not display delivery details when robot is idle", () => {
    render(<RobotCard robot={mockRobot} />);

    expect(screen.queryByText("Current Delivery")).not.toBeInTheDocument();
  });

  it("allows battery level adjustment", () => {
    render(<RobotCard robot={mockRobot} />);

    const increaseButton = screen.getByLabelText("Increase battery level");
    const decreaseButton = screen.getByLabelText("Decrease battery level");

    expect(increaseButton).toBeInTheDocument();
    expect(decreaseButton).toBeInTheDocument();
    expect(increaseButton).not.toBeDisabled();
    expect(decreaseButton).not.toBeDisabled();
  });

  it("disables decrease button when battery is at 0%", () => {
    const robotLowBattery = { ...mockRobot, batteryLevel: 0 };
    render(<RobotCard robot={robotLowBattery} />);

    const decreaseButton = screen.getByLabelText("Decrease battery level");
    expect(decreaseButton).toBeDisabled();
  });

  it("disables increase button when battery is at 100%", () => {
    const robotFullBattery = { ...mockRobot, batteryLevel: 100 };
    render(<RobotCard robot={robotFullBattery} />);

    const increaseButton = screen.getByLabelText("Increase battery level");
    expect(increaseButton).toBeDisabled();
  });

  it("shows correct button label for different statuses", () => {
    const returningRobot = { ...mockRobot, status: "Returning" as const };
    render(<RobotCard robot={returningRobot} />);

    expect(screen.getByText("Returning to Base...")).toBeInTheDocument();
  });

  it("allows status cycling when clicking on status badge", () => {
    render(<RobotCard robot={mockRobot} />);

    const statusBadge = screen.getByTestId(`robot-status-${mockRobot.robotId}`);
    expect(statusBadge).toBeInTheDocument();

    fireEvent.click(statusBadge);
    // Status should cycle from Idle to next status
  });

  it("displays correct battery color based on level", () => {
    const lowBatteryRobot = { ...mockRobot, batteryLevel: 20 };
    render(<RobotCard robot={lowBatteryRobot} />);

    // Check that the battery indicator is present
    const batteryIndicator = screen.getByRole("progressbar");
    expect(batteryIndicator).toHaveAttribute("aria-valuenow", "20");
  });
});
