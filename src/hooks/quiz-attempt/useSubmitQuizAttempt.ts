// src/hooks/quiz-attempt/useSubmitQuizAttempt.ts (hook đã sửa)
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface SubmitQuizAttemptData {
  answers: any[]
  score?: number
}

// Hook đã sửa: không nhận attemptId làm parameter nữa
export const useSubmitQuizAttempt = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      attemptId, 
      ...data 
    }: SubmitQuizAttemptData & { attemptId: number | string }) => {
      console.log(`📤 Submitting quiz attempt ${attemptId} with score: ${data.score}%`)
      
      const res = await api.post(`/quiz-attempts/${attemptId}/submit`, data)
      return res.data.data
    },
    onSuccess: (data, variables) => {

      // Invalidate các query liên quan
      queryClient.invalidateQueries({ queryKey: ['quiz-attempt', variables.attemptId] })
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] })
      queryClient.invalidateQueries({ queryKey: ['user-quiz-attempts'] })
      
      if (data.quizId) {
        queryClient.invalidateQueries({ queryKey: ['quiz-statistics', data.quizId] })
        queryClient.invalidateQueries({ queryKey: ['user-quiz-attempts', data.quizId] })
        queryClient.invalidateQueries({ queryKey: ['lesson-quizzes', data.lessonId] })
      }
    },
    onError: (error: any) => {
      console.error('Error response:', error.response?.data)
    },
  })
}