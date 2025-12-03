// src/hooks/assignment/useAssignmentStats.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useAssignmentStats = (courseId?: number | string, instructorId?: number | string) => {
  return useQuery({
    queryKey: ['assignmentStats', courseId, instructorId],
    queryFn: async () => {
      const res = await api.get('/assignments/stats/summary', {
        params: { courseId, instructorId },
      })
      return res.data.data
    },
    enabled: !!courseId || !!instructorId,
  })
}