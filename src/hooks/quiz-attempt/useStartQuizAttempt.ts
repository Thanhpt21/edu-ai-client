import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface StartQuizAttemptData {
  quizId: number
  studentId: number
  answers?: any[]
}

export const useStartQuizAttempt = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: StartQuizAttemptData) => {
      const res = await api.post('/quiz-attempts', data)
      return res.data.data
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['quiz-attempts'] })
      queryClient.invalidateQueries({ queryKey: ['quiz-statistics', variables.quizId] })
    },
  })
}