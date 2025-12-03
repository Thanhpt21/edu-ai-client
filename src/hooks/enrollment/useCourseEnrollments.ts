// src/hooks/enrollment/useCourseEnrollments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { EnrollmentWithDetails } from '@/types/enrollment.type'

export const useCourseEnrollments = (courseId: number | string | undefined) => {
  return useQuery<EnrollmentWithDetails[]>({
    queryKey: ['courseEnrollments', courseId],
    queryFn: async () => {
      const res = await api.get(`/enrollments/course/${courseId}`)
      return res.data.data
    },
    enabled: !!courseId,
  })
}