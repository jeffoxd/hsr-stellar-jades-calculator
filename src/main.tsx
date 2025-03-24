import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";

import "@/init";
import "@/globals.css";
import "@/lib/i18n";
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </StrictMode>
);
