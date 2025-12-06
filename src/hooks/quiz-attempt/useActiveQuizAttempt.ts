// hooks/quiz-attempt/useActiveQuizAttempt.ts (đã cập nhật)
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface ActiveAttempt {
  id: number
  quizId: number
  studentId: number
  startedAt: string
  submittedAt: string | null
  score: number | null
  answers: any[]
  attemptCount: number
  quiz?: {
    id: number
    title: string
    courseId: number
    lessonId: number
  }
}

interface UseActiveQuizAttemptOptions {
  refetchInterval?: number | false
  enabled?: boolean
}

export const useActiveQuizAttempt = (
  quizId: number | string, 
  studentId: number | string,
  options: UseActiveQuizAttemptOptions = {}
) => {
  const { refetchInterval = false, enabled = true } = options
  
  return useQuery({
    queryKey: ['active-quiz-attempt', quizId, studentId],
    queryFn: async () => {
      try {
        const res = await api.get(`/quiz-attempts/quiz/${quizId}/user/${studentId}/active`)
        return res.data.data as ActiveAttempt
      } catch (error: any) {
        if (error.response?.status === 404) {
          return null // Không có attempt active
        }
        throw error
      }
    },
    enabled: !!quizId && !!studentId && enabled,
    staleTime: 1000 * 30, // 30 giây
    refetchInterval,
    retry: 1,
    refetchOnWindowFocus: true,
  })
}