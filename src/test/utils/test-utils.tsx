import React, { type ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import { RobotProvider } from '../../contexts/RobotContext';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ChakraProvider value={defaultSystem}>
      <RobotProvider>{children}</RobotProvider>
    </ChakraProvider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
