import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface CreateQuizData {
  title: string
  description?: string
  courseId?: number | null
  lessonId?: number | null
  duration?: number | null
  isPublished?: boolean
  randomizeQuestions?: boolean
  questionOrder?: any
}

export const useCreateQuiz = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateQuizData) => {
      const res = await api.post('/quizzes', data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
    },
  })
}