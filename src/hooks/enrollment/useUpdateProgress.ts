// src/hooks/enrollment/useUpdateProgress.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useUpdateProgress = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.put(`/enrollments/${id}/progress`)
      return res.data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['enrollment', data.id] })
      queryClient.invalidateQueries({ queryKey: ['userEnrollments', data.userId] })
    },
  })
}