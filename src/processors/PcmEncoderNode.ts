import { pcmProcessorName } from "./types";

export class PcmEncoderNode extends AudioWorkletNode {
  constructor(context: AudioContext) {
    super(context, pcmProcessorName, {
      numberOfInputs: 1,
      numberOfOutputs: 1,
      channelCount: 1,
      outputChannelCount: [1], // ensure the one output has 1 channel
    });
  }
}
