/// <reference lib="webworker" />

declare abstract class AudioWorkletProcessor {
  readonly port: MessagePort;
  /**
   * @param inputs array of input channels
   * @param outputs array of output channels
   * @param parameters any AudioParam maps
   */
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>): boolean;
}

declare function registerProcessor(name: string, processorCtor: typeof AudioWorkletProcessor): void;
