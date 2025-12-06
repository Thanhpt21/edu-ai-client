// hooks/quiz-attempt/useUserQuizAttempts.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useUserQuizAttempts = (quizId: number | string, studentId: number | string) => {
  return useQuery({
    queryKey: ['user-quiz-attempts', quizId, studentId],
    queryFn: async () => {
      const res = await api.get(`/quiz-attempts/quiz/${quizId}/user/${studentId}`)
      return res.data.data // { attempts: [], stats: {} }
    },
    enabled: !!quizId && !!studentId,
    staleTime: 1000 * 60 * 5, // 5 phút
  })
}