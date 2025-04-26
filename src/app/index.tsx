import MainLayout from "@/shared/layout/MainLayout";
import "./index.css";
import { Routes, Route } from "react-router";
import { Home } from "@mui/icons-material";
import Page from "@/pages/Interview";
import Feedback from "@/pages/Feedback";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/interview" element={<Page />} />
        <Route path="/feedback/:sessionId" element={<Feedback />} />
      </Route>
    </Routes>
  );
}

export default App;
