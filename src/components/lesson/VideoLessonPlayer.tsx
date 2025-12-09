// src/app/courses/[id]/lessons/components/VideoLessonPlayer.tsx
'use client'

import { Card, Typography, Tag, Space, Button } from 'antd'
import { 
  VideoCameraOutlined, 
  ClockCircleOutlined, 
  EyeOutlined, 
  PlayCircleOutlined,
  YoutubeOutlined,
  CloudUploadOutlined 
} from '@ant-design/icons'
import { useMemo, useCallback } from 'react'

const { Text } = Typography

// 🎯 Hàm phát hiện loại video
const detectVideoType = (url: string): 'youtube' | 'uploaded' | 'external' => {
  if (!url) return 'external';
  
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (url.includes('supabase.co') || url.includes('supabase.in') || 
      url.includes('storage.googleapis') || url.includes('cdn')) {
    return 'uploaded';
  }
  
  return 'external';
};

// 🎯 Hàm trích xuất YouTube ID
const extractYoutubeId = (url: string) => {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

// 🎯 Component Video Player trực tiếp - React.memo để tránh re-render
const DirectVideoPlayer = ({ url }: { url: string }) => {
  const videoType = useMemo(() => detectVideoType(url), [url]);
  const youtubeId = useMemo(() => extractYoutubeId(url), [url]);

  // 📝 Console logs được bọc trong useMemo để chỉ chạy khi cần
  useMemo(() => {
    console.log('🎬 DirectVideoPlayer Debug:', {
      url,
      videoType,
      youtubeId,
      urlLength: url?.length,
      urlStart: url?.substring(0, 50)
    });
  }, [url, videoType, youtubeId]);

  const typeInfo = useMemo(() => {
    switch (videoType) {
      case 'youtube': 
        return { 
          text: 'YouTube Video', 
          color: 'red', 
          icon: <YoutubeOutlined />
        };
      case 'uploaded': 
        return { 
          text: 'Video bài giảng', 
          color: 'green', 
          icon: <CloudUploadOutlined />
        };
      default: 
        return { 
          text: 'Video', 
          color: 'blue', 
          icon: <VideoCameraOutlined />
        };
    }
  }, [videoType]);

  // Callbacks cho video events
  const handleLoadStart = useCallback(() => {
    console.log('🔄 Video loading started');
  }, []);

  const handleLoadedMetadata = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.log('✅ Video metadata loaded:', {
      duration: e.currentTarget.duration,
      videoWidth: e.currentTarget.videoWidth,
      videoHeight: e.currentTarget.videoHeight
    });
  }, []);

  const handleCanPlay = useCallback(() => {
    console.log('✅ Video can play');
  }, []);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLVideoElement>) => {
    console.error('❌ Video error:', {
      error: e.currentTarget.error,
      networkState: e.currentTarget.networkState,
      readyState: e.currentTarget.readyState
    });
  }, []);

  // Nếu không có URL
  if (!url) {
    console.log('❌ No video URL provided');
    return (
      <div className="flex flex-col items-center justify-center h-full text-white bg-black">
        <VideoCameraOutlined className="text-6xl mb-4 text-gray-400" />
        <Text className="text-lg text-gray-300">Chưa có video bài giảng</Text>
        <Text type="secondary" className="text-gray-500 mt-2">
          Giảng viên sẽ cập nhật video trong thời gian sớm nhất
        </Text>
      </div>
    );
  }

  // YouTube player
  if (videoType === 'youtube' && youtubeId) {
    return (
      <div className="w-full h-full">
        <div className="relative pt-[56.25%]">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&autoplay=0&controls=1&showinfo=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <Tag color={typeInfo.color} className="text-sm font-medium backdrop-blur-sm bg-white/10">
            {typeInfo.icon} {typeInfo.text}
          </Tag>
        </div>
      </div>
    );
  }

  // HTML5 Video player
  return (
    <div className="w-full h-full relative">
      <div className="relative pt-[56.25%]">
        <video
          key={url} // Key để force re-mount khi URL thay đổi
          src={url}
          controls
          controlsList="nodownload"
          className="absolute top-0 left-0 w-full h-full bg-black"
          preload="metadata"
          playsInline
          autoPlay={false}
          onLoadStart={handleLoadStart}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onError={handleError}
        >
          <source src={url} type="video/mp4" />
          <source src={url} type="video/webm" />
          Trình duyệt của bạn không hỗ trợ video tag.
        </video>
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <Tag color={typeInfo.color} className="text-sm font-medium backdrop-blur-sm bg-white/10">
          {typeInfo.icon} {typeInfo.text}
        </Tag>
      </div>
    </div>
  );
};

interface VideoLessonPlayerProps {
  currentVideoUrl: string
  currentLesson: any
  getVideoSourceName: () => React.ReactNode
}

export default function VideoLessonPlayer({ 
  currentVideoUrl, 
  currentLesson, 
  getVideoSourceName 
}: VideoLessonPlayerProps) {
  
  // 📝 Console log chỉ chạy khi props thay đổi
  useMemo(() => {
    console.log('🎥 VideoLessonPlayer Props:', {
      currentVideoUrl,
      hasUrl: !!currentVideoUrl,
      urlType: typeof currentVideoUrl,
      urlLength: currentVideoUrl?.length,
      lessonTitle: currentLesson?.title,
      lessonId: currentLesson?.id
    });
  }, [currentVideoUrl, currentLesson?.title, currentLesson?.id]);

  // Scroll handler với useCallback
  const handleScrollToContent = useCallback(() => {
    document.getElementById('lesson-content')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  }, []);

  return (
    <Card 
      className="shadow-lg border-0 overflow-hidden" 
      bodyStyle={{ padding: 0 }}
    >
      <div className="aspect-video bg-black rounded-t-lg overflow-hidden relative">
        <DirectVideoPlayer url={currentVideoUrl} />
      </div>
      
      <div className="p-6 bg-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Text strong className="text-xl text-gray-900">
                {currentLesson?.title}
              </Text>
              {getVideoSourceName()}
            </div>
            
            <Space size="middle" className="text-gray-600">
              <Text className="flex items-center gap-1">
                <ClockCircleOutlined />
                <span>{currentLesson?.durationMin || '--'} phút</span>
              </Text>
              <Text className="flex items-center gap-1">
                <EyeOutlined />
                <span>{currentLesson?.totalViews?.toLocaleString() || 0} lượt xem</span>
              </Text>
              <Text>
                Bài {currentLesson?.order || 0}
              </Text>
            </Space>
          </div>
          
          {currentLesson?.content && (
            <Button 
              type="primary" 
              ghost
              icon={<PlayCircleOutlined />}
              onClick={handleScrollToContent}
            >
              Xem nội dung
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}