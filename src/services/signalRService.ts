import * as signalR from "@microsoft/signalr";

/**
 * Singleton SignalR service for managing hub connection.
 */
export default class SignalRService {
  private static instance: SignalRService;
  private hubConnection: signalR.HubConnection;

  private constructor() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/audio`)
      .configureLogging(signalR.LogLevel.Information) // ← add this
      .withAutomaticReconnect()
      .build();
  }

  /**
   * Returns the singleton instance.
   */
  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  /**
   * Starts the SignalR connection if not already connected.
   */
  public async connect(): Promise<void> {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      await this.hubConnection.start();
    }
  }

  /**
   * Stops the SignalR connection.
   */
  public async disconnect(): Promise<void> {
    if (this.hubConnection.state === signalR.HubConnectionState.Connected) {
      await this.hubConnection.stop();
    }
  }

  /**
   * Invokes a hub method with arguments.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public invoke(methodName: string, ...args: any[]): Promise<any> {
    return this.hubConnection.invoke(methodName, ...args);
  }

  /** Subscribe to on‐the‐fly (partial) transcript updates */
  public onPartialTranscript(handler: (sessionId: string, text: string) => void) {
    this.hubConnection.on("ReceivePartialTranscript", handler);
  }

  /** Subscribe to final transcript updates */
  public onFinalTranscript(handler: (sessionId: string, text: string) => void) {
    this.hubConnection.on("ReceiveFinalTranscript", handler);
  }

  /** Unsubscribe from an event name */
  public off(eventName: string) {
    this.hubConnection.off(eventName);
  }
}
