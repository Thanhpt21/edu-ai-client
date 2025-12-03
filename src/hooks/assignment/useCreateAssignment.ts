// src/hooks/assignment/useCreateAssignment.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface CreateAssignmentData {
  title: string
  description?: string
  dueDate?: string
  maxScore?: number
  courseId?: number | null
  lessonId?: number | null
  status?: string
  fileUrl?: string
}

export const useCreateAssignment = () => {
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await api.post('/assignments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data.data
    },
  })
}
