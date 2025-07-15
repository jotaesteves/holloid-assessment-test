import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // In production, you would send this to your error reporting service
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry, LogRocket, or custom error reporting
      // captureException(error, { extra: errorInfo });
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box
          minH="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={8}
          bg="gray.50"
          _dark={{ bg: 'gray.900' }}
        >
          <Box maxW="600px" textAlign="center" spaceY={6}>
            <Box
              bg="red.50"
              border="1px solid"
              borderColor="red.200"
              borderRadius="lg"
              p={6}
              _dark={{ bg: 'red.900', borderColor: 'red.700' }}
            >
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="red.600"
                mb={2}
                _dark={{ color: 'red.300' }}
              >
                ⚠️ Something went wrong!
              </Text>
              <Text color="red.600" _dark={{ color: 'red.300' }}>
                The application encountered an unexpected error. Please try refreshing the page or
                contact support if the problem persists.
              </Text>
            </Box>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Box
                as="pre"
                fontSize="sm"
                bg="gray.100"
                p={4}
                borderRadius="md"
                overflow="auto"
                maxH="300px"
                w="full"
                textAlign="left"
                border="1px solid"
                borderColor="gray.200"
                _dark={{ bg: 'gray.800', borderColor: 'gray.700' }}
              >
                {this.state.error.toString()}
                {this.state.errorInfo?.componentStack}
              </Box>
            )}

            <Box display="flex" flexDirection="column" gap={3} alignItems="center">
              <Button colorScheme="blue" onClick={this.handleReset}>
                Try Again
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
