/**
 * Enhanced RobotCard component with comprehensive monitoring
 * This demonstrates how to implement monitoring in a real component
 */

import { Box, Card, Text, Badge, Button, HStack, VStack } from '@chakra-ui/react';
import type { Robot } from '../types/robot';
import { useLogger, PerformanceTimer } from '../services/logger';
import { useAsync } from '../hooks';
import { useRobotContext } from '../contexts/RobotContext';
import { useEffect, useState } from 'react';

interface EnhancedRobotCardProps {
  robot: Robot;
}

export function EnhancedRobotCard({ robot }: EnhancedRobotCardProps) {
  const logger = useLogger('EnhancedRobotCard');
  const { updateRobotStatus, updateBatteryLevel, returnRobotToBase } = useRobotContext();
  const [renderTime, setRenderTime] = useState<number>(0);

  // Monitor component render performance
  useEffect(() => {
    const timer = new PerformanceTimer(`RobotCard render (${robot.robotId})`, 'EnhancedRobotCard');

    return () => {
      const duration = timer.end();
      setRenderTime(duration);

      // Log slow renders
      if (duration > 50) {
        logger.warn('Slow robot card render detected', {
          robotId: robot.robotId,
          renderTime: duration,
          robotStatus: robot.status,
          batteryLevel: robot.batteryLevel,
        });
      }
    };
  }, [robot, logger]);

  // Monitor robot data changes
  useEffect(() => {
    logger.debug('Robot data updated', {
      robotId: robot.robotId,
      status: robot.status,
      batteryLevel: robot.batteryLevel,
      location: robot.location,
    });
  }, [robot, logger]);

  // Monitored async operations
  const {
    execute: handleStatusChange,
    loading: statusLoading,
    error: statusError,
  } = useAsync(async (newStatus: Robot['status']) => {
    logger.userAction('Status change initiated', {
      robotId: robot.robotId,
      oldStatus: robot.status,
      newStatus,
    });

    return updateRobotStatus(robot.robotId, newStatus);
  });

  const { execute: handleBatteryChange, loading: batteryLoading } = useAsync(
    async (change: number) => {
      const newLevel = Math.max(0, Math.min(100, robot.batteryLevel + change));

      logger.userAction('Battery level adjusted', {
        robotId: robot.robotId,
        oldLevel: robot.batteryLevel,
        newLevel,
        change,
      });

      return updateBatteryLevel(robot.robotId, newLevel);
    }
  );

  const { execute: handleReturnToBase, loading: returnLoading } = useAsync(async () => {
    logger.userAction('Return to base initiated', {
      robotId: robot.robotId,
      currentStatus: robot.status,
      currentLocation: robot.location,
    });

    return returnRobotToBase(robot.robotId);
  });

  // Battery level monitoring
  useEffect(() => {
    if (robot.batteryLevel <= 20) {
      logger.warn('Low battery detected', {
        robotId: robot.robotId,
        robotName: robot.name,
        batteryLevel: robot.batteryLevel,
        status: robot.status,
      });
    }

    if (robot.batteryLevel <= 5) {
      logger.error('Critical battery level', {
        robotId: robot.robotId,
        robotName: robot.name,
        batteryLevel: robot.batteryLevel,
        status: robot.status,
        urgentAction: 'immediate_charging_required',
      });
    }
  }, [robot.batteryLevel, robot.robotId, robot.name, robot.status, logger]);

  // Status change monitoring
  const handleStatusClick = () => {
    const statuses: Robot['status'][] = ['Idle', 'On Delivery', 'Charging', 'Error', 'Returning'];
    const currentIndex = statuses.indexOf(robot.status);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];

    handleStatusChange(nextStatus);
  };

  // Get status color with performance optimization
  const getStatusColor = (status: Robot['status']) => {
    const colors = {
      Idle: 'green',
      'On Delivery': 'blue',
      Charging: 'purple',
      Error: 'red',
      Returning: 'orange',
    };
    return colors[status] || 'gray';
  };

  // Get battery color based on level
  const getBatteryColor = (level: number) => {
    if (level > 50) return 'green';
    if (level > 20) return 'orange';
    return 'red';
  };

  return (
    <Card.Root p={6} bg="white" _dark={{ bg: 'gray.800' }} shadow="lg" borderRadius="lg">
      <VStack align="stretch" gap={4}>
        {/* Header with robot info and performance indicator */}
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Text fontSize="lg" fontWeight="bold">
              {robot.name}
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: 'gray.400' }}>
              ID: {robot.robotId} • Model: {robot.model}
            </Text>
            {process.env.NODE_ENV === 'development' && (
              <Text fontSize="xs" color="gray.500">
                Render: {renderTime.toFixed(2)}ms
              </Text>
            )}
          </VStack>

          <Badge
            colorScheme={getStatusColor(robot.status)}
            cursor="pointer"
            onClick={handleStatusClick}
            opacity={statusLoading ? 0.6 : 1}
            title="Click to cycle status"
          >
            {statusLoading ? 'Updating...' : robot.status}
          </Badge>
        </HStack>

        {/* Battery level with monitoring */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <Text fontSize="sm" fontWeight="medium">
              Battery Level
            </Text>
            <Text fontSize="sm" color={`${getBatteryColor(robot.batteryLevel)}.500`}>
              {robot.batteryLevel}%
            </Text>
          </HStack>

          {/* Battery progress bar */}
          <Box
            width="100%"
            height="8px"
            bg="gray.200"
            _dark={{ bg: 'gray.700' }}
            borderRadius="md"
            overflow="hidden"
          >
            <Box
              width={`${robot.batteryLevel}%`}
              height="100%"
              bg={`${getBatteryColor(robot.batteryLevel)}.500`}
              transition="width 0.3s ease"
            />
          </Box>

          <HStack mt={2} gap={2}>
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleBatteryChange(-10)}
              disabled={robot.batteryLevel <= 0 || batteryLoading}
              title="Decrease battery"
            >
              -10%
            </Button>
            <Button
              size="xs"
              variant="outline"
              onClick={() => handleBatteryChange(10)}
              disabled={robot.batteryLevel >= 100 || batteryLoading}
              title="Increase battery"
            >
              +10%
            </Button>
          </HStack>
        </Box>

        {/* Location info */}
        <Box>
          <Text fontSize="sm" fontWeight="medium" mb={1}>
            Location
          </Text>
          <Text fontSize="xs" color="gray.600" _dark={{ color: 'gray.400' }}>
            Lat: {robot.location.latitude.toFixed(4)}, Lng: {robot.location.longitude.toFixed(4)}
          </Text>
        </Box>

        {/* Current order (if on delivery) */}
        {robot.status === 'On Delivery' && robot.currentOrder && (
          <Box p={3} bg="blue.50" _dark={{ bg: 'blue.900' }} borderRadius="md">
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Current Delivery
            </Text>
            <Text fontSize="xs">Order: {robot.currentOrder.orderId}</Text>
            <Text fontSize="xs">Customer: {robot.currentOrder.customerName}</Text>
            <Text fontSize="xs">
              ETA: {new Date(robot.currentOrder.estimatedDelivery).toLocaleTimeString()}
            </Text>
          </Box>
        )}

        {/* Action buttons */}
        <HStack gap={2}>
          <Button
            size="sm"
            colorScheme="orange"
            variant={robot.status === 'Returning' ? 'solid' : 'outline'}
            onClick={() => handleReturnToBase()}
            loading={returnLoading}
            disabled={robot.status === 'Returning'}
            flex={1}
          >
            {robot.status === 'Returning' ? 'Returning...' : 'Return to Base'}
          </Button>
        </HStack>

        {/* Error display */}
        {statusError && (
          <Box p={2} bg="red.50" _dark={{ bg: 'red.900' }} borderRadius="md">
            <Text fontSize="xs" color="red.600" _dark={{ color: 'red.300' }}>
              Error: {statusError.message}
            </Text>
          </Box>
        )}
      </VStack>
    </Card.Root>
  );
}

export default EnhancedRobotCard;
