/**
 * Environment configuration utility
 * Centralizes environment variable access with type safety and validation
 */

interface EnvironmentConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'production' | 'test';
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    analytics: boolean;
    errorReporting: boolean;
    debug: boolean;
    serviceWorker: boolean;
    csp: boolean;
  };
  performance: {
    cacheDuration: number;
  };
}

const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not defined`);
  }
  return value;
};

const getBooleanEnvVariable = (key: string, defaultValue = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true';
};

const getNumberEnvVariable = (key: string, defaultValue?: number): number => {
  const value = import.meta.env[key];
  if (value === undefined && defaultValue !== undefined) return defaultValue;
  const parsed = Number(value);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return parsed;
};

export const config: EnvironmentConfig = {
  app: {
    name: getEnvVariable('VITE_APP_NAME', 'Robot Fleet Dashboard'),
    version: getEnvVariable('VITE_APP_VERSION', '1.0.0'),
    environment: getEnvVariable(
      'VITE_APP_ENVIRONMENT',
      'development'
    ) as EnvironmentConfig['app']['environment'],
  },
  api: {
    baseUrl: getEnvVariable('VITE_API_BASE_URL', 'http://localhost:3001'),
    timeout: getNumberEnvVariable('VITE_API_TIMEOUT', 10000),
  },
  features: {
    analytics: getBooleanEnvVariable('VITE_ENABLE_ANALYTICS', false),
    errorReporting: getBooleanEnvVariable('VITE_ENABLE_ERROR_REPORTING', false),
    debug: getBooleanEnvVariable('VITE_ENABLE_DEBUG', true),
    serviceWorker: getBooleanEnvVariable('VITE_ENABLE_SERVICE_WORKER', false),
    csp: getBooleanEnvVariable('VITE_ENABLE_CSP', true),
  },
  performance: {
    cacheDuration: getNumberEnvVariable('VITE_CACHE_DURATION', 86400000),
  },
};

export const isDevelopment = config.app.environment === 'development';
export const isProduction = config.app.environment === 'production';
export const isTest = config.app.environment === 'test';

// Validate critical configuration on app start
export const validateConfig = (): void => {
  const requiredEnvVars = ['VITE_APP_NAME', 'VITE_API_BASE_URL'];

  const missing = requiredEnvVars.filter(key => !import.meta.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env file configuration.'
    );
  }

  // Validate environment value
  const validEnvironments = ['development', 'production', 'test'];
  if (!validEnvironments.includes(config.app.environment)) {
    throw new Error(
      `Invalid VITE_APP_ENVIRONMENT: ${config.app.environment}. ` +
        `Must be one of: ${validEnvironments.join(', ')}`
    );
  }

  // Validate API URL format
  try {
    new URL(config.api.baseUrl);
  } catch {
    throw new Error(`Invalid VITE_API_BASE_URL: ${config.api.baseUrl}`);
  }
};
