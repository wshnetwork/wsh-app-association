import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import RootRedirect from "../pages/RootRedirect";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootRedirect />
  </StrictMode>
);
