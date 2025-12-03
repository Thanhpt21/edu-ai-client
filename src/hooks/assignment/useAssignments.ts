// src/hooks/assignment/useAssignments.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseAssignmentsParams {
  page?: number
  limit?: number
  search?: string
  courseId?: number
  lessonId?: number
  status?: string
}

export const useAssignments = ({
  page = 1,
  limit = 10,
  search = '',
  courseId,
  lessonId,
  status
}: UseAssignmentsParams = {}) => {
  return useQuery({
    queryKey: ['assignments', page, limit, search, courseId, lessonId, status],
    queryFn: async () => {
      const res = await api.get('/assignments', {
        params: { page, limit, search, courseId, lessonId, status },
      })
      return res.data.data // { data: [], total, page, pageCount }
    },
  })
}