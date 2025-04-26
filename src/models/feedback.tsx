import { QuestionScore } from "./questionScore";

export interface Feedback {
  clarity: number;
  content: number;
  pace: number;
  questions: QuestionScore[];
}
