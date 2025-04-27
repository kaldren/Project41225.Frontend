import { useEffect, useRef, useState } from "react";
import * as signalR from "@microsoft/signalr";

/**
 * Custom hook for streaming audio from the user's microphone to a SignalR hub.
 * @param sessionId A unique identifier for the interview session.
 */
export function useAudioStreaming(sessionId: string) {
  const [recording, setRecording] = useState<boolean>(false);
  const hubRef = useRef<signalR.HubConnection | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Initialize SignalR connection
  useEffect(() => {
    const hub = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_BASE_URL}/hubs/audio`)
      .withAutomaticReconnect()
      .build();

    hub.start().catch((err) => console.error("SignalR start error:", err));
    hubRef.current = hub;

    return () => {
      mediaRecorderRef.current?.stop();
      hubRef.current?.stop();
    };
  }, []);

  // Start recording and streaming
  const start = async () => {
    if (!hubRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm; codecs=opus" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = async (event: BlobEvent) => {
        if (hubRef.current && event.data.size > 0) {
          const arrayBuffer = await event.data.arrayBuffer();
          await hubRef.current.invoke("SendAudioChunk", sessionId, new Uint8Array(arrayBuffer));
        }
      };

      recorder.start(1000); // Emit data every second
      setRecording(true);
    } catch (err) {
      console.error("Audio recording error:", err);
    }
  };

  // Stop recording
  const stop = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return { recording, start, stop };
}
