import type { Robot } from "../types/robot";

export const getStatusColor = (status: Robot["status"]) => {
  switch (status) {
    case "Idle":
      return {
        bg: "green.100",
        bgDark: "green.800",
        color: "green.800",
        colorDark: "green.200",
      };
    case "On Delivery":
      return {
        bg: "blue.100",
        bgDark: "blue.800",
        color: "blue.800",
        colorDark: "blue.200",
      };
    case "Returning":
      return {
        bg: "orange.100",
        bgDark: "orange.800",
        color: "orange.800",
        colorDark: "orange.200",
      };
    case "Charging":
      return {
        bg: "purple.100",
        bgDark: "purple.800",
        color: "purple.800",
        colorDark: "purple.200",
      };
    case "Error":
      return {
        bg: "red.100",
        bgDark: "red.800",
        color: "red.800",
        colorDark: "red.200",
      };
    default:
      return {
        bg: "gray.100",
        bgDark: "gray.700",
        color: "gray.800",
        colorDark: "gray.200",
      };
  }
};

export const getBatteryColor = (batteryLevel: number) => {
  if (batteryLevel > 50) {
    return {
      light: "green.400",
      dark: "green.300",
    };
  }
  if (batteryLevel > 30) {
    return {
      light: "yellow.400",
      dark: "yellow.300",
    };
  }
  return {
    light: "red.400",
    dark: "red.300",
  };
};
