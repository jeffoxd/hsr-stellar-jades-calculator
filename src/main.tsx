import "@/init";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import "@/globals.css";
import App from "@/App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback="loading">
      <App />
    </Suspense>
  </StrictMode>
);
