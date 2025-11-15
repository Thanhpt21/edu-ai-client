// src/types/heygen/video.ts
export interface HeygenVideo {
  id: number;
  videoId: string;
  userId?: number;
  lessonId?: number;
  avatarId: number;
  voiceId: number;
  title?: string;
  inputText: string;
  status: string;
  
  // Background settings
  backgroundType?: string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  backgroundVideoUrl?: string;
  backgroundPlayStyle?: string;
  
  // Video settings
  dimensionWidth: number;
  dimensionHeight: number;
  isWebM: boolean;
  
  // Result URLs
  videoUrl?: string;
  supabaseVideoUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  errorMessage?: string;
  
  // Download status
  isDownloaded: boolean;
  downloadedAt?: string;
  
  // Metadata
  metadata?: any;
  
  // System fields
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  lastError?: string;
  
  // Relations (optional)
  avatar?: any;
  voice?: any;
  user?: any;
  lesson?: any;
}

export interface VideoStatusResponse {
  success: boolean;
  message: string;
  data: HeygenVideo;
}

export interface CreateVideoForm {
  avatarId: number;
  voiceId: number;
  inputText: string;
  title: string;
  lessonId: number;
  dimensionWidth: number;
  dimensionHeight: number;
}

export interface AIVideoItemProps {
  video: HeygenVideo;
  autoSync?: boolean;
}

export interface LessonAIVideosProps {
  heygenVideos?: HeygenVideo[];
  lessonId: number;
  onVideoCreated?: () => void;
}