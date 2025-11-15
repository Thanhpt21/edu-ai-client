// src/hooks/heygen/useAvatars.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface Avatar {
  id: number
  avatarId: string
  name: string
  displayName?: string
  gender?: string
  preview_image?: string
  preview_video?: string
  avatar_style: string
  is_customized: boolean
  is_instant: boolean
  is_premium: boolean
  is_free: boolean
  createdAt: string
  updatedAt: string
}

interface AvatarsResponse {
  success: boolean
  message: string
  data: {
    data: Avatar[]
    total: number
    page: number
    pageCount: number
  }
}

interface FreeAvatarsResponse {
  success: boolean
  message: string
  data: Avatar[]
}

interface UseAvatarsParams {
  page?: number
  limit?: number
  search?: string
  isFree?: boolean
  gender?: 'male' | 'female'
}

export const useAvatars = (params: UseAvatarsParams = {}) => {
  const { page = 1, limit = 100, search, isFree, gender } = params

  return useQuery<Avatar[], Error>({
    queryKey: ['avatars', params],
    queryFn: async () => {
      let url = '/heygen/avatars'
      
      if (isFree) {
        url = '/heygen/avatars/free/all'
        if (search) {
          url += `?search=${encodeURIComponent(search)}`
        }

        // FIX: Xử lý response cho free avatars
        const res = await api.get<FreeAvatarsResponse>(url)
        let avatars = res.data.data

        // Filter theo gender nếu có
        if (gender) {
          avatars = avatars.filter((avatar: Avatar) => 
            avatar.gender?.toLowerCase() === gender.toLowerCase()
          )
        }

        return avatars

      } else {
        const queryParams = new URLSearchParams()
        queryParams.append('page', page.toString())
        queryParams.append('limit', limit.toString())
        if (search) queryParams.append('search', search)
        
        url += `?${queryParams.toString()}`

        // FIX: Xử lý response cho paginated avatars
        const res = await api.get<AvatarsResponse>(url)
        let avatars = res.data.data.data

        // Filter theo gender nếu có
        if (gender) {
          avatars = avatars.filter((avatar: Avatar) => 
            avatar.gender?.toLowerCase() === gender.toLowerCase()
          )
        }

        return avatars
      }
    },
  })
}