import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteQuiz = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.delete(`/quizzes/${id}`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quizzes'] })
    },
  })
}