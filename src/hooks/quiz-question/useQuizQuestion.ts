import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useQuizQuestion = (id: number | string) => {
  return useQuery({
    queryKey: ['quiz-question', id],
    queryFn: async () => {
      const res = await api.get(`/quiz-questions/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}