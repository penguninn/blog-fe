import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { BrowserRouter } from "react-router-dom";

// Only in production
if (import.meta.env.PROD) {
  // Force HTTPS in production
  if (window.location.protocol === 'http:' && !window.location.hostname.includes('localhost')) {
    window.location.href = window.location.href.replace('http:', 'https:');
  }
}

// Event listeners to track performance
if (import.meta.env.DEV) {
  ['load', 'DOMContentLoaded'].forEach(event => {
    window.addEventListener(event, () => {
      console.log(`[Performance] ${event}:`, performance.now().toFixed(2), 'ms');
    });
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Make sure there is a div with id 'root' in your HTML.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
