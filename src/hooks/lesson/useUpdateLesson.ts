// src/hooks/lesson/useUpdateLesson.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useUpdateLesson = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number | string
      data: any
    }) => {
      const res = await api.put(`/lessons/${id}`, data)
      return res.data.data
    },
  })
}