// src/hooks/video/useGenerateVideo.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export interface GenerateVideoDto {
  avatarId: number
  voiceId: number
  inputText: string
  title: string
  lessonId?: number
  backgroundType?: 'color' | 'image' | 'video'
  backgroundColor?: string
  backgroundImageUrl?: string
  backgroundVideoUrl?: string
  backgroundPlayStyle?: 'fit_to_scene' | 'freeze' | 'loop' | 'full_video'
  dimensionWidth?: number
  dimensionHeight?: number
  isWebM?: boolean
}

export interface VideoResponseDto {
  id: number
  videoId: string
  userId: number
  lessonId: number | null
  avatarId: number
  voiceId: number
  title: string
  inputText: string
  status: string
  videoUrl: string | null
  duration: number | null
  createdAt: string
  updatedAt: string
}

interface GenerateVideoResponse {
  success: boolean
  message: string
  data: VideoResponseDto
}

export const useGenerateVideo = () => {
  return useMutation<GenerateVideoResponse, Error, GenerateVideoDto>({
    mutationFn: async (data: GenerateVideoDto) => {
      const res = await api.post('/heygen/videos/generate', data)
      return res.data
    },
  })
}