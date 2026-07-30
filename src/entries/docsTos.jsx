import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import TermsOfService from "../pages/docs/TermsOfService";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TermsOfService />
  </StrictMode>
);
