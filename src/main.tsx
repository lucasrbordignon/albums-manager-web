import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AppThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { HealthCheckProvider } from "./contexts/HealthCheckContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HealthCheckProvider>
      <AuthProvider>
        <AppThemeProvider>
          <App />
        </AppThemeProvider>
      </AuthProvider>
    </HealthCheckProvider>
  </React.StrictMode>,
);
