// src/hooks/lesson/useLessons.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseLessonsParams {
  page?: number
  limit?: number
  search?: string
  courseId?: number
}

export const useLessons = ({
  page = 1,
  limit = 10,
  search = '',
  courseId,
}: UseLessonsParams = {}) => {
  return useQuery({
    queryKey: ['lessons', page, limit, search, courseId],
    queryFn: async () => {
      const res = await api.get('/lessons', {
        params: { page, limit, search, courseId },
      })
      return res.data.data
    },
  })
}