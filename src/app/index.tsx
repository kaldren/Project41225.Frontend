import MainLayout from "@/shared/layout/MainLayout";
import "./index.css";
import { Routes, Route, BrowserRouter } from "react-router";
import HomePage from "@/pages/Home";
import InterviewPage from "@/pages/Interview";
import FeedbackPage from "@/pages/Feedback";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" index element={<HomePage />} />
          <Route path="/interview" element={<InterviewPage />} />
          <Route path="/feedback/:sessionId" element={<FeedbackPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
