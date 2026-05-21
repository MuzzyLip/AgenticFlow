import axios, { AxiosError, type AxiosRequestConfig } from "axios";

interface ErrorPayload {
  code?: string;
  message?: string;
  [key: string]: unknown;
}

export class HttpError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly payload?: unknown;

  constructor(message: string, options?: { status?: number; code?: string; payload?: unknown }) {
    super(message);
    this.name = "HttpError";
    this.status = options?.status;
    this.code = options?.code;
    this.payload = options?.payload;
  }
}

function normalizeBaseUrl(rawBaseUrl: string | undefined): string | undefined {
  const trimmed = rawBaseUrl?.trim();
  if (!trimmed) {
    return undefined;
  }
  return trimmed.replace(/\/+$/, "");
}

const baseURL = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
const timeout = Number(process.env.NEXT_PUBLIC_API_TIMEOUT_MS ?? 15000);

export function getApiBaseUrl(): string {
  if (!baseURL) {
    throw new HttpError(
      "NEXT_PUBLIC_API_BASE_URL is not configured",
      { code: "API_BASE_URL_MISSING" },
    );
  }

  return baseURL;
}

export function buildApiUrl(path: string): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export const httpClient = axios.create({
  baseURL,
  timeout: Number.isFinite(timeout) ? timeout : 15000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function toHttpError(error: unknown): HttpError {
  if (error instanceof HttpError) {
    return error;
  }

  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const payload = error.response?.data;
    const messageFromPayload =
      payload && typeof payload === "object"
        ? (payload as ErrorPayload).message
        : undefined;
    const codeFromPayload =
      payload && typeof payload === "object"
        ? (payload as ErrorPayload).code
        : undefined;

    return new HttpError(
      messageFromPayload ?? error.message ?? "Request failed",
      {
        status,
        code: codeFromPayload ?? error.code,
        payload,
      },
    );
  }

  if (error instanceof Error) {
    return new HttpError(error.message);
  }

  return new HttpError("Unknown request error");
}

async function request<TResponse>(config: AxiosRequestConfig): Promise<TResponse> {
  try {
    const { data } = await httpClient.request<TResponse>(config);
    return data;
  } catch (error) {
    throw toHttpError(error);
  }
}

export function httpGet<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse>({
    ...config,
    method: "GET",
    url,
  });
}

export function httpPost<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse>({
    ...config,
    method: "POST",
    url,
    data: body,
  });
}

export function httpPut<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse>({
    ...config,
    method: "PUT",
    url,
    data: body,
  });
}

export function httpPatch<TResponse, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse>({
    ...config,
    method: "PATCH",
    url,
    data: body,
  });
}

export function httpDelete<TResponse>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<TResponse> {
  return request<TResponse>({
    ...config,
    method: "DELETE",
    url,
  });
}
