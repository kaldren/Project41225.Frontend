import ApiProvider from "@/api/ApiProvider";
import { EntityErrorType, setFailingRequestMessage } from "@/helpers/errorHelper";
import { Feedback } from "@/models/Feedback";

const api = new ApiProvider();
const route = "interviews";

export async function createSession(cancellation?: AbortController): Promise<string> {
  return await api.post<string>(`${route}/create-session`, {
    signal: cancellation?.signal,
    ...setFailingRequestMessage("Interview Session", EntityErrorType.Create),
  });
}

/**
 * Fetches feedback for a given interview session.
 * @param sessionId Unique identifier of the session
 */
export async function getFeedback(sessionId: string, cancellation?: AbortController): Promise<Feedback> {
  return await api.get<Feedback>(`${route}/${sessionId}/feedback`, {
    signal: cancellation?.signal,
    ...setFailingRequestMessage("Feedback", EntityErrorType.Load),
  });
}
