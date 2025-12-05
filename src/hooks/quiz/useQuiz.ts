import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useQuiz = (id: number | string) => {
  return useQuery({
    queryKey: ['quiz', id],
    queryFn: async () => {
      const res = await api.get(`/quizzes/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}