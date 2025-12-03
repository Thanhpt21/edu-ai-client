// src/hooks/enrollment/useUserEnrollments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { EnrollmentWithDetails } from '@/types/enrollment.type'

export const useUserEnrollments = (userId: number | string | undefined) => {
  return useQuery<EnrollmentWithDetails[]>({
    queryKey: ['userEnrollments', userId],
    queryFn: async () => {
      const res = await api.get(`/enrollments/user/${userId}`)
      return res.data.data
    },
    enabled: !!userId,
  })
}