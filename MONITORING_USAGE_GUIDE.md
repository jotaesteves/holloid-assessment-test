# 📊 Monitoring Features Usage Guide

This guide explains how to use the comprehensive monitoring features added to
the Robot Fleet Dashboard.

## 🎯 Quick Start

### 1. Enable Monitoring Features

First, ensure monitoring is enabled in your environment configuration:

```bash
# In .env.development or .env.production
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_ERROR_REPORTING=true
VITE_ENABLE_DEBUG=true
```

### 2. Basic Component Monitoring

Add monitoring to any React component:

```tsx
import { useLogger } from '../services/logger';
import { useWebVitals, useResourceMonitoring } from '../hooks/performance';

function MyComponent() {
  const logger = useLogger('MyComponent');

  // Enable performance monitoring
  useWebVitals();
  useResourceMonitoring();

  const handleUserAction = () => {
    logger.userAction('Button clicked', { buttonId: 'submit' });
    // Your action logic here
  };

  return <button onClick={handleUserAction}>Submit</button>;
}
```

## 🔧 Detailed Feature Usage

### 1. Logging Service

#### Basic Logging

```tsx
import { useLogger } from '../services/logger';

function Dashboard() {
  const logger = useLogger('Dashboard');

  // Different log levels
  logger.debug('Debug information', { data: 'some debug data' });
  logger.info('Information message', { userId: '123' });
  logger.warn('Warning message', { issue: 'potential problem' });
  logger.error('Error occurred', { error: 'error details' });

  return <div>Dashboard content</div>;
}
```

#### User Action Tracking

```tsx
const handleRobotAction = (robotId: string, action: string) => {
  logger.userAction(`Robot ${action}`, {
    robotId,
    action,
    timestamp: Date.now(),
  });

  // Your business logic
  performRobotAction(robotId, action);
};
```

#### Performance Logging

```tsx
import { PerformanceTimer } from '../services/logger';

const processData = async data => {
  const timer = new PerformanceTimer('Data processing', 'DataProcessor');

  try {
    // Your processing logic
    const result = await heavyComputation(data);
    return result;
  } finally {
    timer.end(); // Automatically logs duration
  }
};
```

### 2. Performance Monitoring Hooks

#### Web Vitals Monitoring

```tsx
import { useWebVitals } from '../hooks/performance';

function App() {
  // Automatically tracks FCP, LCP, and FID
  useWebVitals();

  return <YourAppContent />;
}
```

#### Resource Loading Monitoring

```tsx
import { useResourceMonitoring } from '../hooks/performance';

function DataIntensiveComponent() {
  // Monitors slow/large resource loading
  useResourceMonitoring();

  return <ComponentWithManyAssets />;
}
```

#### Memory Usage Monitoring

```tsx
import { useMemoryMonitoring } from '../hooks/performance';

function MemoryIntensiveComponent() {
  // Monitors memory usage and warns on high usage
  useMemoryMonitoring();

  return <ComponentWithLargeData />;
}
```

#### Bundle Analysis (Development Only)

```tsx
import { useBundleAnalysis } from '../hooks/performance';

function App() {
  // Analyzes bundle size in development
  useBundleAnalysis();

  return <YourApp />;
}
```

### 3. Error Monitoring with ErrorBoundary

The ErrorBoundary is already integrated in your App.tsx, but you can also use it
for specific components:

```tsx
import ErrorBoundary from '../components/ErrorBoundary';

function CriticalSection() {
  return (
    <ErrorBoundary>
      <RiskyComponent />
    </ErrorBoundary>
  );
}

// Custom fallback UI
function CustomErrorFallback() {
  return (
    <div>
      <h2>Oops! Something went wrong in this section</h2>
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
  );
}

function SectionWithCustomError() {
  return (
    <ErrorBoundary fallback={<CustomErrorFallback />}>
      <AnotherRiskyComponent />
    </ErrorBoundary>
  );
}
```

### 4. Enhanced Custom Hooks for Monitoring

#### Async Operations with Monitoring

```tsx
import { useAsync } from '../hooks';

function DataComponent() {
  const { data, loading, error, execute } = useAsync(
    async (robotId: string) => {
      // This automatically logs performance and errors
      const response = await fetch(`/api/robots/${robotId}`);
      return response.json();
    }
  );

  const loadRobot = (id: string) => {
    execute(id); // Automatically monitored
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>Data: {JSON.stringify(data)}</div>;
}
```

#### Network Status Monitoring

```tsx
import { useOnlineStatus } from '../hooks';

function NetworkAwareComponent() {
  const isOnline = useOnlineStatus();

  if (!isOnline) {
    return <div>⚠️ You're offline. Some features may not work.</div>;
  }

  return <div>Connected ✅</div>;
}
```

## 🎮 Real-World Implementation Example

Here's how to add comprehensive monitoring to your Robot Card component:

```tsx
import { useLogger, PerformanceTimer } from '../services/logger';
import { useResourceMonitoring } from '../hooks/performance';
import { useAsync } from '../hooks';

function EnhancedRobotCard({ robot }: { robot: Robot }) {
  const logger = useLogger('RobotCard');

  // Monitor resource loading for this component
  useResourceMonitoring();

  // Monitored async operations
  const { execute: updateStatus } = useAsync(
    async (robotId: string, status: RobotStatus) => {
      return await robotApi.updateRobotStatus(robotId, status);
    }
  );

  const handleStatusChange = async (newStatus: RobotStatus) => {
    const timer = new PerformanceTimer('Status update', 'RobotCard');

    try {
      logger.userAction('Status change initiated', {
        robotId: robot.robotId,
        oldStatus: robot.status,
        newStatus,
      });

      await updateStatus(robot.robotId, newStatus);

      logger.info('Status updated successfully', {
        robotId: robot.robotId,
        newStatus,
      });
    } catch (error) {
      logger.error('Status update failed', {
        robotId: robot.robotId,
        newStatus,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      timer.end();
    }
  };

  return (
    <div>
      {/* Your robot card UI */}
      <button onClick={() => handleStatusChange('Idle')}>Set Idle</button>
    </div>
  );
}
```

## 📈 Monitoring Dashboard

To view monitoring data, check your browser's console for logged information:

### Development Mode

```javascript
// View recent logs
console.log(logger.getRecentLogs(20));

// View session ID
console.log(logger.getSessionId());

// Clear logs
logger.clearLogs();
```

### Production Mode

In production, logs are automatically sent to your configured logging service.
The current setup supports:

- **Console logging** (always enabled)
- **Remote logging** (for errors in production)
- **Local log buffer** (last 100 entries)

## 🔧 Configuration Options

### Environment Variables

```bash
# Enable/disable features
VITE_ENABLE_ANALYTICS=true          # Web vitals monitoring
VITE_ENABLE_ERROR_REPORTING=true    # Remote error reporting
VITE_ENABLE_DEBUG=true              # Debug logging

# API configuration for remote logging
VITE_API_BASE_URL=https://your-api.com
VITE_API_TIMEOUT=10000
```

### Log Level Configuration

```typescript
import { logger, LogLevel } from '../services/logger';

// Set log level programmatically
logger.setLogLevel(LogLevel.WARN); // Only WARN and ERROR will be logged
```

## 📊 What Gets Monitored

### Automatically Tracked

- ✅ **Web Vitals**: FCP, LCP, FID
- ✅ **Resource Loading**: Slow/large assets
- ✅ **Memory Usage**: High memory consumption warnings
- ✅ **Network Status**: Online/offline detection
- ✅ **Errors**: JavaScript errors and boundaries
- ✅ **Performance**: Component render times

### Manually Tracked

- 🎯 **User Actions**: Button clicks, form submissions
- 🎯 **Business Logic**: Custom operations and workflows
- 🎯 **API Calls**: Request/response monitoring
- 🎯 **Custom Metrics**: Application-specific measurements

## 🚀 Production Deployment

For production monitoring, integrate with services like:

1. **Error Reporting**: Sentry, LogRocket, Bugsnag
2. **Analytics**: Google Analytics, Mixpanel
3. **Performance**: DataDog, New Relic
4. **Logging**: CloudWatch, Loggly

Update the logger service to send data to your chosen service:

```typescript
// In src/services/logger.ts
private async sendToRemote(entry: LogEntry): Promise<void> {
  if (!config.features.errorReporting) return;

  // Replace with your monitoring service
  await fetch('/api/logs', {
    method: 'POST',
    body: JSON.stringify(entry),
  });
}
```

This monitoring setup provides comprehensive insights into your application's
performance, errors, and user behavior, making it production-ready for
enterprise use.
