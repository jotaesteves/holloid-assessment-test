import { Box, Flex, Text } from "@chakra-ui/react";
import type { Robot } from "../types/robot";

interface DeliveryDetailsProps {
  robot: Robot;
}

const DeliveryDetails = ({ robot }: DeliveryDetailsProps) => {
  const formatETA = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (robot.status !== "On Delivery") return null;

  return (
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
  );
};

export default DeliveryDetails;
