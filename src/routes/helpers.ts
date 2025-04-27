import { matchPath } from "react-router";
import { iterableRoutes } from ".";
import { IterableRoute, LocationRoute, Route } from "./types";

export function generateIterableRoutes(routes: object): IterableRoute[] {
  return Array.from(Object.entries(routes), (value) => ({
    ...value[1],
    name: value[0],
    children: [...flattenRouteChildren(value[1])],
  }));
}

function flattenRouteChildren(value: Route): IterableRoute[] {
  return Array.from(Object.entries(value.children || {}), (nestedChildren: [string, Route]) => ({
    ...nestedChildren[1],
    name: nestedChildren[0],
    children: nestedChildren[1] ? [...flattenRouteChildren(nestedChildren[1])] : [],
  }));
}

export function fetchLocationRoute(pathname: string): LocationRoute {
  const locationRoute: LocationRoute = {
    ancestor: undefined,
    parent: undefined,
    child: undefined,
    destination: undefined,
  };

  for (const level1 of iterableRoutes) {
    locationRoute.ancestor = level1.name.toLowerCase() === "home" ? undefined : level1;

    const levelOneMatch = matchPath({ path: level1.path }, pathname);
    if (levelOneMatch) {
      locationRoute.destination = level1;
      return locationRoute;
    }

    for (const level2 of level1.children || []) {
      locationRoute.parent = level2;

      const levelTwoMatch = matchPath({ path: level2.path }, pathname);
      if (levelTwoMatch) {
        locationRoute.destination = level2;
        return locationRoute;
      }

      for (const level3 of level2.children || []) {
        locationRoute.child = level3;

        const levelThreeMatch = matchPath({ path: level3.path }, pathname);
        if (levelThreeMatch) {
          locationRoute.destination = level3;
          return locationRoute;
        }

        locationRoute.child = undefined;
      }

      locationRoute.parent = undefined;
    }

    locationRoute.ancestor = undefined;
  }

  return locationRoute;
}

export function getRouteByPath(path: string): IterableRoute | undefined {
  return iterableRoutes.find((x) => x.path === path);
}

export function isAnonymousRoute(pathname?: string): boolean {
  pathname ||= window.location.pathname;
  const route = fetchLocationRoute(pathname);

  return route.destination?.allowAnonymous || false;
}
