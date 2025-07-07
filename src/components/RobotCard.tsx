import { Box, Button, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import type { Robot } from "../types/robot";
import { getStatusColor } from "../utils/get-status-color";

interface RobotCardProps {
  robot: Robot;
  onReturnToBase: (robotId: string) => void;
}

const RobotCard = ({ robot, onReturnToBase }: RobotCardProps) => {
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

  // Determine if button should be active
  const canReturnToBase = robot.status === "Idle" || robot.status === "On Delivery";
  const isReturning = robot.status === "Returning";

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
      role="article"
      aria-label={`Robot ${robot.robotId} status card`}
    >
      <Box flex="1">
        {/* Robot ID, Model, and Status */}
        <Flex justify="space-between" align="flex-start" mb={4}>
          <Box>
            <Heading as="h2" size="lg" color="gray.800" mb={1}>
              {robot.robotId}
            </Heading>
            <Text fontSize="md" color="gray.600" fontWeight="medium">
              Model: {robot.model}
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
            aria-label={`Status: ${robot.status}`}
          >
            {robot.status}
          </Badge>
        </Flex>

        {/* Conditional Order Details - Only show if "On Delivery" */}
        {robot.status === "On Delivery" && (
          <Box mb={4} p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
            <Text fontSize="sm" fontWeight="bold" color="blue.800" mb={2}>
              Current Delivery
            </Text>
            <Flex>
              <Box>
                <Text color="gray.700" fontSize="sm" mb={1}>
                  Order ID:
                </Text>
                <Text color="gray.700" fontSize="sm" mb={1}>
                  ETA:
                </Text>
                <Text color="gray.700" fontSize="sm">
                  Address:
                </Text>
              </Box>
              <Box ml={4}>
                <Text fontWeight="medium" color="gray.800" fontSize="sm" mb={1}>
                  {robot.currentOrder.orderId}
                </Text>
                <Text fontWeight="medium" color="gray.800" fontSize="sm" mb={1}>
                  {formatETA(robot.currentOrder.estimatedDelivery)}
                </Text>
                <Text fontWeight="medium" color="gray.800" fontSize="sm">
                  {robot.currentOrder.deliveryAddress}
                </Text>
              </Box>
            </Flex>
          </Box>
        )}
      </Box>

      {/* Battery Level Indicator */}
      <Box mb={4}>
        <Flex align="center" justify="space-between" mb={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600">
            Battery Level
          </Text>
          <Text fontSize="sm" color="gray.500" fontWeight="bold">
            {robot.batteryLevel}%
          </Text>
        </Flex>
        <Box position="relative">
          <Box
            width="100%"
            height="8px"
            bg="gray.200"
            borderRadius="full"
            overflow="hidden"
            role="progressbar"
            aria-valuenow={robot.batteryLevel}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Battery level: ${robot.batteryLevel}%`}
          >
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

      {/* Return to Base Button */}
      <Box mt="auto">
        <Button
          onClick={() => onReturnToBase(robot.robotId)}
          disabled={!canReturnToBase}
          colorScheme={isReturning ? "orange" : "blue"}
          size="md"
          width="full"
          fontWeight="bold"
          aria-label={
            isReturning
              ? `Robot ${robot.robotId} is returning to base`
              : canReturnToBase
              ? `Send robot ${robot.robotId} back to base`
              : `Cannot return robot ${robot.robotId} to base - current status: ${robot.status}`
          }
        >
          {isReturning ? "Returning to Base..." : "Return to Base"}
        </Button>
      </Box>
    </Box>
  );
};

export default RobotCard;
