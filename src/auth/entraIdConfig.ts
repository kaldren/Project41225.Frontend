import { routes } from "@/routes";
import { BrowserCacheLocation, Configuration } from "@azure/msal-browser";

export const entraIdConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ENTRA_ID_CLIENT_ID,
    authority: `${import.meta.env.VITE_ENTRA_ID_AUTHORITY_BASE_URL}/${import.meta.env.VITE_ENTRA_ID_TENANT_ID}`,
    redirectUri: routes.SignInOidc.path,
    postLogoutRedirectUri: routes.SignOutOidc.path,
    navigateToLoginRequestUrl: false,
  },
  system: {
    allowPlatformBroker: false,
  },
  cache: {
    cacheLocation: BrowserCacheLocation.LocalStorage,
  },
};

export const loginScopes = ["offline_access", "User.Read", "Files.Read"];

export const oneDriveScopes = ["User.Read", "Files.Read"];
