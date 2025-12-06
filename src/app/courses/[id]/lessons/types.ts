// src/app/courses/[id]/lessons/types.ts
export type QuizType = {
  id: number
  title: string
  description?: string
  lessonId: number
  isPublished: boolean
  timeLimit?: number
  passingScore: number
  totalQuestions?: number
  stats?: {
    totalQuestions: number
    totalAttempts: number
    averageScore: number
  }
}

export type QuizQuestionType = {
  id: number
  quizId: number
  question: string
  options: string[]
  correct: string
  explanation?: string
}

export type QuizAttemptType = {
  id: number
  quizId: number
  studentId: number
  startedAt: string
  submittedAt?: string
  score?: number
  answers?: any[]
  attemptCount: number
}

export type UserQuizStatsType = {
  attempts: QuizAttemptType[]
  stats: {
    totalAttempts: number
    highestScore: number
    averageScore: number
    lastAttemptScore: number
    lastAttemptAt: string
  }
}