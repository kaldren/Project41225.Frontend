import React, { PropsWithChildren } from "react";
import globalEventEmitter from "@/events/globalEventEmitter";
import { EventTypes } from "@/events/eventTypes";
import { ApiResponseErrorMessage } from "./types";
import { useToast } from "@/shared/Toast/context";

const ApiEventsHandler: React.FunctionComponent<PropsWithChildren> = ({ children }) => {
  const toast = useToast();

  if (globalEventEmitter.listeners(EventTypes.ApiResponseError).length === 0) {
    globalEventEmitter.on(EventTypes.ApiResponseError, (error: ApiResponseErrorMessage) =>
      toast.show({
        variant: "error",
        title: error.title,
        body: Array.isArray(error.message) ? (
          <ul>
            {error.message.map((value, index) => (
              <li key={index} style={{ wordBreak: "break-all" }}>
                {value}
              </li>
            ))}
          </ul>
        ) : (
          error.message
        ),
      })
    );
  }

  return children;
};

export default ApiEventsHandler;
