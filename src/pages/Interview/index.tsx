import { useNavigate, useParams } from "react-router";
import { Button, Box, Typography } from "@mui/material";
import AudioService from "@/services/audioService";
import { useState, useMemo, useEffect } from "react";

const Page: React.FunctionComponent = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [recording, setRecording] = useState(false);

  // Initialize AudioService once per session
  const audioService = useMemo(() => {
    return sessionId ? new AudioService(sessionId) : null;
  }, [sessionId]);

  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    }
  }, [sessionId, navigate]);

  const startInterview = async () => {
    if (!audioService) return;
    try {
      await audioService.startRecording();
      setRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
    }
  };

  const finishInterview = async () => {
    if (!audioService) return;
    try {
      await audioService.stopRecording();
      setRecording(false);
      navigate(`/feedback/${sessionId}`);
    } catch (err) {
      console.error("Error stopping recording:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 6, textAlign: "center" }}>
      <Typography variant="h5" mb={2}>
        Mock Interview
      </Typography>
      {recording ? (
        <Button fullWidth variant="contained" onClick={finishInterview}>
          Stop & Get Feedback
        </Button>
      ) : (
        <Button fullWidth variant="contained" onClick={startInterview}>
          Start Interview
        </Button>
      )}
      {/* TODO: insert live transcript / question list here */}
    </Box>
  );
};

export default Page;
