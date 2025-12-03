// src/hooks/enrollment/useCreateEnrollment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { CreateEnrollmentData, EnrollmentWithDetails } from '@/types/enrollment.type'

export const useCreateEnrollment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateEnrollmentData) => {
      const res = await api.post('/enrollments', data)
      return res.data.data as EnrollmentWithDetails
    },
    onSuccess: (data, variables) => {
      // Invalidate các query liên quan
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      queryClient.invalidateQueries({ queryKey: ['userEnrollments', variables.userId] })
      queryClient.invalidateQueries({ queryKey: ['courseEnrollments', variables.courseId] })
      queryClient.invalidateQueries({ 
        queryKey: ['checkEnrollment', variables.userId, variables.courseId] 
      })
    },
  })
}