import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { AlertProvider } from "./utils/notifications/AlertContext.tsx";
import router from "./routes/index";

Amplify.configure(outputs);

const theme = createTheme({
  palette: {
    mode: "light", // Ensure light mode is used
  },
  components: {
    MuiTextField: {
      defaultProps: {
        FormHelperTextProps: {
          sx: { marginLeft: 0, textAlign: "left", color: "error.main" },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: 0,
          textAlign: "left",
          color: "error.main",
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AlertProvider>
    <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
    </ThemeProvider>
    </AlertProvider>
  </React.StrictMode>
);
