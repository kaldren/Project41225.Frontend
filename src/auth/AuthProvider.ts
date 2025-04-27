import { IAuthentication } from "./types";
import DebugAuthProvider from "./DebugAuthProvider";
import EntraIdAuthProvider from "./EntraIdAuthProvider";

const isDebugAuthEnabled = import.meta.env.VITE_DEBUG_AUTH_ENABLED === "true" && import.meta.env.DEV;

const provider: IAuthentication = isDebugAuthEnabled ? new DebugAuthProvider() : new EntraIdAuthProvider();

export default provider;
