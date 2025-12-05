import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseQuizAttemptsParams {
  page?: number
  limit?: number
  quizId?: number
  studentId?: number
  courseId?: number
  lessonId?: number
  submitted?: boolean
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export const useQuizAttempts = ({
  page = 1,
  limit = 10,
  quizId,
  studentId,
  courseId,
  lessonId,
  submitted,
  sortBy = 'startedAt',
  sortOrder = 'desc'
}: UseQuizAttemptsParams = {}) => {
  return useQuery({
    queryKey: ['quiz-attempts', page, limit, quizId, studentId, courseId, lessonId, submitted, sortBy, sortOrder],
    queryFn: async () => {
      const res = await api.get('/quiz-attempts', {
        params: { page, limit, quizId, studentId, courseId, lessonId, submitted, sortBy, sortOrder },
      })
      return res.data.data // { data: [], total, page, pageCount }
    },
  })
}