// src/hooks/heygen/useVideosSync.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { HeygenVideo } from '@/types/heygen/video'

interface UseVideosSyncParams {
  lessonId?: number
  enabled?: boolean
  refetchInterval?: number
}

export const useVideosSync = ({
  lessonId,
  enabled = true,
  refetchInterval = 15000, // 15 giây
}: UseVideosSyncParams = {}) => {
  return useQuery({
    queryKey: ['videos-sync', lessonId],
    queryFn: async (): Promise<HeygenVideo[]> => {
      const params: any = {}
      if (lessonId) params.lessonId = lessonId
      
      const res = await api.get('/heygen/videos', { params })
      return res.data.data.data
    },
    enabled: enabled,
    refetchInterval: (query) => {
      const data = query.state.data
      if (!data) return refetchInterval
      
      // Chỉ refetch nếu còn video đang xử lý
      const hasInProgress = data.some(
        (video: HeygenVideo) => 
          video.status === 'PENDING' || video.status === 'PROCESSING'
      )
      
      return hasInProgress ? refetchInterval : false
    },
    refetchIntervalInBackground: true,
    staleTime: 0,
  })
}