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
          bgDark: "green.900",
          borderColor: "green.200",
          borderColorDark: "green.600",
          icon: "🤖",
          iconColor: "green.600",
          iconColorDark: "green.300",
          title: "Robot Ready",
          titleColor: "green.800",
          titleColorDark: "green.200",
          description: "Waiting for next assignment",
          descriptionColor: "green.600",
          descriptionColorDark: "green.300",
        };
      case "Error":
        return {
          bg: "red.50",
          bgDark: "red.900",
          borderColor: "red.200",
          borderColorDark: "red.600",
          icon: "⚠️",
          iconColor: "red.600",
          iconColorDark: "red.300",
          title: "System Error",
          titleColor: "red.800",
          titleColorDark: "red.200",
          description: "Requires maintenance attention",
          descriptionColor: "red.600",
          descriptionColorDark: "red.300",
        };
      case "Charging":
        return {
          bg: "purple.50",
          bgDark: "purple.900",
          borderColor: "purple.200",
          borderColorDark: "purple.600",
          icon: "🔋",
          iconColor: "purple.600",
          iconColorDark: "purple.300",
          title: "Charging",
          titleColor: "purple.800",
          titleColorDark: "purple.200",
          description: "Replenishing battery power",
          descriptionColor: "purple.600",
          descriptionColorDark: "purple.300",
        };
      case "Returning":
        return {
          bg: "orange.50",
          bgDark: "orange.900",
          borderColor: "orange.200",
          borderColorDark: "orange.600",
          icon: "🏠",
          iconColor: "orange.600",
          iconColorDark: "orange.300",
          title: "Returning to Base",
          titleColor: "orange.800",
          titleColorDark: "orange.200",
          description: "Navigating back to station",
          descriptionColor: "orange.600",
          descriptionColorDark: "orange.300",
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig(status);

  if (!config) return null;

  return (
    <Box
      mb={4}
      p={4}
      bg={config.bg}
      borderRadius="md"
      border="1px solid"
      borderColor={config.borderColor}
      _dark={{ bg: config.bgDark, borderColor: config.borderColorDark }}
    >
      <Flex align="center" justify="center" direction="column">
        <Box
          fontSize="3xl"
          mb={2}
          color={config.iconColor}
          _dark={{ color: config.iconColorDark }}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {config.icon}
        </Box>
        <Text fontSize="sm" fontWeight="bold" color={config.titleColor} _dark={{ color: config.titleColorDark }} mb={1}>
          {config.title}
        </Text>
        <Text
          fontSize="xs"
          color={config.descriptionColor}
          _dark={{ color: config.descriptionColorDark }}
          textAlign="center"
        >
          {config.description}
        </Text>
      </Flex>
    </Box>
  );
};

export default StatusIndicator;
