// src/app/courses/[id]/lessons/components/VideoLessonPlayer.tsx
import { Card, Typography, Tag, Space, Spin } from 'antd'
import { VideoCameraOutlined, ClockCircleOutlined, EyeOutlined, RobotOutlined } from '@ant-design/icons'
import dynamic from 'next/dynamic'

const { Text } = Typography

// Dynamic import ReactPlayer
const ReactPlayer = dynamic(() => import('react-player'), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-gray-800 flex items-center justify-center">
      <Spin size="large" tip="Đang tải video player..." />
    </div>
  )
})

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
  
  const renderVideoPlayer = () => {
    if (!currentVideoUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-white">
          <VideoCameraOutlined className="text-4xl mb-2" />
          <Text className="text-lg">Không có video</Text>
        </div>
      )
    }

    // return (
    //   <div className="w-full h-full">
    //     <ReactPlayer
    //       url={currentVideoUrl}
    //       controls
    //       width="100%"
    //       height="100%"
    //       playing={false}
    //     />
    //   </div>
    // )
  }

  return (
    <Card className="shadow-lg" bodyStyle={{ padding: 0 }}>
      <div className="aspect-video bg-black rounded-t-lg overflow-hidden">
        {renderVideoPlayer()}
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Text strong className="text-lg">
                {currentLesson?.title}
              </Text>
              {getVideoSourceName()}
            </div>
            
            <Space size="large">
              <Text type="secondary">
                <ClockCircleOutlined className="mr-1" />
                {currentLesson?.durationMin || '--'} phút
              </Text>
              <Text type="secondary">
                <EyeOutlined className="mr-1" />
                {currentLesson?.totalViews || 0} lượt xem
              </Text>
              <Text type="secondary">
                Bài {currentLesson?.order || 0}
              </Text>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  )
}