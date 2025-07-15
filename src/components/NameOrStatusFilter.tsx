import { Button, HStack } from '@chakra-ui/react';

export const NameOrStatusFilter: React.FC<{
  selectedFilter: 'name' | 'status';
  onFilterChange: (filter: string) => void;
}> = ({ selectedFilter, onFilterChange }) => {
  const handleFilterChange = (filter: string) => {
    onFilterChange(filter);
  };

  return (
    <HStack gap={0} mb={0}>
      <Button
        onClick={() => handleFilterChange('name')}
        variant={selectedFilter === 'name' ? 'solid' : 'outline'}
        colorScheme={selectedFilter === 'name' ? 'blue' : 'gray'}
        size="md"
        fontWeight="medium"
        px={6}
        _hover={{
          transform: 'translateY(-1px)',
          boxShadow: 'sm',
        }}
        transition="all 0.2s"
      >
        Name
      </Button>
      <Button
        onClick={() => handleFilterChange('status')}
        variant={selectedFilter === 'status' ? 'solid' : 'outline'}
        colorScheme={selectedFilter === 'status' ? 'blue' : 'gray'}
        size="md"
        fontWeight="medium"
        px={6}
        _hover={{
          transform: 'translateY(-1px)',
          boxShadow: 'sm',
        }}
        transition="all 0.2s"
      >
        Status
      </Button>
    </HStack>
  );
};
