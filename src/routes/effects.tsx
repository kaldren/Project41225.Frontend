import { useLocation } from "react-router";
import { LocationRoute } from "./types";
import { useEffect, useState } from "react";
import { fetchLocationRoute } from "./helpers";

export function useLocationRoute(callback?: (locationRoute?: LocationRoute) => void) {
  const [oldPathname, setOldPathname] = useState<string>();
  const [locationRoute, setLocationRoute] = useState<LocationRoute>();
  const location = useLocation();

  useEffect(() => {
    if (oldPathname === location.pathname) return;

    const result = fetchLocationRoute(location.pathname);
    setLocationRoute(result);
    callback && callback(result);
    setOldPathname(location.pathname);
  }, [location, oldPathname, callback]);

  return locationRoute;
}
