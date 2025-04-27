// src/services/audioService.ts
import SignalRService from "./signalRService";

/**
 * Audio service exposing start/stop recording & streaming via SignalR.
 * Matches the new Hub methods: StartSession, SendAudioChunk, StopSession.
 */
export default class AudioService {
  private signalR = SignalRService.getInstance();
  private mediaRecorder: MediaRecorder | null = null;
  private sessionId: string;

  constructor(sessionId: string) {
    this.sessionId = sessionId;
  }

  /**
   * Connect, tell the hub to start a session, then begin pushing audio.
   */
  public async startRecording(): Promise<void> {
    try {
      await this.signalR.connect();
      // Tell the hub: “I’m ready to stream for this session”
      await this.signalR.invoke("StartSession", this.sessionId);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm; codecs=opus",
      });

      this.mediaRecorder.ondataavailable = async (event: BlobEvent) => {
        if (event.data.size > 0) {
          const buffer = await event.data.arrayBuffer();
          // Push each chunk to the hub
          await this.signalR.invoke("SendAudioChunk", this.sessionId, new Uint8Array(buffer));
        }
      };
      this.mediaRecorder.start(1000); // emit every second
    } catch (error) {
      console.error("Start Recording error: ", error);
    }
  }

  /**
   * Stop pushing audio and notify the hub you're done.
   */
  public async stopRecording(): Promise<void> {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    // Tell the hub to finish the session
    await this.signalR.invoke("StopSession");
    // Clean up the connection
    await this.signalR.disconnect();
  }
}
