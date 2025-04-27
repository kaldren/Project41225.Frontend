import { IApiProvider, ProviderName } from "./types";

const providers: IApiProvider[] = [
  {
    name: "global",
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    route: import.meta.env.VITE_API_BASE_ROUTE,
  },
];

export const getProviderUrl = (name: ProviderName) => providers.find((x) => x.name === name)?.baseUrl;
export const getProvider = (name: ProviderName) => providers.find((x) => x.name === name);

export default providers;
