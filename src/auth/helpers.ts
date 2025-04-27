import Authentication from "./AuthProvider";
import { LoaderFunctionArgs, redirect } from "react-router";
import { PageLoaderRouteParams } from "@/routes/types";
import { routes } from "@/routes";
import { fetchLocationRoute } from "@/routes/helpers";
import { pageRouteLoader } from "@/routes/loaders";
import { UserRole } from "./types";

export function isUserFeatureRolesAuthorized(featureRoles?: UserRole[]): boolean {
  if (!featureRoles) return false;

  const userRole = Authentication.getUserRole();
  const roleFound = featureRoles.find((x) => x === userRole);

  return !!roleFound;
}

export async function authorizedPageLoader(args: LoaderFunctionArgs): Promise<PageLoaderRouteParams | Response> {
  try {
    const location = new URL(args.request.url);
    const locationRoute = fetchLocationRoute(location.pathname);
    if (!locationRoute || !locationRoute.destination) {
      throw new Error();
    }

    if (!Authentication.isAuthenticated()) {
      return redirect(routes.Login.path);
    }

    const route = locationRoute.destination;
    if (route?.allowAnonymous ?? false) {
      return pageRouteLoader(args);
    }

    if (!isUserFeatureRolesAuthorized(route?.authorizedRoles)) {
      return redirect(routes.UnAuthorized.path);
    }

    return pageRouteLoader(args);
  } catch {
    redirect(routes.UnAuthorized.path);
    return {};
  }
}

export async function logoutLoader(): Promise<Response> {
  return redirect(routes.SignOutOidc.path);
}

export async function signOutSilentLoader(): Promise<void> {
  window.close();
}
