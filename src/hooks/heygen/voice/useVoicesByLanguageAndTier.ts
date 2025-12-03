// src/hooks/heygen/useVoicesByLanguageAndTier.ts
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

export const useVoicesByLanguageAndTier = (language: string, tier: string) => {
  return useQuery<Voice[], Error>({
    queryKey: ['voices', language, tier],
    queryFn: async () => {
      const res = await api.get<VoicesResponse>(`/heygen/voices/language/${language}/tier/${tier}`)
      return res.data.data
    },
    enabled: !!language && !!tier,
  })
}