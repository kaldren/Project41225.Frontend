import { createContext, useContext } from "react";
import { IToastMessage } from "./types";

interface ToastContextType {
  show: (message: IToastMessage) => void;
  dismiss: () => void;
}

const context = createContext<ToastContextType>(null!);

export default context;

export function useToast() {
  return useContext(context);
}
