// src/hooks/tag/useCreateTag.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useCreateTag = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await api.post('/tags', data)
      return res.data.data // Lấy data từ { success, message, data }
    },
  })
}