import { Box, Container, Grid, Heading, Text, Button, Flex, HStack, Input } from '@chakra-ui/react';
import RobotCard from './components/RobotCard';
import StatusFilter from './components/StatusFilter';
import { NameOrStatusFilter } from './components/NameOrStatusFilter';
import { ThemeToggle } from './components/ThemeToggle';
import ErrorBoundary from './components/ErrorBoundary';
import { sampleRobots } from './types/robot';
import type { Robot, RobotStatus } from './types/robot';
import { RobotProvider, useRobotContext } from './contexts/RobotContext';
import { useState, useEffect } from 'react';
import { validateConfig } from './config/environment';
import { useLogger, PerformanceTimer } from './services/logger';
import { useWebVitals, useResourceMonitoring, useMemoryMonitoring } from './hooks/performance';
import { useOnlineStatus } from './hooks';

// Validate configuration on app start
try {
  validateConfig();
} catch (error) {
  console.error('Configuration validation failed:', error);
}

const Dashboard = () => {
  const { robots, setRobots } = useRobotContext();
  const [selectedFilter, setSelectedFilter] = useState<RobotStatus | 'All'>('All');
  const [selectedToggleFilter, setSelectedToggleFilter] = useState<'name' | 'status'>('status');
  const [nameSearchTerm, setNameSearchTerm] = useState<string>('');
  const logger = useLogger('Dashboard');
  const isOnline = useOnlineStatus();

  // Enable comprehensive monitoring
  useWebVitals();
  useResourceMonitoring();
  useMemoryMonitoring(); // Monitor component mount and initial load
  useEffect(() => {
    const timer = new PerformanceTimer('Dashboard initial load', 'Dashboard');

    logger.info('Dashboard mounted', {
      robotCount: robots.length,
      initialFilter: selectedFilter,
      isOnline,
    });

    return () => {
      timer.end();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Monitor network status changes
  useEffect(() => {
    if (!isOnline) {
      logger.warn('Dashboard operating in offline mode', {
        robotCount: robots.length,
        lastOnlineTime: Date.now(),
      });
    } else {
      logger.info('Dashboard back online', {
        robotCount: robots.length,
      });
    }
  }, [isOnline, robots.length, logger]);

  const generateNewRobot = (): Robot => {
    const robotCount = robots.length + 1;
    const statuses: Robot['status'][] = ['Idle', 'On Delivery', 'Charging', 'Error'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      robotId: `R${robotCount}D${Math.floor(Math.random() * 100)}`,
      name: `Robo-${robotCount}`,
      model: Math.random() > 0.5 ? 'V2' : 'V1',
      status: randomStatus,
      batteryLevel: Math.floor(Math.random() * 100) + 1,
      location: {
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
      },
      currentOrder: {
        orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
        customerName: `Customer ${robotCount}`,
        deliveryAddress: 'Vienna, Holloid',
        estimatedDelivery: new Date().toISOString(),
      },
    };
  };

  const handleAddRobot = () => {
    const timer = new PerformanceTimer('Add robot operation', 'Dashboard');

    try {
      const newRobot = generateNewRobot();
      setRobots([...robots, newRobot]);

      logger.userAction('Robot added', {
        robotId: newRobot.robotId,
        robotName: newRobot.name,
        robotModel: newRobot.model,
        totalRobots: robots.length + 1,
      });

      logger.info('Robot successfully added to fleet', {
        robotId: newRobot.robotId,
        fleetSize: robots.length + 1,
      });
    } catch (error) {
      logger.error('Failed to add robot', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fleetSize: robots.length,
      });
    } finally {
      timer.end();
    }
  };

  const handleRemoveRobot = () => {
    const timer = new PerformanceTimer('Remove robot operation', 'Dashboard');

    try {
      if (robots.length > 0) {
        const removedRobot = robots[robots.length - 1];
        setRobots(robots.slice(0, -1));

        logger.userAction('Robot removed', {
          robotId: removedRobot.robotId,
          robotName: removedRobot.name,
          totalRobots: robots.length - 1,
        });

        logger.info('Robot successfully removed from fleet', {
          robotId: removedRobot.robotId,
          fleetSize: robots.length - 1,
        });
      } else {
        logger.warn('Attempted to remove robot from empty fleet');
      }
    } catch (error) {
      logger.error('Failed to remove robot', {
        error: error instanceof Error ? error.message : 'Unknown error',
        fleetSize: robots.length,
      });
    } finally {
      timer.end();
    }
  };

  // Filter robots based on selected toggle and status with performance monitoring
  const filteredRobots = (() => {
    const timer = new PerformanceTimer('Robot filtering operation', 'Dashboard');

    try {
      let result: Robot[];

      if (selectedToggleFilter === 'name') {
        // When "name" toggle is selected, filter by name search term
        result =
          nameSearchTerm.trim() === ''
            ? robots
            : robots.filter(
                robot =>
                  robot.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
                  robot.robotId.toLowerCase().includes(nameSearchTerm.toLowerCase())
              );

        logger.debug('Name-based filtering applied', {
          searchTerm: nameSearchTerm,
          totalRobots: robots.length,
          filteredCount: result.length,
        });
      } else {
        // When "status" toggle is selected, filter by status
        result =
          selectedFilter === 'All'
            ? robots.slice().sort((a, b) => {
                const statusOrder: Record<RobotStatus, number> = {
                  'On Delivery': 0,
                  Idle: 1,
                  Charging: 2,
                  Returning: 3,
                  Error: 4,
                };
                return statusOrder[a.status] - statusOrder[b.status];
              })
            : robots.filter(robot => robot.status === selectedFilter);

        logger.debug('Status-based filtering applied', {
          selectedStatus: selectedFilter,
          totalRobots: robots.length,
          filteredCount: result.length,
        });
      }

      return result;
    } catch (error) {
      logger.error('Error during robot filtering', {
        error: error instanceof Error ? error.message : 'Unknown error',
        filterType: selectedToggleFilter,
        searchTerm: nameSearchTerm,
        selectedFilter,
      });
      return robots; // Fallback to unfiltered robots
    } finally {
      timer.end();
    }
  })();

  // Calculate robot counts for each status
  const robotCounts: Record<RobotStatus | 'All', number> = {
    All: robots.length,
    'On Delivery': robots.filter(robot => robot.status === 'On Delivery').length,
    Idle: robots.filter(robot => robot.status === 'Idle').length,
    Charging: robots.filter(robot => robot.status === 'Charging').length,
    Error: robots.filter(robot => robot.status === 'Error').length,
    Returning: robots.filter(robot => robot.status === 'Returning').length,
  };

  return (
    <Box
      minH="100vh"
      bg="gray.100"
      color="gray.900"
      _dark={{ bg: 'gray.800', color: 'white' }}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: {
          base: 'radial-gradient(circle at 20% 80%, rgba(147, 196, 253, 0.10) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(195, 181, 253, 0.12) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(165, 180, 252, 0.13) 0%, transparent 50%)',
          _dark:
            'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.07) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.07) 0%, transparent 50%)',
        },
        zIndex: 0,
      }}
    >
      <Container maxW="container.xl" py={8} position="relative" zIndex={1}>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          align={{ base: 'stretch', md: 'center' }}
          mb={12}
          gap={4}
        >
          <Box textAlign={{ base: 'center', md: 'left' }}>
            <Heading as="h1" size={{ base: 'xl', md: '2xl' }} mb={2} fontWeight="bold">
              Robot Fleet Dashboard
            </Heading>
            <Text
              fontSize={{ base: 'md', md: 'lg' }}
              color="gray.600"
              _dark={{ color: 'gray.400' }}
            >
              Monitor and control your delivery robots
            </Text>
          </Box>
          <HStack
            gap={2}
            justify={{ base: 'center', md: 'flex-end' }}
            width={{ base: 'full', md: 'auto' }}
          >
            <ThemeToggle />
            <Button
              onClick={handleAddRobot}
              colorScheme="green"
              size={{ base: 'sm', md: 'md' }}
              fontWeight="bold"
              px={{ base: 4, md: 6 }}
              flex={{ base: 1, md: 'none' }}
            >
              Add Robot
            </Button>
            <Button
              onClick={handleRemoveRobot}
              colorScheme="red"
              size={{ base: 'sm', md: 'md' }}
              fontWeight="bold"
              px={{ base: 4, md: 6 }}
              disabled={robots.length === 0}
              flex={{ base: 1, md: 'none' }}
            >
              Remove Robot
            </Button>
          </HStack>
        </Flex>

        <Flex
          mb={8}
          align="center"
          justify="space-between"
          gap={0}
          direction={{ base: 'column', md: 'row' }}
        >
          <NameOrStatusFilter
            selectedFilter={selectedToggleFilter}
            onFilterChange={(filter: string) =>
              setSelectedToggleFilter(filter as 'name' | 'status')
            }
          />

          {selectedToggleFilter === 'name' && (
            <Input
              placeholder="Search by robot name or ID..."
              value={nameSearchTerm}
              onChange={e => setNameSearchTerm(e.target.value)}
              width={{ base: 'full', md: '300px' }}
              size="md"
              bg="white"
              _dark={{ bg: 'gray.800' }}
              _focus={{ borderColor: 'blue.500', boxShadow: '0 0 0 1px #3182ce' }}
            />
          )}

          {selectedToggleFilter === 'status' && (
            <StatusFilter
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              robotCounts={robotCounts}
            />
          )}
        </Flex>

        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={8}>
          {filteredRobots.map(robot => (
            <Box key={robot.robotId} h="full">
              <RobotCard robot={robot} />
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <RobotProvider initialRobots={sampleRobots}>
        <Dashboard />
      </RobotProvider>
    </ErrorBoundary>
  );
}

export default App;
