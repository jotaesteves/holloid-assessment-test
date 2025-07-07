import type { Robot } from "../types/robot";

export const getStatusColor = (status: Robot["status"]) => {
  switch (status) {
    case "Idle":
      return { colorScheme: "green", bg: "green.100", color: "green.800" };
    case "On Delivery":
      return { colorScheme: "blue", bg: "blue.100", color: "blue.800" };
    case "Returning":
      return { colorScheme: "orange", bg: "orange.100", color: "orange.800" };
    case "Charging":
      return { colorScheme: "purple", bg: "purple.100", color: "purple.800" };
    case "Error":
      return { colorScheme: "red", bg: "red.100", color: "red.800" };
    default:
      return { colorScheme: "gray", bg: "gray.100", color: "gray.800" };
  }
};
