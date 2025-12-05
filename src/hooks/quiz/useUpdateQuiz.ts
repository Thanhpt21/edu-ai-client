import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UpdateQuizData {
  title?: string
  description?: string | null
  courseId?: number | null
  lessonId?: number | null
  duration?: number | null
  isPublished?: boolean
  randomizeQuestions?: boolean
  questionOrder?: any | null
}

export const useUpdateQuiz = (id: number | string) => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: UpdateQuizData) => {
      const res = await api.put(`/quizzes/${id}`, data)
      return res.data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz', id] })
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
    },
  })
}