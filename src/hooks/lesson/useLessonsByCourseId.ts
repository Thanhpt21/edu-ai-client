// src/hooks/lesson/useLessonsByCourseId.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Lesson } from '@/types/lesson.type'

export const useLessonsByCourseId = (courseId: number) => {
  return useQuery<Lesson[]>({
    queryKey: ['lessons', 'course', courseId],
    queryFn: async () => {
      try {
        const res = await api.get(`/lessons/course/${courseId}`)
        return res.data.data || []
      } catch (error) {
        console.error('Error fetching lessons by course:', error)
        throw error
      }
    },
    enabled: !!courseId && !isNaN(courseId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}