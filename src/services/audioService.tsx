import SignalRService from "./signalRService";

/**
 * Audio service exposing start/stop recording, streaming via SignalR.
 */
export default class AudioService {
  private signalR: SignalRService;
  private mediaRecorder: MediaRecorder | null = null;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.signalR = SignalRService.getInstance();
  }

  /**
   * Connect to the hub and start recording audio.
   */
  public async startRecording(): Promise<void> {
    await this.signalR.connect();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm; codecs=opus" });

    this.mediaRecorder.ondataavailable = async (event: BlobEvent) => {
      if (event.data.size > 0) {
        const buffer = await event.data.arrayBuffer();
        await this.signalR.invoke("SendAudioChunk", this.sessionId, new Uint8Array(buffer));
      }
    };

    this.mediaRecorder.start(1000);
  }

  /**
   * Stops recording and disconnects from hub if desired.
   */
  public async stopRecording(): Promise<void> {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    // optionally disconnect after stopping
    await this.signalR.disconnect();
  }
}
