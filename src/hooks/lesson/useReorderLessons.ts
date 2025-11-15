// src/hooks/lesson/useReorderLessons.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useReorderLessons = () => {
  return useMutation({
    mutationFn: async ({
      courseId,
      lessons,
    }: {
      courseId: number
      lessons: Array<{ id: number; order: number }>
    }) => {
      const res = await api.post(`/lessons/course/${courseId}/reorder`, { lessons })
      return res.data.data
    },
  })
}