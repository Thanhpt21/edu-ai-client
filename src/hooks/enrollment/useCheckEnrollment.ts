// src/hooks/enrollment/useCheckEnrollment.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { EnrollmentCheckResponse } from '@/types/enrollment.type'

export const useCheckEnrollment = (
  userId: number | string | undefined,
  courseId: number | string | undefined
) => {
  return useQuery<EnrollmentCheckResponse>({
    queryKey: ['checkEnrollment', userId, courseId],
    queryFn: async () => {
      const res = await api.get(`/enrollments/check/${userId}/${courseId}`)
      const enrollment = res.data.data
      return {
        isEnrolled: !!enrollment,
        enrollment
      }
    },
    enabled: !!userId && !!courseId,
  })
}