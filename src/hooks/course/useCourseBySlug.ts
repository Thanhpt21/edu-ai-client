// src/hooks/course/useCourseBySlug.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCourseBySlug = (slug: string) => {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: async () => {
      const res = await api.get(`/courses/slug/${slug}`)
      return res.data.data // Lấy data từ { success, message, data }
    },
    enabled: !!slug,
  })
}