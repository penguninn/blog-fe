import type { AxiosError } from "axios";
import type { JSONContent } from "@tiptap/react";

export interface ApiEnvelope<T> {
  status: number;
  message?: string;
  data: T;
}

export type MaybeEnvelope<T> = T | ApiEnvelope<T>;

export interface PaginatedResponse<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  contents: T[];
}

export interface PaginationParams {
  page?: number;
  size?: number;
}

export type SortDirection = "ASC" | "DESC" | "asc" | "desc";

export interface SortingParams<K extends string = string> {
  sortBy?: K;
  direction?: SortDirection;
}

export interface ProblemDetails {
  type: string;
  title?: string;
  status?: number;
  detail?: string;
  errors?: string | Record<string, string | string[]>;
}

export type ApiError = AxiosError<ProblemDetails | unknown> & {
  isProblemDetails?: boolean;
};

export interface PaginationMeta {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface StandardApiResponse<T> {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
  pagination?: PaginationMeta;
  timestamp?: string;
  path?: string;
  correlationId?: string;
  error?: ProblemDetails & { instance?: string };
}

export type MaybeStandardResponse<T> = T | StandardApiResponse<T>;

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED" | "SCHEDULED";

export type PostSortBy = "CREATED_AT" | "TITLE" | "MODIFIED_AT" | (string & {});

export type ContentBlock = JSONContent;
