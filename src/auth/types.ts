import { AccountInfo } from "@azure/msal-browser";
import { EventEmitter } from "stream";

export const userRoles = ["User"] as const;
export type UserRole = (typeof userRoles)[number];

export interface IUser {
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface IAuthentication {
  initialize: () => Promise<void>;
  isAuthenticated: () => boolean;
  AuthenticationEventChange: () => EventEmitter;
  getUserDetails: () => IUser | undefined;
  getUserRole: () => UserRole | undefined;
  getUserAccount: () => AccountInfo | undefined;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  getToken: () => string | undefined;
  refreshToken: () => Promise<void>;
  dispose: () => void;
}

export interface IRequestAuthenticate {
  username: string;
  password: string;
}

export interface IRequestRefreshToken {
  token: string;
}

export interface IRequestSignOut {
  token: string;
}

export interface IIdentity {
  token: string;
  accessToken?: string;
  refreshToken: string;
}
