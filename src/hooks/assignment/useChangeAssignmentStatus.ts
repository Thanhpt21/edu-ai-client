// src/hooks/assignment/useChangeAssignmentStatus.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useChangeAssignmentStatus = () => {
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: number | string
      status: string
    }) => {
      const res = await api.put(`/assignments/${id}/status`, { status })
      return res.data.data
    },
  })
}

