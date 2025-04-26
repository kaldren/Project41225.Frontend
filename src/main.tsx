import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "@/app";
import Theme from "@/theme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Theme>
      <App />
    </Theme>
  </StrictMode>,
);
