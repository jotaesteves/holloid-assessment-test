import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { RobotProvider, useRobotContext } from "../RobotContext";
import type { Robot } from "../../types/robot";
import React from "react";

const mockRobots: Robot[] = [
  {
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
  },
  {
    robotId: "R002",
    name: "Robot 2",
    model: "V1",
    status: "On Delivery",
    batteryLevel: 65,
    location: { latitude: 34.0522, longitude: -54.2437 },
    currentOrder: {
      orderId: "ORD-002",
      customerName: "Customer 2",
      deliveryAddress: "Address 2",
      estimatedDelivery: "2024-01-15T11:00:00Z",
    },
  },
  {
    robotId: "R003",
    name: "Robot 3",
    model: "V2",
    status: "Charging",
    batteryLevel: 20,
    location: { latitude: -43.058, longitude: -118.2437 },
    currentOrder: {
      orderId: "ORD-003",
      customerName: "Customer 3",
      deliveryAddress: "Address 3",
      estimatedDelivery: "2024-01-15T12:00:00Z",
    },
  },
  {
    robotId: "R004",
    name: "Robot 4",
    model: "V2",
    status: "Error",
    batteryLevel: 45,
    location: { latitude: 40.7128, longitude: -74.006 },
    currentOrder: {
      orderId: "ORD-004",
      customerName: "Customer 4",
      deliveryAddress: "Address 4",
      estimatedDelivery: "2024-01-15T13:00:00Z",
    },
  },
  {
    robotId: "R005",
    name: "Robot 5",
    model: "V2",
    status: "Returning",
    batteryLevel: 75,
    location: { latitude: 51.5074, longitude: -0.1278 },
    currentOrder: {
      orderId: "ORD-005",
      customerName: "Customer 5",
      deliveryAddress: "Address 5",
      estimatedDelivery: "2024-01-15T14:00:00Z",
    },
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RobotProvider initialRobots={mockRobots}>{children}</RobotProvider>
);

describe("RobotContext", () => {
  it("provides initial robot data", () => {
    const { result } = renderHook(() => useRobotContext(), { wrapper });

    expect(result.current.robots).toHaveLength(5);
    expect(result.current.robots[0]).toHaveProperty("robotId");
    expect(result.current.robots[0]).toHaveProperty("status");
    expect(result.current.robots[0]).toHaveProperty("batteryLevel");
  });

  it("updates battery level correctly", () => {
    const { result } = renderHook(() => useRobotContext(), { wrapper });

    const initialBattery = result.current.robots[0].batteryLevel;
    const robotId = result.current.robots[0].robotId;

    act(() => {
      result.current.updateBatteryLevel(robotId, 90);
    });

    expect(result.current.robots[0].batteryLevel).toBe(90);
    expect(result.current.robots[0].batteryLevel).not.toBe(initialBattery);
  });

  it("updates robot status correctly", () => {
    const { result } = renderHook(() => useRobotContext(), { wrapper });

    const robotId = result.current.robots[0].robotId;

    act(() => {
      result.current.updateRobotStatus(robotId, "Charging");
    });

    expect(result.current.robots[0].status).toBe("Charging");
  });

  it("returns robot to base correctly", () => {
    const { result } = renderHook(() => useRobotContext(), { wrapper });

    const robotId = result.current.robots[0].robotId;

    act(() => {
      result.current.returnRobotToBase(robotId);
    });

    expect(result.current.robots[0].status).toBe("Returning");
  });

  it("clamps battery level between 0 and 100", () => {
    const { result } = renderHook(() => useRobotContext(), { wrapper });

    const robotId = result.current.robots[0].robotId;

    act(() => {
      result.current.updateBatteryLevel(robotId, 150);
    });

    expect(result.current.robots[0].batteryLevel).toBe(100);

    act(() => {
      result.current.updateBatteryLevel(robotId, -10);
    });

    expect(result.current.robots[0].batteryLevel).toBe(0);
  });
});
