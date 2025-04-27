import { Dashboard } from "@mui/icons-material";
import { generateIterableRoutes } from "./helpers";
import { UserRole } from "@/auth/types";

export const routes = {
  Login: {
    title: "Login",
    path: "/login",
    authorizedRoles: null,
    allowAnonymous: true,
  },
  Logout: {
    title: "Logout",
    path: "/logout",
    authorizedRoles: null,
    allowAnonymous: true,
  },
  SignOutOidc: {
    title: "Sign Out",
    path: "/signout-oidc",
    authorizedRoles: null,
    allowAnonymous: true,
  },
  SignOutOidcSilent: {
    title: "Sign Out",
    path: "/signout-oidc-silent",
    authorizedRoles: null,
    allowAnonymous: true,
  },
  SignInOidc: {
    title: "Sign In",
    path: "/signin-oidc",
    authorizedRoles: null,
  },
  UnAuthorized: {
    title: "401",
    path: "/401",
    authorizedRoles: null,
    allowAnonymous: true,
  },
  Home: {
    title: "Home",
    path: "/",
    index: true,
    icon: Dashboard,
    authorizedRoles: ["User"] as UserRole[],
    visibleSidebarItem: true,
  },
};

export const iterableRoutes = generateIterableRoutes(routes);
