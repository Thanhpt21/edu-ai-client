// src/hooks/lesson/useLessonOneForAdmin.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useLessonOneForAdmin = (id: number | string) => {
  return useQuery({
    queryKey: ['lesson', 'admin', id],
    queryFn: async () => {
      const res = await api.get(`/lessons/admin/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}