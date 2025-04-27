import { createSession } from "@/services/interviewService";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

const Home: React.FunctionComponent = () => {
  const [isSubmitting, submitting] = useState(false);
  const navigate = useNavigate();

  const createNewSession = async () => {
    submitting(true);
    try {
      const sessionId = await createSession();
      navigate(`/interview/${sessionId}`);
    } finally {
      submitting(false);
    }
  };
  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Interview Coach
      </Typography>
      <Button
        variant="contained"
        onClick={createNewSession}
        disabled={isSubmitting}
        startIcon={isSubmitting ? <CircularProgress size="small" /> : undefined}
      >
        Create New Session
      </Button>
    </Box>
  );
};

export default Home;
