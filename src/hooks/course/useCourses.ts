// src/hooks/course/useCourses.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { CourseQuery } from '@/types/course.type'

export const useCourses = ({
  page = 1,
  limit = 10,
  search = '',
  level,
  isPublished = true,
  instructorId,
  categoryId,
  tagId,
  sortBy = 'createdAt',
  sortOrder = 'desc',
}: CourseQuery = {}) => {
  return useQuery({
    queryKey: [
      'courses', 
      page, 
      limit, 
      search, 
      level, 
      isPublished, 
      instructorId, 
      categoryId, 
      tagId,
      sortBy,
      sortOrder
    ],
    queryFn: async () => {
      const params: any = { 
        page, 
        limit, 
        search,
        level,
        isPublished,
        instructorId,
        categoryId,
        tagId
      }
      
      // Chỉ thêm sortBy và sortOrder nếu sortBy tồn tại
      if (sortBy) {
        params.sortBy = sortBy
        params.sortOrder = sortOrder
      }
      
      const res = await api.get('/courses', { params })
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}