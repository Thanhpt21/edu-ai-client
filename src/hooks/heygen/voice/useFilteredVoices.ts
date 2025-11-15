// hooks/heygen/voice/useFilteredVoices.ts
import { useMemo } from 'react';

export interface Voice {
  id: number;
  voiceId: string;
  name: string;
  displayName: string;
  gender: string;
  language: string;
  language_code: string;
  preview_audio: string;
  is_customized: boolean;
  is_premium: boolean;
  is_free: boolean;
  tier: string;
  createdAt: string;
  updatedAt: string;
}

export interface FilteredVoices {
  eventLabVoices: Voice[];
  systemVoices: Voice[];
  allVoices: Voice[];
}

export const useFilteredVoices = (voices: Voice[] = []): FilteredVoices => {
  const filteredVoices = useMemo(() => {
    const eventLabVoices: Voice[] = [];
    const systemVoices: Voice[] = [];

    voices.forEach(voice => {
      // Giọng EventLab: có format "Tên - Style" và có preview_audio
      if (voice.name.includes(' - ') && voice.preview_audio) {
        eventLabVoices.push(voice);
      } else {
        // Giọng hệ thống
        systemVoices.push(voice);
      }
    });

    return {
      eventLabVoices,
      systemVoices,
      allVoices: voices
    };
  }, [voices]);

  return filteredVoices;
};