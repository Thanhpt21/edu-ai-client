import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useQuizStatistics = (quizId: number | string) => {
  return useQuery({
    queryKey: ['quiz-statistics', quizId],
    queryFn: async () => {
      const res = await api.get(`/quiz-attempts/quiz/${quizId}/statistics`)
      return res.data.data
    },
    enabled: !!quizId,
  })
}