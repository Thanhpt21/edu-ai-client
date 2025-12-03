// src/hooks/assignment/useDeleteAssignmentFile.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteAssignmentFile = () => {
  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.delete(`/assignments/${id}/file`)
      return res.data // { success, message, data }
    },
  })
}