// src/hooks/assignment/useAssignment.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useAssignment = (id: number | string) => {
  return useQuery({
    queryKey: ['assignment', id],
    queryFn: async () => {
      const res = await api.get(`/assignments/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })
}