// src/hooks/lesson/useUpdateLesson.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { message } from 'antd'

interface UpdateLessonData {
  title?: string
  content?: string
  videoUrl?: string
  order?: number
  courseId?: number
  durationMin?: number
}

interface UpdateLessonResponse {
  success: boolean
  message: string
  data: any
}

export const useUpdateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation<UpdateLessonResponse, Error, {
    id: number | string
    data: UpdateLessonData | FormData
  }>({
    mutationFn: async ({ id, data }) => {
      // Nếu là FormData (có video file)
      if (data instanceof FormData) {
        const response = await api.put(`/lessons/${id}`, data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data
      }
      
      // Nếu là JSON (chỉ có video URL)
      const response = await api.put(`/lessons/${id}`, data)
      return response.data
    },

    onSuccess: (data) => {
      message.success(data.message)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['lesson', data.data?.id] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Cập nhật bài học thất bại'
      message.error(msg)
    },
  })
}