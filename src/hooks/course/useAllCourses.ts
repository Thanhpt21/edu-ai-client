// src/hooks/course/useAllCourses.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseAllCoursesParams {
  search?: string
  level?: string
  isPublished?: boolean
  instructorId?: number
}

export const useAllCourses = ({
  search = '',
  level,
  isPublished,
  instructorId,
}: UseAllCoursesParams = {}) => {
  return useQuery({
    queryKey: ['allCourses', search, level, isPublished, instructorId],
    queryFn: async () => {
      const res = await api.get('/courses/all/list', {
        params: { search, level, isPublished, instructorId },
      })
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}