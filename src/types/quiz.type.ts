// src/types/quiz.type.ts
export interface Quiz {
  id: number;
  title: string;
  description: string | null;
  courseId: number | null;
  lessonId: number | null;
  duration: number | null;
  isPublished: boolean;
  randomizeQuestions: boolean;
  questionOrder: any | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuizWithRelations extends Quiz {
  course?: {
    id: number;
    title: string;
    slug: string;
    level: string;
  };
  lesson?: {
    id: number;
    title: string;
    order: number;
  };
  stats?: {
    totalQuestions: number;
    totalAttempts: number;
    averageScore: number;
  };
}

export interface QuizQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  courseId?: number;
  lessonId?: number;
  isPublished?: boolean;
}

export interface CreateQuizDto {
  title: string;
  description?: string;
  courseId?: number | null;
  lessonId?: number | null;
  duration?: number | null;
  isPublished?: boolean;
  randomizeQuestions?: boolean;
}

export interface UpdateQuizDto {
  title?: string;
  description?: string | null;
  courseId?: number | null;
  lessonId?: number | null;
  duration?: number | null;
  isPublished?: boolean;
  randomizeQuestions?: boolean;
}

export interface PaginatedQuizzes {
  data: QuizWithRelations[];
  total: number;
  page: number;
  pageCount: number;
}

export interface QuizStats {
  totalQuizzes: number;
  publishedQuizzes: number;
  totalQuestions: number;
  totalAttempts: number;
  averageScore: number;
}