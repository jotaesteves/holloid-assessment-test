import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { Robot, RobotStatus } from "../types/robot";

interface RobotContextType {
  robots: Robot[];
  updateBatteryLevel: (robotId: string, newLevel: number) => void;
  returnRobotToBase: (robotId: string) => void;
  setRobots: (robots: Robot[]) => void;
  updateRobotStatus?: (robotId: string, newStatus: RobotStatus) => void;
}

const RobotContext = createContext<RobotContextType | undefined>(undefined);

interface RobotProviderProps {
  children: ReactNode;
  initialRobots?: Robot[];
}

export const RobotProvider: React.FC<RobotProviderProps> = ({ children, initialRobots = [] }) => {
  const [robots, setRobots] = useState<Robot[]>(initialRobots);

  const updateBatteryLevel = (robotId: string, newLevel: number) => {
    setRobots((prevRobots) =>
      prevRobots.map((robot) =>
        robot.robotId === robotId ? { ...robot, batteryLevel: Math.max(0, Math.min(100, newLevel)) } : robot
      )
    );
  };

  const returnRobotToBase = (robotId: string) => {
    setRobots((prevRobots) =>
      prevRobots.map((robot) => (robot.robotId === robotId ? { ...robot, status: "Returning" as const } : robot))
    );
  };

  const updateRobotStatus = (robotId: string, newStatus: RobotStatus) => {
    setRobots((prevRobots) =>
      prevRobots.map((robot) =>
        robot.robotId === robotId ? { ...robot, status: newStatus as Robot["status"] } : robot
      )
    );
  };

  const value: RobotContextType = {
    robots,
    updateBatteryLevel,
    updateRobotStatus,
    returnRobotToBase,
    setRobots,
  };

  return <RobotContext.Provider value={value}>{children}</RobotContext.Provider>;
};

export const useRobotContext = () => {
  const context = useContext(RobotContext);
  if (context === undefined) {
    throw new Error("useRobotContext must be used within a RobotProvider");
  }
  return context;
};
