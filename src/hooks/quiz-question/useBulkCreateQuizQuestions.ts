// src/hooks/quiz-question/useBulkCreateQuizQuestions.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { CreateQuizQuestionDto } from '@/types/quiz-question.type'

export const useBulkCreateQuizQuestions = (quizId: number | string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (questions: CreateQuizQuestionDto[]) => {
      const res = await api.post(`/quiz-questions/bulk/${quizId}`, questions)
      return res.data.data
    },
    onSuccess: () => {
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] })
      queryClient.invalidateQueries({ queryKey: ['quiz-questions-by-quiz', quizId] })
      queryClient.invalidateQueries({ queryKey: ['quiz', quizId] })
    },
  })
}