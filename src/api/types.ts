import { IOrderable } from "@/models/Orderable";
import { IPagination } from "@/models/Pagination";

export const providersNames = ["global"] as const;
export type ProviderName = (typeof providersNames)[number];

export interface IApiProvider {
  name: ProviderName;
  baseUrl: string;
  route: string;
}

export interface WebApiValidationError {
  type: string;
  title: string;
  status: number;
  errors: { [key: string]: string[] };
  traceId: string;
  message: string;
}

export interface ApiResponseErrorMessage {
  message: string | string[];
  title: string;
}

export interface IQueryParams<T> extends IOrderable<T>, IPagination {}
