import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import VerifyEmail from "../pages/VerifyEmail";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <VerifyEmail />
  </StrictMode>
);
