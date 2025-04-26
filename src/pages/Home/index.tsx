import { Box, Typography, Button } from "@mui/material";
import { Link } from "react-router";

const Home: React.FunctionComponent = () => {
  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Welcome to AI Interview Coach
      </Typography>
      <Button component={Link} to="/interview" variant="contained">
        Start Mock Interview
      </Button>
    </Box>
  );
};

export default Home;
