import { Box, Flex, Text } from "@chakra-ui/react";
import type { RobotStatus } from "../types/robot";

interface StatusFilterProps {
  selectedFilter: RobotStatus | "All";
  onFilterChange: (filter: RobotStatus | "All") => void;
  robotCounts: Record<RobotStatus | "All", number>;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ selectedFilter, onFilterChange, robotCounts }) => {
  const statusOptions: Array<RobotStatus | "All"> = ["All", "On Delivery", "Idle", "Charging", "Error", "Returning"];

  return (
    <Box mb={0}>
      <Flex
        direction={{ base: "column", md: "row" }}
        align={{ base: "stretch", md: "center" }}
        justify={{ base: "center", md: "flex-end" }}
        gap={4}
      >
        <Text
          fontSize="lg"
          fontWeight="semibold"
          color="gray.900"
          _dark={{ color: "white" }}
          textAlign={{ base: "center", md: "right" }}
        >
          Filter by Status:
        </Text>
        <Box>
          <select
            value={selectedFilter}
            onChange={(e) => onFilterChange(e.target.value as RobotStatus | "All")}
            style={{
              width: "200px",
              padding: "8px 12px",
              fontSize: "16px",
              borderRadius: "6px",
              cursor: "pointer",
              outline: "none",
              backgroundColor: "white",
              border: "1px solid #E2E8F0",
              color: "#1A202C",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#3182ce";
              e.target.style.boxShadow = "0 0 0 1px #3182ce";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E2E8F0";
              e.target.style.boxShadow = "none";
            }}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status} ({robotCounts[status] || 0})
              </option>
            ))}
          </select>
        </Box>
      </Flex>
    </Box>
  );
};

export default StatusFilter;
