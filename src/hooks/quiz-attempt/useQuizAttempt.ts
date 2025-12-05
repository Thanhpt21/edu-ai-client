import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useQuizAttempt = (id: number | string) => {
  return useQuery({
    queryKey: ['quiz-attempt', id],
    queryFn: async () => {
      const res = await api.get(`/quiz-attempts/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}