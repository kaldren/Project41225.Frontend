import React, { ReactElement } from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";
import { ToastVariant } from "./types";

const DEFAULT_TIMEOUT = 3000;

interface ToastProps {
  title?: string;
  body: string | ReactElement;
  variant?: ToastVariant;
  show: boolean;
  onDismiss: () => void;
  timeout?: number;
}

export const Toast: React.FunctionComponent<ToastProps> = (props) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={props.show}
      autoHideDuration={props.timeout || DEFAULT_TIMEOUT}
      onClose={props.onDismiss}
    >
      <Alert severity={props.variant} variant="filled" sx={{ width: "100%" }}>
        {props.title && <AlertTitle>{props.title}</AlertTitle>}
        {props.body}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
