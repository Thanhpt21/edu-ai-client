import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseQuizQuestionsParams {
  quizId?: number | string
  page?: number
  limit?: number
  search?: string
  randomize?: boolean
}

export const useQuizQuestions = ({
  quizId,
  page = 1,
  limit = 10,
  search = '',
  randomize = false
}: UseQuizQuestionsParams = {}) => {
  return useQuery({
    queryKey: ['quiz-questions', quizId, page, limit, search, randomize],
    queryFn: async () => {
      const res = await api.get('/quiz-questions', {
        params: { quizId, page, limit, search, randomize },
      })
      return res.data.data // { data: [], total, page, pageCount }
    },
    enabled: !!quizId,
  })
}