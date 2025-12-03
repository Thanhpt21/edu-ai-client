// src/hooks/assignment/useLessonAssignments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useLessonAssignments = (lessonId: number | string) => {
  return useQuery({
    queryKey: ['lessonAssignments', lessonId],
    queryFn: async () => {
      const res = await api.get(`/assignments/lesson/${lessonId}`)
      return res.data.data // []
    },
    enabled: !!lessonId,
  })
}