import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MobileArtServices from "./MobileArtServices";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MobileArtServices />
  </StrictMode>
);
