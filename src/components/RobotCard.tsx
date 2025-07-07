import { Box, Button, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import type { Robot } from "../types/robot";

interface RobotCardProps {
  robot: Robot;
  onReturnToBase: (robotId: string) => void;
}

const RobotCard = ({ robot, onReturnToBase }: RobotCardProps) => {
  const getStatusColor = (status: Robot["status"]) => {
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

  const getBatteryColor = (batteryLevel: number) => {
    if (batteryLevel > 70) return "green.500";
    if (batteryLevel > 30) return "yellow.500";
    return "red.500";
  };

  const formatETA = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      bg="whiteAlpha.800"
      backdropFilter="blur(10px)"
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      h="full"
      display="flex"
      flexDirection="column"
      transition="all 0.3s"
      _hover={{
        boxShadow: "2xl",
        transform: "translateY(-4px)",
      }}
    >
      <Box flex="1">
        <Flex justify="space-between" align="flex-start" mb={4}>
          <Box>
            <Heading as="h1" size="2xl" color="gray.800" mb={1}>
              {robot.robotId}
            </Heading>
            <Text fontSize="md" color="gray.800">
              {robot.model}
            </Text>
          </Box>
          <Badge
            bg={getStatusColor(robot.status).bg}
            color={getStatusColor(robot.status).color}
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
            fontWeight="semibold"
          >
            {robot.status}
          </Badge>
        </Flex>

        <Box mb={4}>
          <Flex>
            <Box>
              <Text color="gray.700" mb={1}>
                Order ID:
              </Text>
              <Text color="gray.700" mb={1}>
                ETA:
              </Text>
              <Text color="gray.700">Address:</Text>
            </Box>
            <Box ml={4}>
              <Text fontWeight="medium" color="gray.800" mb={1}>
                {robot.currentOrder.orderId}
              </Text>
              <Text fontWeight="medium" color="gray.800" mb={1}>
                {formatETA(robot.currentOrder.estimatedDelivery)}
              </Text>
              <Text fontWeight="medium" color="gray.800">
                {robot.currentOrder.deliveryAddress}
              </Text>
            </Box>
          </Flex>
        </Box>

        <Box mb={4}>
          <Flex align="center" justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium" color="gray.600">
              Battery
            </Text>
            <Text fontSize="sm" color="gray.500">
              {robot.batteryLevel}%
            </Text>
          </Flex>
          <Box position="relative">
            <Box width="100%" height="8px" bg="gray.200" borderRadius="full" overflow="hidden">
              <Box
                width={`${robot.batteryLevel}%`}
                height="100%"
                bg={getBatteryColor(robot.batteryLevel)}
                borderRadius="full"
                transition="width 0.3s"
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box mt="auto">
        <Button
          onClick={() => onReturnToBase(robot.robotId)}
          disabled={robot.status === "Returning"}
          colorScheme="blue"
          size="md"
          width="full"
          fontWeight="bold"
        >
          {robot.status === "Returning" ? "Returning to Base" : "Return to Base"}
        </Button>
      </Box>
    </Box>
  );
};

export default RobotCard;
