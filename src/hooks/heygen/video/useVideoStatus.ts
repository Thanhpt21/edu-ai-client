// src/hooks/video/useVideoStatus.ts
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { api } from '@/lib/axios'

interface VideoStatusResponse {
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  videoUrl?: string
  progress?: number
}

export const useVideoStatus = (videoId: number, options?: { enabled?: boolean; refetchInterval?: number }) => {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['video-status', videoId],
    queryFn: async (): Promise<VideoStatusResponse> => {
      const res = await api.get(`/videos/${videoId}/status`)
      return res.data.data
    },
    enabled: options?.enabled && !!videoId,
    refetchInterval: options?.refetchInterval || 5000, // Mặc định 5 giây check một lần
  })

  // Khi video hoàn thành, invalidate danh sách videos
  useEffect(() => {
    if (query.data?.status === 'COMPLETED') {
      queryClient.invalidateQueries({ queryKey: ['videos'] })
    }
  }, [query.data?.status, queryClient])

  return query
}