import { Box, Button, Flex, Heading, Text, Badge } from "@chakra-ui/react";
import type { Robot, RobotStatus } from "../types/robot";
import { getStatusColor, getBatteryColor } from "../utils/get-colors";
import { useRobotContext } from "../contexts/RobotContext";
import DeliveryDetails from "./DeliveryDetails";
import StatusIndicator from "./StatusIndicator";

interface RobotCardProps {
  robot: Robot;
}

const changeRobotStatus = (status: RobotStatus) => {
  const statuses: RobotStatus[] = ["Idle", "On Delivery", "Charging", "Error", "Returning"];
  const currentIndex = statuses.indexOf(status);
  const nextIndex = (currentIndex + 1) % statuses.length;
  return statuses[nextIndex];
};

const RobotCard = ({ robot }: RobotCardProps) => {
  const { updateBatteryLevel, returnRobotToBase, updateRobotStatus } = useRobotContext();

  // Determine if button should be active and get appropriate label
  const canReturnToBase = robot.status === "Idle" || robot.status === "On Delivery";
  const isReturning = robot.status === "Returning";

  const getButtonLabel = () => {
    switch (robot.status) {
      case "Returning":
        return "Returning to Base...";
      case "Charging":
        return "Currently Charging";
      case "Error":
        return "Error - Cannot Return";
      case "On Delivery":
        return "Recall from Delivery";
      case "Idle":
        return "Return to Base";
      default:
        return "Return to Base";
    }
  };

  return (
    <Box
      bg="white"
      _dark={{ bg: "gray.800" }}
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
            <Heading as="h2" size="lg" color="gray.900" _dark={{ color: "white" }} mb={1}>
              {robot.robotId} – {robot.name}
            </Heading>
            <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }} fontWeight="medium">
              Model: {robot.model}
            </Text>
          </Box>
          <Badge
            bg={getStatusColor(robot.status).bg}
            color={getStatusColor(robot.status).color}
            _dark={{
              bg: getStatusColor(robot.status).bgDark,
              color: getStatusColor(robot.status).colorDark,
            }}
            fontSize="xs"
            px={3}
            py={1}
            borderRadius="full"
            fontWeight="semibold"
            aria-label={`Status: ${robot.status}`}
            onClick={() => {
              // Change status on click
              const newStatus = changeRobotStatus(robot.status);
              updateRobotStatus(robot.robotId, newStatus);
            }}
            cursor="pointer"
            transition="background-color 0.2s, color 0.2s"
            _hover={{
              bg: getStatusColor(robot.status).bg,
              color: getStatusColor(robot.status).color,
            }}
            role="status"
            aria-live="polite"
            aria-atomic="true"
            data-testid={`robot-status-${robot.robotId}`}
          >
            {robot.status}
          </Badge>
        </Flex>

        {/* Order Details and Status Indicators */}
        <DeliveryDetails robot={robot} />
        <StatusIndicator status={robot.status} />
      </Box>

      {/* Battery Level Indicator */}
      <Box mb={4}>
        <Flex align="center" justify="space-between" mb={2}>
          <Text fontSize="sm" fontWeight="medium" color="gray.600" _dark={{ color: "gray.400" }}>
            Battery Level
          </Text>
          <Flex align="center">
            <Button
              size="xs"
              mr={2}
              aria-label="Decrease battery level"
              onClick={() => updateBatteryLevel(robot.robotId, robot.batteryLevel - 10)}
              variant="outline"
              colorScheme="gray"
              disabled={robot.batteryLevel <= 0}
            >
              -
            </Button>
            <Text
              fontSize="sm"
              color="gray.600"
              _dark={{ color: "gray.400" }}
              fontWeight="bold"
              minW="32px"
              textAlign="center"
            >
              {robot.batteryLevel}%
            </Text>
            <Button
              size="xs"
              ml={2}
              aria-label="Increase battery level"
              onClick={() => updateBatteryLevel(robot.robotId, robot.batteryLevel + 10)}
              variant="outline"
              colorScheme="gray"
              disabled={robot.batteryLevel >= 100}
            >
              +
            </Button>
          </Flex>
        </Flex>
        <Box position="relative">
          <Box
            width="100%"
            height="8px"
            bg="gray.200"
            _dark={{ bg: "gray.600" }}
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
              bg={getBatteryColor(robot.batteryLevel).light}
              _dark={{ bg: getBatteryColor(robot.batteryLevel).dark }}
              borderRadius="full"
              transition="width 0.3s"
            />
          </Box>
        </Box>
      </Box>

      {/* Return to Base Button */}
      <Box mt="auto">
        <Button
          onClick={() => returnRobotToBase(robot.robotId)}
          disabled={!canReturnToBase}
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
          {getButtonLabel()}
        </Button>
      </Box>
    </Box>
  );
};

export default RobotCard;
