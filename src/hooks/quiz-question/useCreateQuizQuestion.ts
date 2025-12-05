// src/hooks/quiz-question/useCreateQuizQuestion.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { CreateQuizQuestionDto } from '@/types/quiz-question.type'

export const useCreateQuizQuestion = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateQuizQuestionDto) => {
      const res = await api.post('/quiz-questions', data)
      return res.data.data
    },
    onSuccess: (data) => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] })
      queryClient.invalidateQueries({ queryKey: ['quiz-questions-by-quiz', data.quizId] })
      queryClient.invalidateQueries({ queryKey: ['quiz', data.quizId] })
    },
  })
}