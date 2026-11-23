export type QuestionType = "mcq" | "true_false_group" | "short_answer";

export interface TrueFalseSubItem {
  id?: string;
  label?: "a" | "b" | "c" | "d";
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface Question {
  id?: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  questionType?: QuestionType;
  subItems?: TrueFalseSubItem[];
  acceptedAnswers?: string[];
  answerUnit?: string;
}

export interface Quiz {
  id?: string;
  title: string;
  description?: string | null;
  questions: Question[];
}

export function getQuestionType(q: Question): QuestionType {
  if (
    q.questionType === "true_false_group" ||
    q.questionType === "short_answer" ||
    q.questionType === "mcq"
  ) {
    return q.questionType;
  }
  if (Array.isArray(q.subItems) && q.subItems.length > 0) {
    return "true_false_group";
  }
  if (Array.isArray(q.acceptedAnswers) && q.acceptedAnswers.length > 0) {
    return "short_answer";
  }
  return "mcq";
}
