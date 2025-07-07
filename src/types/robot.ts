export interface Robot {
  robotId: string;
  name: string; // Added name property
  model: string;
  status: "On Delivery" | "Idle" | "Charging" | "Error" | "Returning";
  batteryLevel: number;
  location: {
    latitude: number;
    longitude: number;
  };
  currentOrder: {
    orderId: string;
    customerName: string;
    deliveryAddress: string;
    estimatedDelivery: string;
  };
}

export const sampleRobots: Robot[] = [
  {
    robotId: "R2D1",
    name: "Robo-1", // Added name
    model: "V2",
    status: "On Delivery",
    batteryLevel: 34,
    location: {
      latitude: 12.3344,
      longitude: -122.5162,
    },
    currentOrder: {
      orderId: "ORD-12345",
      customerName: "",
      deliveryAddress: "Vienna, Holloid",
      estimatedDelivery: "2025-04-03T14:10:00Z",
    },
  },
  {
    robotId: "R2D2",
    name: "Robo-2", // Added name
    model: "V2",
    status: "Idle",
    batteryLevel: 87,
    location: {
      latitude: 34.0522,
      longitude: -54.2437,
    },
    currentOrder: {
      orderId: "ORD-12346",
      customerName: "Customer member",
      deliveryAddress: "Vienna, Holloid",
      estimatedDelivery: "2025-04-03T18:25:00Z",
    },
  },
  {
    robotId: "R1D3",
    name: "Robo-3", // Added name
    model: "V1",
    status: "On Delivery",
    batteryLevel: 19,
    location: {
      latitude: -43.058,
      longitude: -118.2437,
    },
    currentOrder: {
      orderId: "ORD-12347",
      customerName: "Customer Customer",
      deliveryAddress: "Vienna, Holloid",
      estimatedDelivery: "2025-04-03T10:11:00Z",
    },
  },
];
