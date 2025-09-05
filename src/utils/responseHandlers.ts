import type { AxiosError } from "axios";
import type { ProblemDetails, StandardApiResponse } from "@/types";

export const isProblemDetails = (value: unknown): value is ProblemDetails => {
  return !!value && typeof value === "object" && "type" in (value as any);
};

export interface NormalizedError {
  status?: number;
  title?: string;
  detail?: string;
  type?: string;
  errors?: Record<string, string | string[]> | string;
  raw?: unknown;
}

export function normalizeAxiosError(
  error: AxiosError<ProblemDetails | StandardApiResponse<unknown> | unknown>
): NormalizedError {
  const status = error.response?.status ?? error.status;
  const payload = error.response?.data;

  if (isProblemDetails(payload)) {
    return {
      status: payload.status ?? status,
      title: payload.title,
      detail: payload.detail,
      type: payload.type,
      errors: payload.errors as any,
      raw: payload,
    };
  }

  if (payload && typeof payload === "object" && "error" in (payload as any)) {
    const p = (payload as any).error as ProblemDetails | undefined;
    if (p && isProblemDetails(p)) {
      return {
        status: (payload as any).statusCode ?? p.status ?? status,
        title: p.title,
        detail: p.detail,
        type: p.type,
        errors: p.errors as any,
        raw: payload,
      };
    }
  }

  return {
    status,
    title: error.name,
    detail: error.message,
    raw: payload ?? error,
  };
}
