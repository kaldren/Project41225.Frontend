import { QuestionScore } from "./QuestionScore";

export interface Feedback {
  clarity: number;
  content: number;
  pace: number;
  questions: QuestionScore[];
}
