// src/hooks/assignment/useUpdateAssignment.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useUpdateAssignment = () => {
  return useMutation({
    mutationFn: async (params: { id: number | string; formData: FormData }) => {
      const { id, formData } = params
      const res = await api.put(`/assignments/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data.data
    },
  })
}
