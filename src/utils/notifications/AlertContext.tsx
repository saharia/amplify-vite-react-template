import  { createContext, useContext, useState, ReactNode } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

type AlertInfo = {
  message: string;
  severity: AlertColor;
};

type AlertContextType = {
  showAlert: (message: string, severity: AlertColor) => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({ message: "", severity: "info" });

  const showAlert = (message: string, severity: AlertColor) => {
    setAlertInfo({ message, severity });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert variant="filled" onClose={handleClose} severity={alertInfo.severity} sx={{ width: "100%" }}>
          {alertInfo.message}
        </Alert>
      </Snackbar>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};