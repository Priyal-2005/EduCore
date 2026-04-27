/**
 * Standardised API Response Utilities
 *
 * Every endpoint returns the same shape:
 *   { success: boolean, data?: T, message: string }
 *
 * Consistency makes the API trivially parseable by any frontend.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message: string;
}

/** 200/201 — Successful response */
export function successResponse<T>(data: T, message = 'Success'): ApiResponse<T> {
  return { success: true, data, message };
}

/** Error response (used by the error middleware) */
export function errorResponse(message: string): ApiResponse {
  return { success: false, message };
}

/** Paginated response wrapper */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function paginatedResponse<T>(
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success'
): PaginatedResponse<T> {
  return {
    success: true,
    data,
    message,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
