import { createRoot } from "react-dom/client";
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import App from "./App";
import ErrorBoundaryFallback from "./components/ErrorBoundaryFallback";
import "./styles/global.css";

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </ErrorBoundary>
);