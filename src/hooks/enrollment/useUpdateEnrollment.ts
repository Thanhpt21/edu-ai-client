// src/hooks/enrollment/useUpdateEnrollment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { UpdateEnrollmentData } from '@/types/enrollment.type'

export const useUpdateEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: UpdateEnrollmentData }) => {
      const res = await api.put(`/enrollments/${id}`, data)
      return res.data.data
    },
    onSuccess: (data) => {
      // Invalidate các query liên quan
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['enrollment', data.id] })
      queryClient.invalidateQueries({ queryKey: ['userEnrollments', data.userId] })
      queryClient.invalidateQueries({ queryKey: ['courseEnrollments', data.courseId] })
    },
  })
}