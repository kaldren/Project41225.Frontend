import { AlertColor } from "@mui/material";
import { ReactElement } from "react";

export type ToastVariant = AlertColor;

export interface IToastMessage {
  title?: string;
  body: string | ReactElement;
  variant: ToastVariant;
}
