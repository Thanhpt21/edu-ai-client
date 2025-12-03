// src/hooks/video/useVideos.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export interface Video {
  id: number
  videoId: string
  userId: number
  lessonId: number | null
  avatarId: number
  voiceId: number
  title: string
  inputText: string
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  videoUrl: string | null
  duration: number | null
  createdAt: string
  updatedAt: string
}

// Hook để lấy danh sách videos
export const useVideos = (params?: { lessonId?: number; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['videos', params],
    queryFn: async (): Promise<Video[]> => {
      const res = await api.get('/videos', { params })
      return res.data.data
    },
  })
}

// Hook để lấy video theo ID
export const useVideo = (videoId: number) => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: async (): Promise<Video> => {
      const res = await api.get(`/videos/${videoId}`)
      return res.data.data
    },
    enabled: !!videoId,
  })
}