// src/types/quiz-attempt.type.ts
export interface QuizAttempt {
  id: number;
  quizId: number;
  studentId: number;
  startedAt: Date;
  submittedAt: Date | null;
  score: number | null;
  answers: any[] | null;
  attemptCount: number;
}

export interface QuizAttemptQueryParams {
  page?: number;
  limit?: number;
  quizId?: number;
  studentId?: number;
  submitted?: boolean;
}

export interface CreateQuizAttemptDto {
  quizId: number;
  studentId: number;
  answers?: any[];
}

export interface SubmitQuizAttemptDto {
  answers: any[];
  score?: number;
}

export interface UpdateQuizAttemptDto {
  score?: number;
  answers?: any[];
}

export interface PaginatedQuizAttempts {
  data: QuizAttempt[];
  total: number;
  page: number;
  pageCount: number;
}

export interface QuizAttemptStats {
  totalAttempts: number;
  submittedAttempts: number;
  averageScore: number;
  highestScore: number;
  completionRate: number;
}

export interface UserQuizStats {
  totalAttempts: number;
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
}