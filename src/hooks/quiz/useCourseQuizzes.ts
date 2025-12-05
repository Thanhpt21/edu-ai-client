import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCourseQuizzes = (courseId: number | string) => {
  return useQuery({
    queryKey: ['course-quizzes', courseId],
    queryFn: async () => {
      const res = await api.get(`/quizzes/course/${courseId}`)
      return res.data.data // array of quizzes
    },
    enabled: !!courseId,
  })
}