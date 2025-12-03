// src/hooks/course/useDeleteCourse.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/courses/${id}`)
      return res.data // Trả về toàn bộ { success, message, data }
    },
  })
}