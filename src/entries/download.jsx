import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Download from "../pages/Download";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Download />
  </StrictMode>
);
