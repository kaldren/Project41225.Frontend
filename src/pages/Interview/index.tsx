import { useNavigate, useParams } from "react-router";
import { Button, Box, Typography } from "@mui/material";
import AudioService from "@/services/audioService";
import SignalRService from "@/services/signalRService";
import { useState, useMemo, useEffect } from "react";

const Page: React.FunctionComponent = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  // singletons
  const signalRService = useMemo(() => SignalRService.getInstance(), []);
  const audioService = useMemo(() => new AudioService(sessionId || ""), [sessionId]);

  // subscribe to live transcription
  useEffect(() => {
    if (!sessionId) return;

    // Partial updates
    signalRService.onPartialTranscript((sid, text) => {
      if (sid === sessionId) setTranscript((t) => [...t, text]);
    });
    // Final updates
    signalRService.onFinalTranscript((sid, text) => {
      if (sid === sessionId) setTranscript((t) => [...t, text]);
    });

    return () => {
      signalRService.off("ReceivePartialTranscript");
      signalRService.off("ReceiveFinalTranscript");
    };
  }, [signalRService, sessionId]);

  // start/stop logic
  const startInterview = async () => {
    await audioService.startRecording(); // invokes StartSession + SendAudioChunk
    setRecording(true);
  };

  const finishInterview = async () => {
    await audioService.stopRecording(); // invokes StopSession
    setRecording(false);
    navigate(`/feedback/${sessionId}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Mock Interview
      </Typography>

      {/* Live transcript panel */}
      <Box
        sx={{
          border: "1px solid #ccc",
          borderRadius: 1,
          height: 200,
          overflowY: "auto",
          p: 2,
          mb: 3,
        }}
      >
        {transcript.length === 0 ? (
          <Typography color="text.secondary">No speech detected yet…</Typography>
        ) : (
          transcript.map((line, i) => (
            <Typography key={i} variant="body2">
              {line}
            </Typography>
          ))
        )}
      </Box>

      {/* Start/Stop button */}
      {recording ? (
        <Button fullWidth variant="contained" onClick={finishInterview}>
          Stop &amp; Get Feedback
        </Button>
      ) : (
        <Button fullWidth variant="contained" onClick={startInterview}>
          Start Interview
        </Button>
      )}
    </Box>
  );
};

export default Page;
