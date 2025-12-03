// src/hooks/enrollment/useDeleteEnrollment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: number | string) => {
      const res = await api.delete(`/enrollments/${id}`)
      return res.data
    },
    onSuccess: (_, id) => {
      // Cần thêm logic để lấy userId và courseId từ cache nếu cần
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.removeQueries({ queryKey: ['enrollment', id] })
    },
  })
}