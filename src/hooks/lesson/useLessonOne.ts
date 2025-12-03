// src/hooks/lesson/useLessonOne.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useLessonOne = (id: number | string) => {
  return useQuery({
    queryKey: ['lesson', id],
    queryFn: async () => {
      const res = await api.get(`/lessons/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}