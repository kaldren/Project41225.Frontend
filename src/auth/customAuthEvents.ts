import { EventEmitter } from "events";

export default new EventEmitter();

export enum EventTypes {
  LoginStatusChanged = "LoginStatusChanged",
}

export enum LoginStatusEventType {
  LoginStart = "LoginStart",
  LoginComplete = "LoginComplete",
}
