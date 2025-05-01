import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  CircularProgress,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CardActions,
} from "@mui/material";
import { getFeedback } from "@/services/trainingSessionService";
import { Feedback } from "@/models/Feedback";

const Page: React.FunctionComponent = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [fb, setFb] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionId) {
      getFeedback(sessionId).then(setFb).catch(console.error);
    }
  }, [sessionId]);

  if (!fb) {
    return <CircularProgress sx={{ display: "block", mx: "auto", mt: 6 }} />;
  }

  const goHome = () => navigate("/");

  return (
    <Card sx={{ maxWidth: 500, mx: "auto", mt: 6 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Session Feedback
        </Typography>
        <Typography>Clarity: {fb.clarity}/5</Typography>
        <Typography>Content: {fb.content}/5</Typography>
        <Typography>Pace: {fb.pace}/5</Typography>
        <List>
          {fb.questions.map((q) => (
            <ListItem key={q.id}>
              <ListItemText primary={q.text} secondary={`Score: ${q.score}/5`} />
            </ListItem>
          ))}
        </List>
      </CardContent>
      <CardActions>
        <Button fullWidth variant="outlined" onClick={goHome}>
          Home
        </Button>
      </CardActions>
    </Card>
  );
};

export default Page;
