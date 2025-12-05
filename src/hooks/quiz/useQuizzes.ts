import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseQuizzesParams {
  page?: number
  limit?: number
  search?: string
  courseId?: number
  lessonId?: number
  isPublished?: boolean
}

export const useQuizzes = ({
  page = 1,
  limit = 10,
  search = '',
  courseId,
  lessonId,
  isPublished
}: UseQuizzesParams = {}) => {
  return useQuery({
    queryKey: ['quizzes', page, limit, search, courseId, lessonId, isPublished],
    queryFn: async () => {
      const res = await api.get('/quizzes', {
        params: { page, limit, search, courseId, lessonId, isPublished },
      })
      return res.data.data // { data: [], total, page, pageCount }
    },
  })
}