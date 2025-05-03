import SignalRService from "./signalRService";
import processorUrl from "@/processors/PcmEncoderProcessor.ts?url";
import { PcmEncoderNode } from "@/processors/PcmEncoderNode";

export default class AudioService {
  private ctx!: AudioContext;
  private encoderNode!: PcmEncoderNode;
  private source!: MediaStreamAudioSourceNode;
  private signalR = SignalRService.getInstance();

  constructor(
    private sessionId: string,
    private onError: (err: any) => void,
  ) {}

  async startRecording() {
    this.ctx = new AudioContext({ sampleRate: 16000 });
    await this.ctx.audioWorklet.addModule(processorUrl);

    this.encoderNode = new PcmEncoderNode(this.ctx);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.source = this.ctx.createMediaStreamSource(stream);

    const mute = this.ctx.createGain();
    mute.gain.value = 0;

    this.source.connect(this.encoderNode).connect(mute).connect(this.ctx.destination);
    SignalRService.getInstance().ensureConnection();

    this.encoderNode.port.onmessage = (e: MessageEvent<ArrayBuffer>) => {
      this.signalR.sendAudioChunk(this.sessionId, new Uint8Array(e.data)).catch((err) => {
        // deliver the error back to the UI
        this.onError(err);
      });
    };

    await this.signalR.startSession(this.sessionId);
  }

  async stopRecording() {
    this.source.disconnect();
    this.encoderNode.disconnect();
    await this.ctx.close();
    await this.signalR.stopSession(this.sessionId);
  }
}
