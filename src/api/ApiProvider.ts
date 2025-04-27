import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
  InternalAxiosRequestConfig,
} from "axios";
import { IApiProvider, IQueryParams, WebApiValidationError } from "./types";
import { getProvider } from "./providers";
import configs from "./configs";
import globalEventEmitter from "@/events/globalEventEmitter";
import { EventTypes } from "@/events/eventTypes";
import AuthProvider from "@/auth/AuthProvider";
import { IAuthentication } from "@/auth/types";

export interface ApiRequestConfig extends AxiosRequestConfig {
  failureRequestMessage?: string;
}

interface ApiInstanceConfig {
  baseUrl?: string;
  routeUrl?: string;
  useBaseUrlOnly?: boolean;
}

export default class ApiProvider {
  public constructor(config?: ApiInstanceConfig) {
    const provider = getProvider("global");
    if (!provider) throw new Error("No Api provider initialized");
    this.apiProvider = provider;
    this.instance = this.create(config);
  }

  private apiProvider: IApiProvider;
  private authProvider?: IAuthentication;
  private instance: AxiosInstance;
  public maxNumRetry = 2;
  public lastRetryRequests: string[] = [];

  public setAuthProvider(authProvider: IAuthentication, config?: ApiInstanceConfig) {
    this.authProvider = authProvider;
    this.instance = this.create(config);
  }

  public create(config?: ApiInstanceConfig, options?: CreateAxiosDefaults) {
    config ||= {};
    config.baseUrl ||= this.apiProvider.baseUrl;
    config.routeUrl ||= this.apiProvider.route;

    const baseUrl = config.baseUrl.concat(config.routeUrl);

    return this.setupInterceptors(
      axios.create({
        ...options,
        baseURL: baseUrl,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: configs.timeout,
      }),
    );
  }

  public async get<T>(url?: string, config?: ApiRequestConfig, acceptAnyResponseType?: boolean) {
    const failureRequestMessage = config?.failureRequestMessage || "Data Loading Failed";

    return this.instance
      .get<T>(url || "", config)
      .then((response: AxiosResponse) => {
        if (!this.isJsonResponseType(response) && !acceptAnyResponseType) {
          throw new Error("Internal Server Error");
        }
        return response.data;
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          return undefined;
        }

        this.emitApiError(error, failureRequestMessage);
        throw error;
      });
  }

  public async put<T>(url?: string, config?: ApiRequestConfig) {
    const failureRequestMessage = config?.failureRequestMessage || "Editing Failed";

    return this.instance
      .put<T>(url || "", config)
      .then((response: AxiosResponse) => response.data || response)
      .catch((error) => {
        if (axios.isCancel(error)) {
          return undefined;
        }

        this.emitApiError(error, failureRequestMessage);
        throw error;
      });
  }

  public async post<T>(url?: string, config?: ApiRequestConfig) {
    const failureRequestMessage = config?.failureRequestMessage || "Creation Failed";

    return this.instance
      .post<T>(url || "", config)
      .then((response: AxiosResponse) => response.data || response)
      .catch((error) => {
        if (axios.isCancel(error)) {
          return undefined;
        }

        this.emitApiError(error, failureRequestMessage);
        throw error;
      });
  }

  public async delete<T>(url?: string, config?: ApiRequestConfig) {
    const failureRequestMessage = config?.failureRequestMessage || "Deletion Failed";

    return this.instance
      .delete<T>(url || "", config)
      .then((response: AxiosResponse) => response.data || response)
      .catch((error) => {
        if (axios.isCancel(error)) {
          return undefined;
        }

        this.emitApiError(error, failureRequestMessage);
        throw error;
      });
  }

  public makeOrderedPagedQueryParams<T>(params: IQueryParams<T>): URLSearchParams {
    const p = new URLSearchParams();
    p.append("orderBy", params.orderBy?.valueOf().toString() || "");
    p.append("orderDirection", params.orderDirection?.valueOf().toString() || "");
    p.append("page", params.page.toString());
    p.append("pageSize", params.pageSize.toString());
    return p;
  }

  private setupInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.request.use(this.onAxiosRequest.bind(this), this.onAxiosRequestError.bind(this));
    axiosInstance.interceptors.response.use(this.onAxiosResponse.bind(this), this.onAxiosResponseError.bind(this));
    return axiosInstance;
  }

  private onAxiosRequest(config: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
    config.headers.setAuthorization(`Bearer ${this.getAuthProvider().getToken()}`);
    return config;
  }

  private onAxiosRequestError(error: AxiosError): Promise<AxiosError> {
    if (error.status === 401) {
      window.location.reload();
    }
    return Promise.reject(error);
  }

  private onAxiosResponse(response: AxiosResponse): AxiosResponse {
    return response;
  }

  private async onAxiosResponseError(error: AxiosError): Promise<AxiosResponse> {
    const originalRequest = error.config;
    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error);
    }

    // Signout if there are too many 401 attempts
    if (!this.isAllowedRetryRequest(originalRequest)) {
      return await Promise.reject(error.config);
    }

    try {
      await this.getAuthProvider().refreshToken();
      originalRequest.headers.setAuthorization(`Bearer ${this.getAuthProvider().getToken()}`);

      const newRequest = await axios(originalRequest);
      return await Promise.resolve(newRequest);
    } catch (refreshError) {
      this.getAuthProvider().signOut();
      return await Promise.reject(refreshError);
    }
  }

  private emitApiError(error: unknown, title: string) {
    globalEventEmitter.emit(EventTypes.ApiResponseError, {
      message: this.formatApiErrorMessage(error),
      title,
    });
  }

  private isJsonResponseType(response: AxiosResponse) {
    if (!response.data) return true;
    return response.headers["content-type"]?.toString().includes("application/json");
  }

  private formatApiErrorMessage(error: unknown): string | string[] {
    if (!axios.isAxiosError(error)) {
      return (error as Error)?.message || "";
    }

    const webApiValidationError = error.response?.data as WebApiValidationError;
    if (!webApiValidationError || !webApiValidationError.errors) {
      return webApiValidationError?.message || error.message;
    }

    return Object.entries(webApiValidationError.errors).map(
      ([key, value]) => `${key.replace("$.", "")}: ${value?.join("; ")}`,
    );
  }

  private isAllowedRetryRequest(request: InternalAxiosRequestConfig<unknown>): boolean {
    const retriedUrl = request.url || "";
    if (this.lastRetryRequests.includes(retriedUrl)) {
      return false;
    }
    this.lastRetryRequests.push(retriedUrl);
    return true;
  }

  private getAuthProvider() {
    return this.authProvider || AuthProvider;
  }
}
