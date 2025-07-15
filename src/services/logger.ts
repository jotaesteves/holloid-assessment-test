/**
 * Centralized logging service with different levels and optional remote logging
 */

import { config, isDevelopment } from '../config/environment';

export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

export type LogLevel = (typeof LogLevel)[keyof typeof LogLevel];

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: string;
  component?: string;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logLevel: LogLevel;
  private sessionId: string;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 100;

  constructor() {
    this.logLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatMessage(level: LogLevel, message: string, component?: string): string {
    const timestamp = new Date().toISOString();
    const levelName =
      Object.keys(LogLevel).find(key => LogLevel[key as keyof typeof LogLevel] === level) ||
      'UNKNOWN';
    const componentPrefix = component ? `[${component}]` : '';
    return `${timestamp} ${levelName} ${componentPrefix} ${message}`;
  }

  private createLogEntry(
    level: LogLevel,
    message: string,
    data?: unknown,
    component?: string
  ): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      component,
      sessionId: this.sessionId,
    };
  }

  private addToBuffer(entry: LogEntry): void {
    this.logBuffer.push(entry);

    // Keep buffer size manageable
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    if (!config.features.errorReporting || isDevelopment) {
      return;
    }

    try {
      // In production, send to logging service (e.g., DataDog, LogRocket, etc.)
      await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.warn('Failed to send log to remote service:', error);
    }
  }

  private log(level: LogLevel, message: string, data?: unknown, component?: string): void {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry = this.createLogEntry(level, message, data, component);
    const formattedMessage = this.formatMessage(level, message, component);

    // Console output based on level
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage, data);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage, data);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage, data);
        break;
      case LogLevel.ERROR:
        console.error(formattedMessage, data);
        break;
    }

    this.addToBuffer(entry);

    // Send critical logs to remote service
    if (level >= LogLevel.ERROR) {
      this.sendToRemote(entry);
    }
  }

  debug(message: string, data?: unknown, component?: string): void {
    this.log(LogLevel.DEBUG, message, data, component);
  }

  info(message: string, data?: unknown, component?: string): void {
    this.log(LogLevel.INFO, message, data, component);
  }

  warn(message: string, data?: unknown, component?: string): void {
    this.log(LogLevel.WARN, message, data, component);
  }

  error(message: string, data?: unknown, component?: string): void {
    this.log(LogLevel.ERROR, message, data, component);
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, component?: string): void {
    this.info(`Performance: ${operation} took ${duration}ms`, { duration, operation }, component);
  }

  /**
   * Log user interactions
   */
  userAction(action: string, data?: unknown, component?: string): void {
    this.info(`User Action: ${action}`, data, component);
  }

  /**
   * Get recent logs (useful for debugging)
   */
  getRecentLogs(count = 50): LogEntry[] {
    return this.logBuffer.slice(-count);
  }

  /**
   * Clear log buffer
   */
  clearLogs(): void {
    this.logBuffer = [];
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get session ID
   */
  getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
export const logger = new Logger();

/**
 * Performance measurement utility
 */
export class PerformanceTimer {
  private startTime: number;
  private operation: string;
  private component?: string;

  constructor(operation: string, component?: string) {
    this.operation = operation;
    this.component = component;
    this.startTime = performance.now();
  }

  end(): number {
    const duration = performance.now() - this.startTime;
    logger.performance(this.operation, duration, this.component);
    return duration;
  }
}

/**
 * Decorator for automatic performance logging
 */
export function logPerformance(component?: string) {
  return function (target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      const timer = new PerformanceTimer(
        `${target?.constructor?.name || 'Unknown'}.${propertyKey}`,
        component
      );

      try {
        const result = originalMethod.apply(this, args);

        // Handle async methods
        if (result instanceof Promise) {
          return result.finally(() => timer.end());
        }

        timer.end();
        return result;
      } catch (error) {
        timer.end();
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Hook for component logging
 */
export function useLogger(component: string) {
  return {
    debug: (message: string, data?: unknown) => logger.debug(message, data, component),
    info: (message: string, data?: unknown) => logger.info(message, data, component),
    warn: (message: string, data?: unknown) => logger.warn(message, data, component),
    error: (message: string, data?: unknown) => logger.error(message, data, component),
    userAction: (action: string, data?: unknown) => logger.userAction(action, data, component),
    performance: (operation: string, duration: number) =>
      logger.performance(operation, duration, component),
  };
}
