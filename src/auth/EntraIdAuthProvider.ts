import { AccountInfo, EventType, PublicClientApplication } from "@azure/msal-browser";
import { IIdentity } from "./types";
import { IAuthentication } from "./types";
import { IUser, UserRole } from "./types";
import { loginScopes, entraIdConfig, oneDriveScopes } from "./entraIdConfig";
import EventEmitter from "events";
import authEventEmitter, { EventTypes, LoginStatusEventType } from "@/auth/entraIdEvents";

export default class EntraIdAuthProvider implements IAuthentication {
  public constructor() {
    this.instance = new PublicClientApplication(entraIdConfig);
  }

  private identity: IIdentity | undefined;
  private account: AccountInfo | undefined;
  private instance: PublicClientApplication;
  private user: IUser | undefined;

  public async initialize() {
    if (this.instance) {
      await this.instance.initialize();
      const account = this.instance.getActiveAccount();
      this.account = account || undefined;
      if (account && !this.isAuthenticated()) {
        await this.refreshToken();
        this.instance.addEventCallback((event) => {
          if (event.eventType === EventType.ACCOUNT_REMOVED) {
            this.dispose();
          }
        });
      }
    }
  }

  public isAuthenticated(): boolean {
    return !!this.identity && !!this.identity.token;
  }

  public AuthenticationEventChange(): EventEmitter {
    const emitter = new EventEmitter();
    authEventEmitter.on(EventTypes.LoginStatusChanged, (status: LoginStatusEventType) => {
      emitter.emit(EventTypes.LoginStatusChanged, status);
    });
    return emitter;
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
    try {
      authEventEmitter.emit(EventTypes.LoginStatusChanged, LoginStatusEventType.LoginStart);

      const loginRedirectChallenge = await this.instance.handleRedirectPromise();

      this.account = this.instance.getActiveAccount() || loginRedirectChallenge?.account;
      if (!this.account) {
        const authResult = await this.instance.loginPopup({ scopes: loginScopes, prompt: "login" });
        this.account = authResult.account;
        this.instance.setActiveAccount(this.account);
        this.setIdentity(authResult.idToken, authResult.accessToken, authResult.account);
        return;
      }

      this.instance.setActiveAccount(this.account);
      await this.refreshToken();
    } finally {
      authEventEmitter.emit(EventTypes.LoginStatusChanged, LoginStatusEventType.LoginComplete);
    }
  }

  public async signOut() {
    const account = this.account || this.instance.getActiveAccount();
    const loginHint = account?.idTokenClaims?.login_hint;
    await this.instance.logoutPopup({
      account: account,
      logoutHint: loginHint,
    });
    this.dispose();
  }

  public getToken(): string | undefined {
    return this.identity?.accessToken || this.identity?.token;
  }

  public async refreshToken() {
    const account = this.instance.getActiveAccount();
    if (!account) {
      return await this.signOut();
    }

    const response = await this.instance.acquireTokenSilent({
      scopes: oneDriveScopes,
      account: account,
      forceRefresh: true,
    });

    this.setIdentity(response.idToken, response.accessToken, account);
  }

  public dispose() {
    this.identity = undefined;
    this.instance.setActiveAccount(null);
    this.instance.clearCache();
  }

  private setIdentity(idToken: string, accessToken: string, account: AccountInfo) {
    this.identity = {
      token: idToken,
      accessToken: accessToken,

      refreshToken: "",
    };

    this.user = {
      firstName: account.name || "",
      lastName: account.name || "",
      role: "User",
      username: account.username,
    };
  }
}
