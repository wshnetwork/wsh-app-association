import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CommunityGuidelines from "../pages/docs/CommunityGuidelines";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CommunityGuidelines />
  </StrictMode>
);
