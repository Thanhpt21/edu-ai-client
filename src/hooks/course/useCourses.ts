// src/hooks/course/useCourses.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseCoursesParams {
  page?: number
  limit?: number
  search?: string
  level?: string
  isPublished?: boolean
  instructorId?: number
  categoryId?: number
  tagId?: number
}

export const useCourses = ({
  page = 1,
  limit = 10,
  search = '',
  level,
  isPublished,
  instructorId,
  categoryId,
  tagId,
}: UseCoursesParams = {}) => {
  return useQuery({
    queryKey: ['courses', page, limit, search, level, isPublished, instructorId, categoryId, tagId],
    queryFn: async () => {
      const res = await api.get('/courses', {
        params: { 
          page, 
          limit, 
          search,
          level,
          isPublished,
          instructorId,
          categoryId,
          tagId
        },
      })
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}