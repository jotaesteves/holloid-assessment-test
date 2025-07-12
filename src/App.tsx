import { Box, Container, Grid, Heading, Text, Button, Flex, HStack, Input } from "@chakra-ui/react";
import RobotCard from "./components/RobotCard";
import StatusFilter from "./components/StatusFilter";
import { NameOrStatusFilter } from "./components/NameOrStatusFilter";
import { ThemeToggle } from "./components/ThemeToggle";
import { sampleRobots } from "./types/robot";
import type { Robot, RobotStatus } from "./types/robot";
import { RobotProvider, useRobotContext } from "./contexts/RobotContext";
import { useState } from "react";

const Dashboard = () => {
  const { robots, setRobots } = useRobotContext();
  const [selectedFilter, setSelectedFilter] = useState<RobotStatus | "All">("All");
  const [selectedToggleFilter, setSelectedToggleFilter] = useState<"name" | "status">("status");
  const [nameSearchTerm, setNameSearchTerm] = useState<string>("");

  const generateNewRobot = (): Robot => {
    const robotCount = robots.length + 1;
    const statuses: Robot["status"][] = ["Idle", "On Delivery", "Charging", "Error"];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    return {
      robotId: `R${robotCount}D${Math.floor(Math.random() * 100)}`,
      name: `Robo-${robotCount}`,
      model: Math.random() > 0.5 ? "V2" : "V1",
      status: randomStatus,
      batteryLevel: Math.floor(Math.random() * 100) + 1,
      location: {
        latitude: Math.random() * 180 - 90,
        longitude: Math.random() * 360 - 180,
      },
      currentOrder: {
        orderId: `ORD-${Math.floor(Math.random() * 10000)}`,
        customerName: `Customer ${robotCount}`,
        deliveryAddress: "Vienna, Holloid",
        estimatedDelivery: new Date().toISOString(),
      },
    };
  };

  const handleAddRobot = () => {
    const newRobot = generateNewRobot();
    setRobots([...robots, newRobot]);
  };

  const handleRemoveRobot = () => {
    if (robots.length > 0) {
      setRobots(robots.slice(0, -1));
    }
  };

  // Filter robots based on selected toggle and status
  const filteredRobots = (() => {
    if (selectedToggleFilter === "name") {
      // When "name" toggle is selected, filter by name search term
      return nameSearchTerm.trim() === ""
        ? robots
        : robots.filter(
            (robot) =>
              robot.name.toLowerCase().includes(nameSearchTerm.toLowerCase()) ||
              robot.robotId.toLowerCase().includes(nameSearchTerm.toLowerCase())
          );
    } else {
      // When "status" toggle is selected, filter by status
      return selectedFilter === "All"
        ? robots.slice().sort((a, b) => {
            const statusOrder: Record<RobotStatus, number> = {
              "On Delivery": 0,
              Idle: 1,
              Charging: 2,
              Returning: 3,
              Error: 4,
            };
            return statusOrder[a.status] - statusOrder[b.status];
          })
        : robots.filter((robot) => robot.status === selectedFilter);
    }
  })();

  // Calculate robot counts for each status
  const robotCounts: Record<RobotStatus | "All", number> = {
    All: robots.length,
    "On Delivery": robots.filter((robot) => robot.status === "On Delivery").length,
    Idle: robots.filter((robot) => robot.status === "Idle").length,
    Charging: robots.filter((robot) => robot.status === "Charging").length,
    Error: robots.filter((robot) => robot.status === "Error").length,
    Returning: robots.filter((robot) => robot.status === "Returning").length,
  };

  return (
    <Box
      minH="100vh"
      bg="gray.50"
      color="gray.900"
      _dark={{ bg: "gray.900", color: "white" }}
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: {
          base: "radial-gradient(circle at 20% 80%, rgba(147, 196, 253, 0.154) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(195, 181, 253, 0.171) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(165, 180, 252, 0.178) 0%, transparent 50%)",
          _dark:
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)",
        },
        zIndex: 0,
      }}
    >
      <Container maxW="container.xl" py={8} position="relative" zIndex={1}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "stretch", md: "center" }}
          mb={12}
          gap={4}
        >
          <Box textAlign={{ base: "center", md: "left" }}>
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={2} fontWeight="bold">
              Robot Fleet Dashboard
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" _dark={{ color: "gray.400" }}>
              Monitor and control your delivery robots
            </Text>
          </Box>
          <HStack gap={2} justify={{ base: "center", md: "flex-end" }} width={{ base: "full", md: "auto" }}>
            <ThemeToggle />
            <Button
              onClick={handleAddRobot}
              colorScheme="green"
              size={{ base: "sm", md: "md" }}
              fontWeight="bold"
              px={{ base: 4, md: 6 }}
              flex={{ base: 1, md: "none" }}
            >
              Add Robot
            </Button>
            <Button
              onClick={handleRemoveRobot}
              colorScheme="red"
              size={{ base: "sm", md: "md" }}
              fontWeight="bold"
              px={{ base: 4, md: 6 }}
              disabled={robots.length === 0}
              flex={{ base: 1, md: "none" }}
            >
              Remove Robot
            </Button>
          </HStack>
        </Flex>

        <Flex mb={8} align="center" justify="space-between" gap={0} direction={{ base: "column", md: "row" }}>
          <NameOrStatusFilter
            selectedFilter={selectedToggleFilter}
            onFilterChange={(filter: string) => setSelectedToggleFilter(filter as "name" | "status")}
          />

          {selectedToggleFilter === "name" && (
            <Input
              placeholder="Search by robot name or ID..."
              value={nameSearchTerm}
              onChange={(e) => setNameSearchTerm(e.target.value)}
              width={{ base: "full", md: "300px" }}
              size="md"
              bg="white"
              _dark={{ bg: "gray.800" }}
              _focus={{ borderColor: "blue.500", boxShadow: "0 0 0 1px #3182ce" }}
            />
          )}

          {selectedToggleFilter === "status" && (
            <StatusFilter
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              robotCounts={robotCounts}
            />
          )}
        </Flex>

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={8}>
          {filteredRobots.map((robot) => (
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
    <RobotProvider initialRobots={sampleRobots}>
      <Dashboard />
    </RobotProvider>
  );
}

export default App;
