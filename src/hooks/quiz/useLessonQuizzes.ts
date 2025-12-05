import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useLessonQuizzes = (lessonId: number | string) => {
  return useQuery({
    queryKey: ['lesson-quizzes', lessonId],
    queryFn: async () => {
      const res = await api.get(`/quizzes/lesson/${lessonId}`)
      return res.data.data // array of quizzes
    },
    enabled: !!lessonId,
  })
}