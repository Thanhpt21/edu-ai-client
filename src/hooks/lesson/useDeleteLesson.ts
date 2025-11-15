// src/hooks/lesson/useDeleteLesson.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteLesson = () => {
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/lessons/${id}`)
      return res.data
    },
  })
}