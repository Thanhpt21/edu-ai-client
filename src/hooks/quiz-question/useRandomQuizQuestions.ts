// src/hooks/quiz-question/useRandomQuizQuestions.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useRandomQuizQuestions = (
  quizId: number | string, 
  limit?: number
) => {
  return useQuery({
    queryKey: ['random-quiz-questions', quizId, limit],
    queryFn: async () => {
      const res = await api.get(`/quiz-questions/quiz/${quizId}`, {
        params: { randomize: true, limit },
      })
      return res.data.data
    },
    enabled: !!quizId,
  })
}