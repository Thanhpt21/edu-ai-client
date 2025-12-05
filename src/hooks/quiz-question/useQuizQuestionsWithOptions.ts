// src/hooks/quiz-question/useQuizQuestionsWithOptions.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseQuizQuestionsWithOptionsParams {
  quizId: number | string
  randomizeOptions?: boolean
  hideCorrectAnswers?: boolean
}

export const useQuizQuestionsWithOptions = ({
  quizId,
  randomizeOptions = false,
  hideCorrectAnswers = false
}: UseQuizQuestionsWithOptionsParams) => {
  return useQuery({
    queryKey: ['quiz-questions-with-options', quizId, randomizeOptions, hideCorrectAnswers],
    queryFn: async () => {
      const res = await api.get(`/quiz-questions/quiz/${quizId}`, {
        params: { randomize: randomizeOptions },
      })
      
      let questions = res.data.data
      
      // Hide correct answers if needed
      if (hideCorrectAnswers && questions) {
        questions = questions.map((q: any) => ({
          ...q,
          correct: undefined // Hide correct answer
        }))
      }
      
      return questions
    },
    enabled: !!quizId,
  })
}