// src/hooks/heygen/useFreeAvatars.ts
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

interface FreeAvatarsResponse {
  success: boolean
  message: string
  data: Avatar[]
}

export const useFreeAvatars = (search?: string) => {
  return useQuery<Avatar[], Error>({
    queryKey: ['avatars', 'free', search],
    queryFn: async () => {
      const url = search 
        ? `/heygen/avatars/free/all?search=${encodeURIComponent(search)}`
        : '/heygen/avatars/free/all'
      
      const res = await api.get<FreeAvatarsResponse>(url)
      return res.data.data
    },
  })
}