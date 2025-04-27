/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserRole } from "@/auth/types";

export type Route = {
  title: string;
  longTitle?: string;
  path: string;
  icon?: any;
  index?: boolean;
  isExternal?: boolean;
  children?: { [key: string]: Route };
  authorizedRoles?: UserRole[];
  allowAnonymous?: boolean;
  visibleSidebarItem?: boolean;
};

export type IterableRoute = {
  name: string;
  title: string;
  longTitle?: string;
  path: string;
  icon?: any;
  index?: boolean;
  isExternal?: boolean;
  children?: IterableRoute[];
  authorizedRoles?: UserRole[];
  allowAnonymous?: boolean;
  visibleSidebarItem?: boolean;
};

export type LocationRoute = {
  ancestor: IterableRoute | undefined;
  parent: IterableRoute | undefined;
  child: IterableRoute | undefined;
  destination: IterableRoute | undefined;
};

export type PageLoaderRouteParams = {
  id?: string;
  childId?: string;
};
