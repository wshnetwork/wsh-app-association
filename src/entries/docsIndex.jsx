import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import DocsIndex from "../pages/docs/DocsIndex";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <DocsIndex />
  </StrictMode>
);
