// src/hooks/tag/useTags.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseTagsParams {
  page?: number
  limit?: number
  search?: string
}

export const useTags = ({
  page = 1,
  limit = 10,
  search = '',
}: UseTagsParams = {}) => {
  return useQuery({
    queryKey: ['tags', page, limit, search],
    queryFn: async () => {
      const res = await api.get('/tags', {
        params: { page, limit, search },
      })
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}