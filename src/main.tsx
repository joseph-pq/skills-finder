import { ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "@/App.tsx";
import themeOptions from "@/theme/AppTheme";
import "@/index.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={themeOptions}>
      <React.StrictMode>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </React.StrictMode>
    </ThemeProvider>
  </StrictMode>,
);
