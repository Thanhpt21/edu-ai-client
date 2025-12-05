// src/types/quiz-question.type.ts
export interface QuizQuestion {
  id: number;
  quizId: number;
  question: string;
  options: any[];
  correct: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizQuestionQueryParams {
  page?: number;
  limit?: number;
  quizId?: number;
  search?: string;
  randomize?: boolean;
}

export interface CreateQuizQuestionDto {
  quizId: number;
  question: string;
  options: any[];
  correct: string;
}

export interface UpdateQuizQuestionDto {
  question?: string;
  options?: any[];
  correct?: string;
}

export interface PaginatedQuizQuestions {
  data: QuizQuestion[];
  total: number;
  page: number;
  pageCount: number;
}