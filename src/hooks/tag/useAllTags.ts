// src/hooks/tag/useAllTags.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useAllTags = (search?: string) => {
  return useQuery({
    queryKey: ['allTags', search],
    queryFn: async () => {
      const res = await api.get('/tags/all/list', {
        params: { search },
      })
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}