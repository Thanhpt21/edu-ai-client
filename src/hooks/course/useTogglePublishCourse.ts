// src/hooks/course/useTogglePublishCourse.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useTogglePublishCourse = () => {
  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.patch(`/courses/${id}/publish`)
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}