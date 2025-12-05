import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface SubmitQuizAttemptData {
  answers: any[]
  score?: number
}

export const useSubmitQuizAttempt = (attemptId: number | string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: SubmitQuizAttemptData) => {
      const res = await api.post(`/quiz-attempts/${attemptId}/submit`, data)
      return res.data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt', attemptId] })
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] })
      if (data.quizId) {
        queryClient.invalidateQueries({ queryKey: ['quiz-statistics', data.quizId] })
      }
    },
  })
}