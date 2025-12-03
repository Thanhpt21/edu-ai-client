// src/hooks/assignment/useSearchAssignments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseSearchAssignmentsParams {
  keyword?: string
  courseId?: number | string
  lessonId?: number | string
  status?: string
  page?: number
  limit?: number
}

export const useSearchAssignments = ({
  keyword,
  courseId,
  lessonId,
  status,
  page = 1,
  limit = 10
}: UseSearchAssignmentsParams = {}) => {
  return useQuery({
    queryKey: ['searchAssignments', keyword, courseId, lessonId, status, page, limit],
    queryFn: async () => {
      const res = await api.get('/assignments/search/advanced', {
        params: { 
          keyword, 
          courseId, 
          lessonId, 
          status, 
          page, 
          limit 
        },
      })
      return res.data.data // { data: [], total, page, pageCount }
    },
    enabled: !!keyword || !!courseId || !!lessonId || !!status,
  })
}