// src/app/courses/[id]/lessons/components/QuizStats.tsx
import { Card, Statistic, Row, Col, Progress, Typography } from 'antd'
import { 
  TrophyOutlined, 
  HistoryOutlined, 
  BarChartOutlined,
  ClockCircleOutlined 
} from '@ant-design/icons'
import { useUserQuizAttempts } from '@/hooks/quiz-attempt/useUserQuizAttempts'

const { Text } = Typography

interface QuizStatsProps {
  quizId: number
  userId: number
}

export default function QuizStats({ quizId, userId }: QuizStatsProps) {
  const { data: userAttemptsData, isLoading } = useUserQuizAttempts(quizId, userId)
  
  if (isLoading || !userAttemptsData) {
    return null
  }
  
  const { attempts, stats } = userAttemptsData
  
  // Tính toán các chỉ số
  const totalAttempts = stats.totalAttempts || 0
  const averageScore = stats.averageScore || 0
  const highestScore = stats.highestScore || 0
  const lastScore = stats.lastAttemptScore || 0
  const completionRate = attempts.filter((a: any) => a.submittedAt).length / totalAttempts * 100 || 0
  
  return (
    <div className="mt-6">
      <Text strong className="block mb-4">📊 Thống kê bài kiểm tra</Text>
      
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="text-center h-full">
            <Statistic
              title="Số lần làm"
              value={totalAttempts}
              prefix={<HistoryOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="text-center h-full">
            <Statistic
              title="Điểm trung bình"
              value={averageScore}
              suffix="%"
              prefix={<BarChartOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="text-center h-full">
            <Statistic
              title="Điểm cao nhất"
              value={highestScore}
              suffix="%"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card size="small" className="text-center h-full">
            <Statistic
              title="Lần gần nhất"
              value={lastScore}
              suffix="%"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>
      
      {/* Progress bars */}
    <div className="mt-4 space-y-3">
    <div>
        <div className="flex justify-between text-sm mb-1">
        <Text type="secondary">Tỷ lệ hoàn thành</Text>
        <Text strong>{Math.round(completionRate)}%</Text>
        </div>
        <Progress 
        percent={Math.round(completionRate)} 
        size="small" 
        strokeColor="#52c41a"
        format={(percent) => `${Math.round(percent || 0)}%`}
        />
    </div>
    
    <div>
        <div className="flex justify-between text-sm mb-1">
        <Text type="secondary">Điểm trung bình</Text>
        <Text strong>{Math.round(averageScore)}%</Text>
        </div>
        <Progress 
        percent={averageScore} 
        size="small" 
        strokeColor="#1890ff"
        format={(percent) => `${percent ? Math.round(percent) : 0}%`}
        />
    </div>
    </div>
      
      {/* Chi tiết từng lần làm */}
      {attempts.length > 0 && (
        <div className="mt-4">
          <Text strong className="block mb-2">📝 Lịch sử làm bài chi tiết:</Text>
          <div className="space-y-2">
            {attempts.map((attempt: any) => (
              <Card key={attempt.id} size="small" className="border">
                <div className="flex justify-between items-center">
                  <div>
                    <Text strong>Lần {attempt.attemptCount}</Text>
                    <div className="text-sm text-gray-500">
                      {new Date(attempt.startedAt).toLocaleDateString('vi-VN')}
                      {attempt.submittedAt && ` • ${new Date(attempt.submittedAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      attempt.score && attempt.score >= 70 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {attempt.score || 0}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {attempt.submittedAt ? 'Đã nộp' : 'Chưa nộp'}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}