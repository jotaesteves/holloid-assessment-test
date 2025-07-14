# Robot Fleet Dashboard

[![CI](https://github.com/jotaesteves/holloid-assessment-test/actions/workflows/ci.yml/badge.svg)](https://github.com/jotaesteves/holloid-assessment-test/actions/workflows/ci.yml) [![Required Checks](https://github.com/jotaesteves/holloid-assessment-test/actions/workflows/required-checks.yml/badge.svg)](https://github.com/jotaesteves/holloid-assessment-test/actions/workflows/required-checks.yml) [![PR Validation](https://github.com/jotaesteves/holloid-assessment-test/actions/workflows/pr-validation.yml/badge.svg)](https://github.com/jotaesteves/holloid-assessment-test/actions/workflows/pr-validation.yml) [![codecov](https://codecov.io/gh/jotaesteves/holloid-assessment-test/branch/main/graph/badge.svg)](https://codecov.io/gh/jotaesteves/holloid-assessment-test) [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/) [![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/) [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/) [![Chakra UI](https://img.shields.io/badge/Chakra--UI-319795?style=flat&logo=chakra-ui&logoColor=white)](https://chakra-ui.com/) [![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern, responsive React dashboard for monitoring and controlling delivery robots. Built with React, TypeScript, Vite, and Chakra UI.

![Robot Fleet Dashboard](./screenshot.png)

## Features

- **Real-time Robot Monitoring**: View robot status, battery levels, and current deliveries
- **Interactive Controls**: Return robots to base with a single click
- **Dynamic Fleet Management**: Add and remove robots from the fleet
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Built with Chakra UI for a clean, professional interface
- **TypeScript Support**: Full type safety throughout the application

## Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Chakra UI v3
- **Styling**: Emotion (CSS-in-JS)
- **Icons**: Framer Motion for animations
- **Development**: ESLint for code quality
- **Testing**: Vitest with React Testing Library
- **CI/CD**: GitHub Actions with automated testing and coverage reporting

## Quality Assurance

This project maintains high code quality through:

- **🧪 Comprehensive Testing**: 52+ unit tests covering all components and utilities
- **📊 Code Coverage**: Minimum 80% coverage across lines, functions, branches, and statements
- **🔍 Type Safety**: Full TypeScript implementation with strict type checking
- **🚀 CI/CD Pipeline**: Automated testing on every pull request
- **📝 Code Linting**: ESLint with React and TypeScript best practices
- **🔄 Cross-platform Testing**: Validated on Ubuntu, Windows, and macOS
- **📈 Multiple Node.js Versions**: Tested on Node.js 18.x, 20.x, and 21.x

### Test Coverage Report

Current test coverage:

- **Components**: All React components have corresponding test files
- **Context**: RobotContext state management fully tested
- **Utilities**: Helper functions and color utilities covered
- **Integration**: Component interactions and user workflows tested

## Project Structure

```text
src/
├── components/
│   └── RobotCard.tsx      # Individual robot card component
├── types/
│   └── robot.ts           # TypeScript interfaces and sample data
├── App.tsx                # Main application component
├── main.tsx               # Application entry point
└── index.css              # Global styles
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run lint` - Run ESLint code analysis
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Generate test coverage report

## Robot Data Structure

Each robot contains the following information:

```typescript
interface Robot {
  robotId: string;
  name: string;
  model: string;
  status: "On Delivery" | "Idle" | "Charging" | "Error" | "Returning";
  batteryLevel: number;
  location: {
    latitude: number;
    longitude: number;
  };
  currentOrder: {
    orderId: string;
    customerName: string;
    deliveryAddress: string;
    estimatedDelivery: string;
  };
}
```

## Features in Detail

### Robot Cards

- Display robot name, ID, and current status
- Show battery level with color-coded progress indicator
- Display current delivery information
- Status badges with color coding (Green: Idle, Blue: On Delivery, Orange: Returning, etc.)

### Fleet Management

- **Add Robot**: Generates new robots with random properties
- **Remove Robot**: Removes robots from the fleet
- **Return to Base**: Individual robot control

### Responsive Design

- Mobile-first approach with breakpoints for tablet and desktop
- Adaptive button sizing and layout
- Optimized touch interactions for mobile devices

## Development

This project uses modern React patterns and TypeScript for type safety. The codebase follows these principles:

- **Component-based architecture** for maintainability
- **TypeScript interfaces** for type safety
- **Responsive design** using Chakra UI's responsive props
- **State management** with React hooks
- **Modern CSS** with Chakra UI's design system

## Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm run test:run`)
5. Verify code coverage meets requirements (`npm run test:coverage`)
6. Run linting (`npm run lint`)
7. Commit your changes (`git commit -m 'Add some amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

### Pull Request Requirements

All pull requests must pass the following automated checks:

- ✅ **Tests**: All unit tests must pass
- ✅ **Coverage**: Code coverage must meet minimum thresholds (80%)
- ✅ **Linting**: Code must pass ESLint checks
- ✅ **Type Safety**: TypeScript compilation must succeed
- ✅ **Build**: Production build must complete successfully

The CI/CD pipeline will automatically run these checks and provide feedback on your pull request.

## License

This project is part of a coding assessment and is for demonstration purposes.
