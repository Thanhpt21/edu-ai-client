// src/hooks/tag/useTagOne.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useTagOne = (id: number | string) => {
  return useQuery({
    queryKey: ['tag', id],
    queryFn: async () => {
      const res = await api.get(`/tags/${id}`)
      return res.data.data // Lấy data từ { success, message, data }
    },
    enabled: !!id,
  })
}