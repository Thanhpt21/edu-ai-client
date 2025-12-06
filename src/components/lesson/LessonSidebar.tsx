// src/app/courses/[id]/lessons/components/LessonSidebar.tsx
import { Card, List, Typography, Space, Badge, Progress, Divider } from 'antd'
import { BookOutlined, ClockCircleOutlined, EyeOutlined, CheckCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

interface LessonSidebarProps {
  lessons: any[]
  selectedLessonId: number | null
  completedLessons: Set<number>
  onLessonSelect: (lessonId: number) => void
  getLessonStatus: (lesson: any) => React.ReactNode | null // Thêm prop này
}

export default function LessonSidebar({
  lessons,
  selectedLessonId,
  completedLessons,
  onLessonSelect,
  getLessonStatus
}: LessonSidebarProps) {
  const progressPercentage = () => {
    if (!lessons.length) return 0
    const completedCount = lessons.filter(lesson => 
      completedLessons.has(lesson.id)
    ).length
    return Math.round((completedCount / lessons.length) * 100)
  }

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <BookOutlined />
            Danh sách bài học
          </span>
          <Badge count={lessons.length} color="blue" />
        </div>
      }
      className="shadow-lg sticky top-6"
    >
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        <List
          dataSource={lessons}
          renderItem={(lesson) => (
            <List.Item
              className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-blue-50 ${
                selectedLessonId === lesson.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
              onClick={() => onLessonSelect(lesson.id)}
            >
              <div className="w-full">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedLessonId === lesson.id 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {lesson.order}
                    </div>
                    <Text strong className="truncate">
                      {lesson.title}
                    </Text>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {getLessonStatus(lesson)}
                    {completedLessons.has(lesson.id) && (
                      <CheckCircleOutlined className="text-green-500" />
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <Space size="small">
                    <ClockCircleOutlined />
                    <span>{lesson.durationMin || '--'} phút</span>
                  </Space>
                  
                  <Space size="small">
                    <EyeOutlined />
                    <span>{lesson.totalViews || 0}</span>
                  </Space>
                </div>
              </div>
            </List.Item>
          )}
        />
      </div>
      
      <Divider />
      <div className="text-center">
        <Text strong className="block mb-2">Tiến độ</Text>
        <Progress
          percent={progressPercentage()}
          strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
        />
        <Text type="secondary" className="text-sm">
          {completedLessons.size}/{lessons.length} bài đã hoàn thành
        </Text>
      </div>
    </Card>
  )
}