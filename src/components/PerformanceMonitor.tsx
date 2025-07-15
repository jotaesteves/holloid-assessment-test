/**
 * Performance monitoring component
 */

import { useEffect } from 'react';
import { useLogger, PerformanceTimer } from '../services/logger';

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
  threshold?: number; // ms threshold for slow render warning
}

/**
 * Higher-order component for performance monitoring
 */
export function PerformanceMonitor({
  componentName,
  children,
  threshold = 100,
}: PerformanceMonitorProps) {
  const logger = useLogger('PerformanceMonitor');

  useEffect(() => {
    const timer = new PerformanceTimer(`${componentName} mount`);

    return () => {
      const duration = timer.end();

      if (duration > threshold) {
        logger.warn(`Slow component mount detected: ${componentName}`, {
          duration,
          threshold,
        });
      }
    };
  }, [componentName, threshold, logger]);

  return <>{children}</>;
}
