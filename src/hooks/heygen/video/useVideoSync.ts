// src/hooks/heygen/video/useVideoSync.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { HeygenVideo, VideoStatusResponse } from '@/types/heygen/video'

interface UseVideoSyncParams {
  videoId: number
  enabled?: boolean
  refetchInterval?: number | false 
}

export const useVideoSync = ({
  videoId,
  enabled = true,
  refetchInterval = 10000,
}: UseVideoSyncParams) => {
  return useQuery({
    queryKey: ['video-status', videoId],
    queryFn: async (): Promise<HeygenVideo> => {
      // 🎯 SỬA: GỌI ENDPOINT CHI TIẾT THAY VÌ STATUS
      const res = await api.get<VideoStatusResponse>(`/heygen/videos/${videoId}`)
      return res.data.data
    },
    enabled: enabled && !!videoId,
    refetchInterval: (query) => {
      const data = query.state.data
      if (data && (data.status === 'COMPLETED' || data.status === 'FAILED')) {
        return false
      }
      return refetchInterval
    },
    refetchIntervalInBackground: true,
    staleTime: 0,
  })
}