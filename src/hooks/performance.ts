/**
 * Performance monitoring hooks
 */

import { useEffect } from 'react';
import { useLogger } from '../services/logger';
import { config } from '../config/environment';

/**
 * Web Vitals monitoring
 */
export function useWebVitals() {
  const logger = useLogger('WebVitals');

  useEffect(() => {
    if (!config.features.analytics) return;

    // First Contentful Paint (FCP)
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        if (entry.name === 'first-contentful-paint') {
          logger.info('FCP Measured', { fcp: entry.startTime });
        }
      });
    });

    observer.observe({ entryTypes: ['paint'] });

    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries();
      if (entries.length > 0) {
        const lastEntry = entries[entries.length - 1];
        logger.info('LCP Measured', { lcp: lastEntry.startTime });
      }
    });

    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay (FID) - approximation
    let firstInputTime: number | null = null;
    const handleFirstInput = (event: Event) => {
      if (firstInputTime === null) {
        firstInputTime = performance.now();
        logger.info('First Input Detected', {
          type: event.type,
          timestamp: firstInputTime,
        });

        // Remove listener after first input
        ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
          document.removeEventListener(type, handleFirstInput, true);
        });
      }
    };

    ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
      document.addEventListener(type, handleFirstInput, true);
    });

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
      ['mousedown', 'keydown', 'touchstart', 'pointerdown'].forEach(type => {
        document.removeEventListener(type, handleFirstInput, true);
      });
    };
  }, [logger]);
}

/**
 * Resource loading performance monitoring
 */
export function useResourceMonitoring() {
  const logger = useLogger('ResourceMonitoring');

  useEffect(() => {
    const observer = new PerformanceObserver(list => {
      list.getEntries().forEach(entry => {
        const resourceEntry = entry as PerformanceResourceTiming;

        // Log slow resources
        if (resourceEntry.duration > 1000) {
          logger.warn('Slow resource loading detected', {
            name: resourceEntry.name,
            duration: resourceEntry.duration,
            size: resourceEntry.transferSize || 0,
            type: resourceEntry.initiatorType,
          });
        }

        // Log large resources
        if (resourceEntry.transferSize && resourceEntry.transferSize > 500000) {
          // 500KB
          logger.warn('Large resource detected', {
            name: resourceEntry.name,
            size: resourceEntry.transferSize,
            duration: resourceEntry.duration,
          });
        }
      });
    });

    observer.observe({ entryTypes: ['resource'] });

    return () => observer.disconnect();
  }, [logger]);
}

/**
 * Memory usage monitoring
 */
export function useMemoryMonitoring() {
  const logger = useLogger('MemoryMonitoring');

  useEffect(() => {
    if (!('memory' in performance)) {
      logger.debug('Memory API not available');
      return;
    }

    const checkMemory = () => {
      const memory = (
        performance as unknown as {
          memory: {
            usedJSHeapSize: number;
            totalJSHeapSize: number;
            jsHeapSizeLimit: number;
          };
        }
      ).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
      const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);

      logger.debug('Memory usage', {
        used: usedMB,
        total: totalMB,
        limit: limitMB,
        usage: Math.round((usedMB / limitMB) * 100),
      });

      // Warn if memory usage is high
      if (usedMB / limitMB > 0.8) {
        logger.warn('High memory usage detected', {
          used: usedMB,
          limit: limitMB,
          percentage: Math.round((usedMB / limitMB) * 100),
        });
      }
    };

    // Check memory every 30 seconds
    const interval = setInterval(checkMemory, 30000);

    // Initial check
    checkMemory();

    return () => clearInterval(interval);
  }, [logger]);
}

/**
 * Bundle size analyzer hook
 */
export function useBundleAnalysis() {
  const logger = useLogger('BundleAnalysis');

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Analyze loaded modules
    const analyzeBundle = () => {
      const scripts = Array.from(document.scripts);
      let totalSize = 0;

      scripts.forEach(script => {
        if (script.src) {
          fetch(script.src, { method: 'HEAD' })
            .then(response => {
              const size = parseInt(response.headers.get('content-length') || '0');
              totalSize += size;

              if (size > 100000) {
                // 100KB
                logger.warn('Large script detected', {
                  src: script.src,
                  size: Math.round(size / 1024) + 'KB',
                });
              }
            })
            .catch(() => {
              // Ignore CORS errors for external scripts
            });
        }
      });

      // Log total bundle size estimate
      setTimeout(() => {
        if (totalSize > 0) {
          logger.info('Estimated bundle size', {
            totalSize: Math.round(totalSize / 1024) + 'KB',
          });
        }
      }, 1000);
    };

    // Run analysis after page load
    if (document.readyState === 'complete') {
      analyzeBundle();
    } else {
      window.addEventListener('load', analyzeBundle);
      return () => window.removeEventListener('load', analyzeBundle);
    }
  }, [logger]);
}
