// src/hooks/lesson/useCreateLesson.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCreateLesson = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/lessons', data)
      return res.data.data
    },
  })
}