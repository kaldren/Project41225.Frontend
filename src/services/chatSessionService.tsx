import SignalRService from "./signalRService";

export type TranscriptHandler = (text: string) => void;
export type ChatPartHandler = (delta: string) => void;
export type ChatCompleteHandler = () => void;

export interface ChatSessionHandlers {
  onFinalTranscript: TranscriptHandler;
  onChatResponsePart: ChatPartHandler;
  onChatResponseComplete: ChatCompleteHandler;
}

class ChatSessionService {
  private signalR = SignalRService.getInstance();

  subscribe(sessionId: string, handlers: ChatSessionHandlers): () => void {
    const { onFinalTranscript, onChatResponsePart, onChatResponseComplete } = handlers;

    const finalCb = (sid: string, text: string) => {
      if (sid === sessionId) onFinalTranscript(text);
    };
    const partCb = (sid: string, delta: string) => {
      if (sid === sessionId) onChatResponsePart(delta);
    };
    const doneCb = (sid: string) => {
      if (sid === sessionId && onChatResponseComplete) onChatResponseComplete();
    };

    this.signalR.onFinalTranscript(finalCb);
    this.signalR.onPartialTranscript(partCb);
    this.signalR.onChatResponseComplete(doneCb);
    this.signalR.onChatResponsePart(partCb);
    this.signalR.onChatResponseComplete(doneCb);

    return () => {
      this.signalR.offFinalTranscript(finalCb);
      this.signalR.offPartialTranscript(partCb);
      this.signalR.offChatResponseComplete(doneCb);
    };
  }
}

export default new ChatSessionService();
