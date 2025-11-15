// src/hooks/video/useDeleteVideo.ts
import { useMutation } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export const useDeleteVideo = () => {
  return useMutation({
    mutationFn: async (videoId: number) => {
      const res = await api.delete(`/videos/${videoId}`)
      return res.data
    },
  })
}