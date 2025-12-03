// src/hooks/enrollment/useEnrollments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { EnrollmentListResponse, EnrollmentQueryParams } from '@/types/enrollment.type'

export const useEnrollments = (params: EnrollmentQueryParams = {}) => {
  const { page = 1, limit = 10, userId, courseId, search = '' } = params
  
  return useQuery<EnrollmentListResponse>({
    queryKey: ['enrollments', page, limit, userId, courseId, search],
    queryFn: async () => {
      const res = await api.get('/enrollments', {
        params: {
          page,
          limit,
          userId,
          courseId,
          search
        }
      })
      return res.data.data // { data: [], total, page, pageCount }
    },
    // Có thể thêm refetchOnMount, staleTime tùy use case
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}