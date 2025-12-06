// src/hooks/quiz/useLessonQuizzes.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useLessonQuizzes = (lessonId: number | string) => {
  return useQuery({
    queryKey: ['lesson-quizzes', lessonId],
    queryFn: async () => {
      console.log(`🔍 useLessonQuizzes called with lessonId: ${lessonId}`)
      
      if (!lessonId || lessonId === 0) {
        console.log('⚠️ lessonId is invalid, returning empty array')
        return []
      }
      
      try {
        const res = await api.get(`/quizzes/lesson/${lessonId}`)
        console.log('✅ API response:', res.data)
        
        const quizzes = res.data.data || []
        console.log(`📊 Extracted ${quizzes.length} quizzes`)
        
        return quizzes
      } catch (error: any) {
        console.error('❌ API error:', error)
        console.error('❌ Error details:', error.response?.data)
        throw error
      }
    },
    enabled: !!lessonId && lessonId !== 0,
    staleTime: 1000 * 60 * 5,
   
  })
}