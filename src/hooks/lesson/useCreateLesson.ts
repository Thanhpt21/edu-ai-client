// src/hooks/lesson/useCreateLesson.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { message } from 'antd'

interface CreateLessonData {
  title: string
  content?: string
  videoUrl?: string
  order?: number
  courseId: number
  durationMin?: number
}

interface CreateLessonResponse {
  success: boolean
  message: string
  data: any
}

export const useCreateLesson = () => {
  const queryClient = useQueryClient()

  return useMutation<CreateLessonResponse, Error, CreateLessonData | FormData>({
    mutationFn: async (data) => {
      // Nếu là FormData (có video file)
      if (data instanceof FormData) {
        const response = await api.post('/lessons', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        return response.data
      }
      
      // Nếu là JSON (chỉ có video URL)
      const response = await api.post('/lessons', data)
      return response.data
    },

    onSuccess: (data) => {
      message.success(data.message || 'Tạo bài học thành công')
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },

    onError: (error: any) => {
      const msg = error?.response?.data?.message || 'Tạo bài học thất bại'
      message.error(msg)
    },
  })
}