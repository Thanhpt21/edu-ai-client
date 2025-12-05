import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useQuizQuestionsByQuiz = (
  quizId: number | string, 
  randomize?: boolean
) => {
  return useQuery({
    queryKey: ['quiz-questions-by-quiz', quizId, randomize],
    queryFn: async () => {
      const res = await api.get(`/quiz-questions/quiz/${quizId}`, {
        params: { randomize },
      })
      return res.data.data // array of questions
    },
    enabled: !!quizId,
  })
}