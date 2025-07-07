import { useState } from "react";
import { Box, Container, Grid, Heading, Text, Button, Flex, HStack } from "@chakra-ui/react";
import RobotCard from "./components/RobotCard";
import { sampleRobots } from "./types/robot";
import type { Robot } from "./types/robot";

function App() {
  const [robots, setRobots] = useState<Robot[]>(sampleRobots);

  const handleReturnToBase = (robotId: string) => {
    setRobots((prevRobots) =>
      prevRobots.map((robot) => (robot.robotId === robotId ? { ...robot, status: "Returning" as const } : robot))
    );
  };

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
    setRobots((prevRobots) => [...prevRobots, newRobot]);
  };

  const handleRemoveRobot = () => {
    if (robots.length > 0) {
      setRobots((prevRobots) => prevRobots.slice(0, -1));
    }
  };

  return (
    <Box
      minH="100vh"
      bg="linear-gradient(135deg, #e2e2e2 0%, #dbdbdb 25%, #eeeeee 50%, #e1e1e1 100%)"
      color="gray.800"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "radial-gradient(circle at 20% 80%, rgba(147, 196, 253, 0.154) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(195, 181, 253, 0.171) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(165, 180, 252, 0.178) 0%, transparent 50%)",
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
            <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={2} fontWeight="bold" color="black">
              Robot Fleet Dashboard
            </Heading>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.800">
              Monitor and control your delivery robots
            </Text>
          </Box>
          <HStack gap={2} justify={{ base: "center", md: "flex-end" }} width={{ base: "full", md: "auto" }}>
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

        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={8}>
          {robots.map((robot) => (
            <Box key={robot.robotId} h="full">
              <RobotCard robot={robot} onReturnToBase={handleReturnToBase} />
            </Box>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default App;
