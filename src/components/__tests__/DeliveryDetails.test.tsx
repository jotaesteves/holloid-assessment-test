import { describe, it, expect } from "vitest";
import { render, screen } from "../../test/utils/test-utils";
import DeliveryDetails from "../DeliveryDetails";
import type { Robot } from "../../types/robot";

const robotOnDelivery: Robot = {
  robotId: "R001",
  name: "Robot 1",
  model: "V1",
  status: "On Delivery",
  batteryLevel: 75,
  location: { latitude: 12.3344, longitude: -122.5162 },
  currentOrder: {
    orderId: "ORD-001",
    customerName: "Customer 1",
    deliveryAddress: "123 Main St, City",
    estimatedDelivery: "2024-01-15T12:00:00Z",
  },
};

const robotIdle: Robot = {
  robotId: "R002",
  name: "Robot 2",
  model: "V1",
  status: "Idle",
  batteryLevel: 85,
  location: { latitude: 34.0522, longitude: -54.2437 },
  currentOrder: {
    orderId: "ORD-002",
    customerName: "Customer 2",
    deliveryAddress: "456 Oak Ave, Town",
    estimatedDelivery: "2024-01-15T13:00:00Z",
  },
};

describe("DeliveryDetails", () => {
  it("renders delivery details when robot is on delivery", () => {
    render(<DeliveryDetails robot={robotOnDelivery} />);

    expect(screen.getByText("Current Delivery")).toBeInTheDocument();
    expect(screen.getByText("Order ID:")).toBeInTheDocument();
    expect(screen.getByText("ORD-001")).toBeInTheDocument();
    expect(screen.getByText("ETA:")).toBeInTheDocument();
    expect(screen.getByText("Address:")).toBeInTheDocument();
    expect(screen.getByText("123 Main St, City")).toBeInTheDocument();
  });

  it("does not render when robot is not on delivery", () => {
    const { container } = render(<DeliveryDetails robot={robotIdle} />);
    expect(container.firstChild).toBeNull();
  });

  it("formats ETA time correctly", () => {
    render(<DeliveryDetails robot={robotOnDelivery} />);

    // The ETA should be formatted as time (e.g., "12:00 PM")
    const etaText = screen.getByText(/\d{1,2}:\d{2}/);
    expect(etaText).toBeInTheDocument();
  });
});
