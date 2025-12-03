// src/hooks/assignment/useDeleteAssignment.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteAssignment = () => {
  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.delete(`/assignments/${id}`)
      return res.data // { success, message, data }
    },
  })
}