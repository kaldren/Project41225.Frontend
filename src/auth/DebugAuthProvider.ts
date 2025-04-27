import { AccountInfo } from "@azure/msal-browser";
import { IIdentity, IUser, UserRole } from "./types";
import { IAuthentication } from "./types";
import { EventEmitter } from "events";

export default class DebugAuthProvider implements IAuthentication {
  public constructor() {}

  private identity: IIdentity | undefined;
  private account: AccountInfo | undefined;
  private user: IUser | undefined;

  public async initialize() {}

  public isAuthenticated(): boolean {
    return !!this.identity;
  }

  public AuthenticationEventChange(): EventEmitter {
    return new EventEmitter();
  }

  public getUserDetails(): IUser | undefined {
    return this.user;
  }

  public getUserRole(): UserRole | undefined {
    return this.user?.role;
  }

  public getUserAccount(): AccountInfo | undefined {
    return this.account;
  }

  public async signIn() {
    this.identity = {
      token: "debug-token",
      refreshToken: "debug-refreshToken",
    };
    this.user = {
      firstName: "Jarvis",
      lastName: "AI",
      username: "jarvis.ai@example.com",
      role: "User",
    };
  }

  public async signOut() {
    this.dispose();
  }

  public getToken(): string | undefined {
    return this.identity?.token;
  }

  public async refreshToken() {}

  public dispose() {
    this.identity = undefined;
  }
}
