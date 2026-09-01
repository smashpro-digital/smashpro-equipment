import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import "./styles/global.css";
import "./styles/dream-build-fixes.css";
import "./styles/catalog.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/equipment">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
