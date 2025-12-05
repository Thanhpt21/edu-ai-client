// src/hooks/quiz-question/useDeleteQuizQuestion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteQuizQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.delete(`/quiz-questions/${id}`)
      return res.data
    },
    onSuccess: (_, id) => {
      // Note: We don't have quizId here, so we invalidate all quiz-question queries
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] })
      
      // Also remove the specific question from cache
      queryClient.removeQueries({ queryKey: ['quiz-question', id] })
    },
  })
}