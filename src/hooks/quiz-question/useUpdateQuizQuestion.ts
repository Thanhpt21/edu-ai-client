// src/hooks/quiz-question/useUpdateQuizQuestion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { UpdateQuizQuestionDto } from '@/types/quiz-question.type'

export const useUpdateQuizQuestion = (id: number | string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateQuizQuestionDto) => {
      const res = await api.put(`/quiz-questions/${id}`, data)
      return res.data.data
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['quiz-question', id] })
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] })
      queryClient.invalidateQueries({ queryKey: ['quiz-questions-by-quiz', data.quizId] })
    },
  })
}