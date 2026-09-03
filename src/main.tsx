import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { installJourneyCalendarMetricCorrection } from "./domain/calendarMetrics";
import "./styles/global.css";
import "./styles/dream-build-fixes.css";
import "./styles/catalog.css";
import "./styles/product-engineering.css";

installJourneyCalendarMetricCorrection();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename="/equipment">
      <App />
    </BrowserRouter>
  </StrictMode>,
);
