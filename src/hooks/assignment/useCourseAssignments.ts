// src/hooks/assignment/useCourseAssignments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCourseAssignments = (courseId: number | string) => {
  return useQuery({
    queryKey: ['courseAssignments', courseId],
    queryFn: async () => {
      const res = await api.get(`/assignments/course/${courseId}`)
      return res.data.data // []
    },
    enabled: !!courseId,
  })
}