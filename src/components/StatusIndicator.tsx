import { Box, Flex, Text } from "@chakra-ui/react";
import type { RobotStatus } from "../types/robot";

interface StatusIndicatorProps {
  status: RobotStatus;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const getStatusConfig = (status: RobotStatus) => {
    switch (status) {
      case "Idle":
        return {
          bg: "green.50",
          borderColor: "green.200",
          icon: "🤖",
          iconColor: "green.600",
          title: "Robot Ready",
          titleColor: "green.800",
          description: "Waiting for next assignment",
          descriptionColor: "green.600",
        };
      case "Error":
        return {
          bg: "red.50",
          borderColor: "red.200",
          icon: "⚠️",
          iconColor: "red.600",
          title: "System Error",
          titleColor: "red.800",
          description: "Requires maintenance attention",
          descriptionColor: "red.600",
        };
      case "Charging":
        return {
          bg: "purple.50",
          borderColor: "purple.200",
          icon: "🔋",
          iconColor: "purple.600",
          title: "Charging",
          titleColor: "purple.800",
          description: "Replenishing battery power",
          descriptionColor: "purple.600",
        };
      case "Returning":
        return {
          bg: "orange.50",
          borderColor: "orange.200",
          icon: "🏠",
          iconColor: "orange.600",
          title: "Returning to Base",
          titleColor: "orange.800",
          description: "Navigating back to station",
          descriptionColor: "orange.600",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig(status);

  if (!config) return null;

  return (
    <Box mb={4} p={4} bg={config.bg} borderRadius="md" border="1px solid" borderColor={config.borderColor}>
      <Flex align="center" justify="center" direction="column">
        <Box fontSize="3xl" mb={2} color={config.iconColor} display="flex" alignItems="center" justifyContent="center">
          {config.icon}
        </Box>
        <Text fontSize="sm" fontWeight="bold" color={config.titleColor} mb={1}>
          {config.title}
        </Text>
        <Text fontSize="xs" color={config.descriptionColor} textAlign="center">
          {config.description}
        </Text>
      </Flex>
    </Box>
  );
};

export default StatusIndicator;
