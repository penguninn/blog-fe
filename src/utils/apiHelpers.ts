import type { AxiosRequestConfig } from "axios";
import type {
  MaybeEnvelope,
  MaybeStandardResponse,
  PaginatedResponse,
  PaginationMeta,
  StandardApiResponse,
} from "@/types";

export const isApiEnvelope = <T = unknown>(
  value: unknown
): value is { data: T } => {
  return !!value && typeof value === "object" && "data" in (value as any);
};

export function normalizeEnvelope<T>(payload: MaybeEnvelope<T>): T {
  return isApiEnvelope<T>(payload) ? (payload as any).data : (payload as T);
}

export function normalizePaginated<T>(
  payload: MaybeEnvelope<PaginatedResponse<T>>
): PaginatedResponse<T> {
  const body = normalizeEnvelope<PaginatedResponse<T>>(payload);
  return body;
}

export const isStandardResponse = <T = unknown>(
  value: unknown
): value is StandardApiResponse<T> => {
  return (
    !!value &&
    typeof value === "object" &&
    "success" in (value as any) &&
    "statusCode" in (value as any)
  );
};

export function toLegacyFromStandard<T>(payload: StandardApiResponse<T>) {
  const { statusCode, message, data, pagination } = payload;
  if (pagination) {
    const { page, size, totalPages, totalElements } =
      pagination as PaginationMeta;
    return {
      status: statusCode,
      message,
      data: {
        page,
        size,
        totalPages,
        totalElements,
        contents: (Array.isArray(data) ? data : []) as any[],
      },
    };
  }
  return {
    status: statusCode,
    message,
    data,
  };
}

export function normalizeStandardOrRaw<T>(
  payload: MaybeStandardResponse<T>
): T {
  return isStandardResponse<T>(payload) ? (payload.data as T) : (payload as T);
}

export interface QueryParams {
  [key: string]: unknown;
}

export function buildPaginationParams(page?: number, size?: number) {
  const params: QueryParams = {};
  const normalizedPage =
    typeof page === "number" ? Math.max(1, Math.floor(page)) : 1;
  params.page = normalizedPage;
  if (typeof size !== "undefined") params.size = size;
  return params;
}

export function buildSortingParams(sortBy?: string, direction?: string) {
  const params: QueryParams = {};
  if (sortBy) params.sortBy = sortBy;
  if (direction) params.direction = direction;
  return params;
}

export function withParams(
  config: AxiosRequestConfig = {},
  params?: QueryParams
): AxiosRequestConfig {
  return { ...config, params: { ...(config.params || {}), ...(params || {}) } };
}
