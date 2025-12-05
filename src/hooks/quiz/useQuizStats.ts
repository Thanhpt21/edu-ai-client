import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useQuizStats = (courseId?: number) => {
  return useQuery({
    queryKey: ['quiz-stats', courseId],
    queryFn: async () => {
      const res = await api.get('/quizzes/stats/summary', {
        params: { courseId },
      })
      return res.data.data
    },
  })
}