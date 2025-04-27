import { PropsWithChildren, useState } from "react";
import Toast from ".";
import { IToastMessage } from "./types";
import ToastContext from "./context";

export const ToastProvider: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [message, setMessage] = useState<IToastMessage>();

  const onDismiss = () => {
    setMessage(undefined);
  };

  return (
    <ToastContext.Provider
      value={{
        dismiss: onDismiss,
        show: (message) => setMessage(message),
      }}
    >
      {children}
      <Toast
        show={!!message}
        title={message?.title}
        body={message?.body || ""}
        variant={message?.variant}
        onDismiss={onDismiss}
      />
    </ToastContext.Provider>
  );
};
