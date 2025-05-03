import * as signalR from "@microsoft/signalr";
import { MessagePackHubProtocol } from "@microsoft/signalr-protocol-msgpack";

type EventHandler = (...args: any[]) => void;

/**
 * Singleton SignalR service for managing hub connection.
 */
export default class SignalRService {
  private static instance: SignalRService;
  private connection: signalR.HubConnection;

  private constructor() {
    this.connection = this.ensureConnection();
  }

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  public on(event: string, handler: EventHandler) {
    this.connection.on(event, handler);
  }

  public off(event: string, handler?: EventHandler) {
    if (!handler) {
      this.connection.off(event);
    } else {
      this.connection.off(event, handler);
    }
  }

  public invoke(methodName: string, ...args: any[]) {
    return this.connection.invoke(methodName, ...args);
  }

  // convenience:
  public startSession(sessionId: string) {
    return this.invoke("StartSession", sessionId);
  }
  public sendAudioChunk(sessionId: string, chunk: ArrayBuffer) {
    return this.invoke("SendAudioChunk", sessionId, chunk);
  }
  public stopSession(sessionId: string) {
    return this.invoke("StopSession", sessionId);
  }

  // transcript events
  public onPartialTranscript(handler: (sessionId: string, text: string) => void) {
    this.connection.on("ReceivePartialTranscript", handler);
  }
  public offPartialTranscript(handler?: (...args: any[]) => void) {
    if (!handler) {
      this.connection.off("ReceivePartialTranscript");
    } else {
      this.connection.off("ReceivePartialTranscript", handler);
    }
  }

  public onFinalTranscript(handler: (sessionId: string, text: string) => void) {
    this.on("ReceiveFinalTranscript", handler);
  }

  public offFinalTranscript(handler?: (...args: any[]) => void) {
    if (!handler) {
      this.connection.off("ReceiveFinalTranscript");
    } else {
      this.connection.off("ReceiveFinalTranscript", handler);
    }
  }

  public onChatResponsePart(handler: (sessionId: string, delta: string) => void) {
    this.on("ReceiveChatResponsePart", handler);
  }

  public onChatResponseComplete(handler: (sessionId: string) => void) {
    this.on("ReceiveChatResponseComplete", handler);
  }

  public offChatResponseComplete(handler?: (...args: any[]) => void) {
    if (!handler) {
      this.connection.off("ReceiveChatResponseComplete");
    } else {
      this.connection.off("ReceiveChatResponseComplete", handler);
    }
  }

  public getConnection(): signalR.HubConnection {
    return this.connection;
  }

  public ensureConnection(): signalR.HubConnection {
    if (this.connection?.state === signalR.HubConnectionState.Connected) {
      return this.connection;
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/audio`)
      .withHubProtocol(new MessagePackHubProtocol())
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnected((id) => console.info("SignalR reconnected:", id));
    this.connection.onclose(async () => {
      console.warn("SignalR closed; attempting restart...");
      try {
        await this.connection.start();
      } catch (err) {
        console.error("Failed to restart SignalR:", err);
      }
    });

    this.connection
      .start()
      .then(() => console.info("SignalR connected"))
      .catch((err) => console.error("SignalR start failed:", err));
    return this.connection;
  }
}
