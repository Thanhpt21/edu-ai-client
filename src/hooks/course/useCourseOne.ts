// src/hooks/course/useCourseOne.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCourseOne = (id: number | string) => {
  return useQuery({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`)
      return res.data.data // Lấy data từ { success, message, data }
    },
    enabled: !!id,
  })
}