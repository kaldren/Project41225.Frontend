import { Feedback } from "@/models/Feedback";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

/**
 * Fetches feedback for a given interview session.
 * @param sessionId Unique identifier of the session
 */
export async function getFeedback(sessionId: string): Promise<Feedback> {
  const response = await fetch(`${API_BASE}/api/interviews/${sessionId}/feedback`);
  if (!response.ok) {
    throw new Error(`Failed to get feedback: ${response.statusText}`);
  }
  return response.json();
}

// You can add other interview-related API calls here later
