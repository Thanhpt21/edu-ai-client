// src/hooks/assignment/useUserAssignments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useUserAssignments = (userId: number | string, courseId?: number | string) => {
  return useQuery({
    queryKey: ['userAssignments', userId, courseId],
    queryFn: async () => {
      const res = await api.get(`/assignments/user/${userId}`, {
        params: { courseId },
      })
      return res.data.data // []
    },
    enabled: !!userId,
  })
}