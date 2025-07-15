/**
 * HTTP Client utility with interceptors, error handling, and retry logic
 */

import { config } from '../config/environment';
import type { Robot, RobotStatus } from '../types/robot';

export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, unknown>;
}

class HttpClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor() {
    this.baseURL = config.api.baseUrl;
    this.timeout = config.api.timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const controller = new AbortController();

    // Set timeout
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: ApiError;

        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = {
            message: `HTTP ${response.status}: ${response.statusText}`,
            status: response.status,
          };
        }

        throw new ApiClientError(errorData.message, response.status, errorData);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiClientError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiClientError('Request timeout', 408);
      }

      if (error instanceof TypeError) {
        throw new ApiClientError('Network error', 0);
      }

      throw new ApiClientError('Unknown error occurred');
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

export class ApiClientError extends Error {
  public readonly status?: number;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(message: string, status?: number, errorData?: Partial<ApiError>) {
    super(message);
    this.name = 'ApiClientError';
    this.status = status;
    this.code = errorData?.code;
    this.details = errorData?.details;
  }

  public isNetworkError(): boolean {
    return this.status === 0;
  }

  public isTimeoutError(): boolean {
    return this.status === 408;
  }

  public isServerError(): boolean {
    return this.status !== undefined && this.status >= 500;
  }

  public isClientError(): boolean {
    return this.status !== undefined && this.status >= 400 && this.status < 500;
  }
}

// Create singleton instance
export const httpClient = new HttpClient();

// Robot API Service
export const robotApi = {
  /**
   * Get all robots
   */
  async getRobots(): Promise<Robot[]> {
    const response = await httpClient.get<Robot[]>('/api/robots');
    return response.data;
  },

  /**
   * Get robot by ID
   */
  async getRobot(robotId: string): Promise<Robot> {
    const response = await httpClient.get<Robot>(`/api/robots/${robotId}`);
    return response.data;
  },

  /**
   * Update robot status
   */
  async updateRobotStatus(robotId: string, status: RobotStatus): Promise<Robot> {
    const response = await httpClient.patch<Robot>(`/api/robots/${robotId}/status`, {
      status,
    });
    return response.data;
  },

  /**
   * Update robot battery level
   */
  async updateBatteryLevel(robotId: string, batteryLevel: number): Promise<Robot> {
    const response = await httpClient.patch<Robot>(`/api/robots/${robotId}/battery`, {
      batteryLevel: Math.max(0, Math.min(100, batteryLevel)),
    });
    return response.data;
  },

  /**
   * Return robot to base
   */
  async returnToBase(robotId: string): Promise<Robot> {
    const response = await httpClient.post<Robot>(`/api/robots/${robotId}/return-to-base`);
    return response.data;
  },

  /**
   * Create new robot
   */
  async createRobot(robotData: Partial<Robot>): Promise<Robot> {
    const response = await httpClient.post<Robot>('/api/robots', robotData);
    return response.data;
  },

  /**
   * Delete robot
   */
  async deleteRobot(robotId: string): Promise<void> {
    await httpClient.delete(`/api/robots/${robotId}`);
  },
};

// Health check API
export const healthApi = {
  /**
   * Check API health
   */
  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await httpClient.get<{ status: string; timestamp: string }>('/api/health');
    return response.data;
  },
};
