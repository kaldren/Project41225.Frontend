import ApiProvider from "@/api/ApiProvider";
import { EntityErrorType, setFailingRequestMessage } from "@/helpers/errorHelper";
import { Feedback } from "@/models/Feedback";

const api = new ApiProvider();
const route = "interviews";

/**
 * Fetches feedback for a given interview session.
 * @param sessionId Unique identifier of the session
 */
export async function getFeedback(sessionId: string, cancellation?: AbortController): Promise<Feedback> {
  return await api.get<Feedback>(`${route}/${sessionId}/feedback`, {
    signal: cancellation?.signal,
    ...setFailingRequestMessage("Admin Users", EntityErrorType.Load),
  });
}
