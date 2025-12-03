// src/hooks/enrollment/useEnrollmentOne.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { EnrollmentWithDetails } from '@/types/enrollment.type'

export const useEnrollmentOne = (id: number | string | undefined) => {
  return useQuery<EnrollmentWithDetails>({
    queryKey: ['enrollment', id],
    queryFn: async () => {
      const res = await api.get(`/enrollments/${id}`)
      return res.data.data
    },
    enabled: !!id, // Chỉ fetch khi có ID
  })
}