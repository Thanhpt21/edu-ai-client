// src/hooks/heygen/useFreeVietnameseVoices.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface Voice {
  id: number
  voiceId: string
  name: string
  displayName: string
  gender: string
  language: string
  language_code: string
  preview_audio: string
  is_customized: boolean
  is_premium: boolean
  is_free: boolean
  tier: string
  createdAt: string
  updatedAt: string
}

interface VoicesResponse {
  success: boolean
  message: string
  data: Voice[]
}

export const useFreeVietnameseVoices = () => {
  return useQuery<Voice[], Error>({
    queryKey: ['voices', 'vietnamese', 'free'],
    queryFn: async () => {
      const res = await api.get<VoicesResponse>('/heygen/voices/language/Vietnamese/tier/free')
      return res.data.data
    },
  })
}