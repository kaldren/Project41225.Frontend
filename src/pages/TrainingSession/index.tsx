import { useNavigate, useParams } from "react-router";
import { Box, Button, Typography, Stack, Paper } from "@mui/material";
import ChatSessionService from "@/services/chatSessionService";
import AudioService from "@/services/audioService";
import { useEffect, useMemo, useState } from "react";

type Message = { sender: "user" | "assistant"; text: string };

export default function Interview() {
  const { sessionId = "" } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAssistant, setCurrentAssistant] = useState("");

  const audioService = useMemo(() => new AudioService(sessionId), [sessionId]);

  useEffect(() => {
    if (!sessionId) return;

    const unsubscribe = ChatSessionService.subscribe(sessionId, {
      onFinalTranscript: (text) => {
        console.log("onFinalTranscript", text);
        setMessages((ms) => [...ms, { sender: "user", text }]);
        setCurrentAssistant("");
      },
      onChatResponsePart: (delta) => {
        console.log("onChatResponsePart", delta);
        setCurrentAssistant((c) => c + delta);
      },
      onChatResponseComplete: () => {
        console.log("onChatResponseComplete");
        setMessages((ms) => [...ms, { sender: "assistant", text: currentAssistant }]);
        setCurrentAssistant("");
      },
    });

    return () => unsubscribe();
  }, [sessionId, currentAssistant]);

  const start = async () => {
    setRecording(true);
    await audioService.startRecording();
  };
  const stop = async () => {
    await audioService.stopRecording();
    setRecording(false);
    navigate(`/feedback/${sessionId}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" mb={2}>
        Training Session
      </Typography>

      <Paper elevation={2} sx={{ maxHeight: 300, overflowY: "auto", p: 2, mb: 2 }}>
        {messages.map((m, i) => (
          <Box
            key={i}
            sx={{
              textAlign: m.sender === "user" ? "right" : "left",
              mb: 1,
            }}
          >
            <Typography
              component="span"
              sx={{
                display: "inline-block",
                bgcolor: m.sender === "user" ? "primary.light" : "grey.200",
                color: m.sender === "user" ? "primary.contrastText" : "black",
                px: 2,
                py: 1,
                borderRadius: 2,
              }}
            >
              {m.text}
            </Typography>
          </Box>
        ))}
        {currentAssistant && (
          <Typography component="span" variant="body2">
            {currentAssistant}▌
          </Typography>
        )}
      </Paper>

      <Stack gap={1}>
        {recording ? (
          <Button variant="contained" onClick={stop}>
            Stop &amp; Get Feedback
          </Button>
        ) : (
          <Button variant="contained" onClick={start}>
            Start Training
          </Button>
        )}
        <Button variant="outlined" onClick={() => navigate("/")}>
          Home
        </Button>
      </Stack>
    </Box>
  );
}
