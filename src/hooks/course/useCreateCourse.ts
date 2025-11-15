// src/hooks/course/useCreateCourse.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCreateCourse = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/courses', data)
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}