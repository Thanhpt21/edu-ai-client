import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useUserQuizStatistics = (studentId: number | string) => {
  return useQuery({
    queryKey: ['user-quiz-statistics', studentId],
    queryFn: async () => {
      const res = await api.get(`/quiz-attempts/user/${studentId}/statistics`)
      return res.data.data
    },
    enabled: !!studentId,
  })
}