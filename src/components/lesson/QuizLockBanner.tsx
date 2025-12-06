// src/app/courses/[id]/lessons/components/QuizLockBanner.tsx
import { Alert, Button } from 'antd'
import { LockOutlined, UnlockOutlined } from '@ant-design/icons'

interface QuizLockBannerProps {
  isLocked: boolean
  currentScore?: number
  requiredScore: number
  onRetry: () => void
}

export default function QuizLockBanner({ 
  isLocked, 
  currentScore, 
  requiredScore,
  onRetry 
}: QuizLockBannerProps) {
  if (!isLocked) return null
  
  return (
    <Alert
      message={
        <div className="flex items-center gap-2">
          <LockOutlined />
          <span>Bài kiểm tra chưa hoàn thành</span>
        </div>
      }
      description={
        <div className="space-y-2">
          <p>
            Bạn cần đạt ít nhất <strong>{requiredScore}%</strong> để mở khóa bài học tiếp theo.
           
          </p>
        </div>
      }
      type="warning"
      showIcon
      className="mb-4"
    />
  )
}