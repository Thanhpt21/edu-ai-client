// src/app/courses/[id]/lessons/components/QuizHistory.tsx
'use client'

import { useState } from 'react'
import { 
  Table, 
  Typography, 
  Card, 
  Tag, 
  Button, 
  Spin, 
  Empty,
  Statistic,
  Row,
  Col,
  Progress
} from 'antd'
import { 
  EyeOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined,
  TrophyOutlined,
  BarChartOutlined,
  NumberOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useUserQuizAttempts } from '@/hooks/quiz-attempt/useUserQuizAttempts'
import QuizQuestions from './QuizQuestions'

const { Text, Title } = Typography

interface QuizHistoryProps {
  quizId: number
  userId: number
  onClose?: () => void
}

interface Attempt {
  id: number
  quizId: number
  studentId: number
  startedAt: string
  submittedAt: string
  score: number
  answers: Array<{
    isCorrect: boolean
    timeSpent: number
    questionId: number
    selectedOption: string
  }>
  attemptCount: number
  quiz?: {
    id: number
    title: string
    courseId: number
    lessonId: number
    passingScore?: number
  }
}

interface QuizStats {
  totalAttempts: number
  submittedAttempts: number
  highestScore: number
  averageScore: number
  completionRate: number
}

export default function QuizHistory({ 
  quizId, 
  userId,
  onClose 
}: QuizHistoryProps) {
  const { 
    data: apiData, 
    isLoading, 
    error,
    refetch
  } = useUserQuizAttempts(quizId, userId)

  const [expandedAttemptId, setExpandedAttemptId] = useState<number | null>(null)

  const attempts: Attempt[] = apiData?.attempts || []
  const stats: QuizStats = apiData?.stats || {
    totalAttempts: 0,
    submittedAttempts: 0,
    highestScore: 0,
    averageScore: 0,
    completionRate: 0
  }

  // Hàm xem chi tiết - toggle expand
  const handleViewDetails = (attempt: Attempt) => {
    if (expandedAttemptId === attempt.id) {
      setExpandedAttemptId(null) // Đóng nếu đang mở
    } else {
      setExpandedAttemptId(attempt.id) // Mở attempt này
    }
  }

  // Chuyển đổi answers từ attempt thành format cho QuizQuestions
  const convertAnswersToUserAnswers = (attempt: Attempt) => {
    const userAnswers: Record<number, any> = {}
    attempt.answers?.forEach((answer) => {
      if (answer.questionId) {
        userAnswers[answer.questionId] = answer.selectedOption
      }
    })
    return userAnswers
  }

  // Chuyển đổi thành result format cho QuizQuestions
  const convertAttemptToResult = (attempt: Attempt) => {
    const correctCount = attempt.answers?.filter(a => a.isCorrect).length || 0
    const totalQuestions = attempt.answers?.length || 0
    
    return {
      id: attempt.id,
      percentage: attempt.score,
      score: correctCount,
      totalQuestions: totalQuestions,
      passed: attempt.score >= (attempt.quiz?.passingScore || 70),
      submittedAt: attempt.submittedAt,
      details: attempt.answers?.map((answer, index) => ({
        questionId: answer.questionId,
        question: `Câu ${index + 1}`,
        userAnswer: answer.selectedOption,
        correctAnswer: '', // Sẽ được load từ QuizQuestions
        isCorrect: answer.isCorrect,
        explanation: null
      }))
    }
  }

  const columns = [
    {
      title: 'Lần',
      key: 'index',
      render: (_: any, __: any, index: number) => (
        <div className="text-center font-semibold">#{index + 1}</div>
      ),
      width: 70,
      align: 'center' as const,
    },
    {
      title: 'Điểm số',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => (
        <Tag 
          color={score >= 70 ? "green" : "red"}
          icon={score >= 70 ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          className="text-base font-semibold px-3 py-1"
        >
          {score}%
        </Tag>
      ),
      align: 'center' as const,
      sorter: (a: Attempt, b: Attempt) => a.score - b.score,
      width: 120,
    },
    {
      title: 'Thời gian nộp',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      render: (date: string) => (
        <div className="text-center">
          <div className="font-medium">{new Date(date).toLocaleDateString('vi-VN')}</div>
          <Text type="secondary" className="text-xs">
            {new Date(date).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </div>
      ),
      sorter: (a: Attempt, b: Attempt) => 
        new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime(),
      width: 150,
    },
    {
      title: 'Trạng thái',
      key: 'passed',
      render: (_: any, record: Attempt) => (
        <Tag color={record.score >= 70 ? "green" : "red"} className="px-3 py-1">
          {record.score >= 70 ? 'Đã đạt' : 'Chưa đạt'}
        </Tag>
      ),
      align: 'center' as const,
      width: 120,
    },
    {
      title: 'Số câu đúng',
      key: 'correctCount',
      render: (_: any, record: Attempt) => {
        const correctCount = record.answers?.filter((answer: any) => answer.isCorrect).length || 0
        const totalQuestions = record.answers?.length || 0
        return (
          <div className="text-center">
            <Text strong className="text-base">
              {correctCount}/{totalQuestions}
            </Text>
            <div className="mt-1">
              <Progress 
                percent={(correctCount / totalQuestions) * 100} 
                size="small" 
                showInfo={false}
                strokeColor={correctCount / totalQuestions >= 0.7 ? "#52c41a" : "#ff4d4f"}
              />
            </div>
          </div>
        )
      },
      align: 'center' as const,
      width: 140,
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Attempt) => {
        const hasAnswers = record.answers && record.answers.length > 0
        const isExpanded = expandedAttemptId === record.id
        return (
          <div className="flex justify-center">
            <Button
              type={isExpanded ? "default" : "primary"}
              icon={<EyeOutlined />}
              onClick={() => handleViewDetails(record)}
              disabled={!hasAnswers}
              size="middle"
            >
              {!hasAnswers ? 'Không có dữ liệu' : isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
            </Button>
          </div>
        )
      },
      align: 'center' as const,
      width: 160,
    },
  ]

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Spin tip="Đang tải lịch sử..." size="large" />
      </div>
    )
  }

  if (error) {
    return (
      <Empty
        description="Không thể tải lịch sử làm bài"
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  if (attempts.length === 0) {
    return (
      <Empty
        description={
          <div>
            <div className="text-gray-600 mb-2">
              Chưa có lịch sử làm bài cho quiz này
            </div>
            <Text type="secondary">Hãy hoàn thành bài kiểm tra để xem lịch sử</Text>
            {onClose && (
              <div className="mt-4">
                <Button type="primary" onClick={onClose}>
                  <ArrowLeftOutlined /> Quay lại
                </Button>
              </div>
            )}
          </div>
        }
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header với nút reload */}
      <div className="flex justify-between items-center">
        <Title level={3} className="mb-0">📊 Thống kê & Lịch sử</Title>
        <Button 
          type="default" 
          onClick={() => refetch()}
          loading={isLoading}
        >
          🔄 Tải lại
        </Button>
      </div>

      {/* Thống kê tổng quan */}
      <Card title="Thống kê tổng quan" className="shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={12} md={6}>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Statistic
                title="Tổng số lần làm"
                value={stats.totalAttempts}
                prefix={<NumberOutlined />}
                valueStyle={{ color: '#1890ff', fontSize: '28px' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Statistic
                title="Điểm cao nhất"
                value={stats.highestScore}
                suffix="%"
                prefix={<TrophyOutlined />}
                valueStyle={{ color: '#52c41a', fontSize: '28px' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Statistic
                title="Điểm trung bình"
                value={Math.round(stats.averageScore)}
                suffix="%"
                prefix={<BarChartOutlined />}
                valueStyle={{ color: '#fa8c16', fontSize: '28px' }}
              />
            </div>
          </Col>
          <Col xs={12} sm={12} md={6}>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Statistic
                title="Tỷ lệ hoàn thành"
                value={stats.completionRate}
                suffix="%"
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#722ed1', fontSize: '28px' }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Bảng lịch sử với expandable rows */}
      <Card title="Lịch sử các lần làm bài" className="shadow-sm">
        <Table
          dataSource={attempts}
          columns={columns}
          rowKey="id"
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20', '50'],
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lần làm`
          }}
          expandable={{
            expandedRowKeys: expandedAttemptId ? [expandedAttemptId] : [],
            expandedRowRender: (record: Attempt) => {
              return (
                <div className="">
  

                  {/* Hiển thị chi tiết từng câu hỏi với QuizQuestions ở chế độ review */}
                  <QuizQuestions
                    quizId={quizId}
                    userId={userId}
                    quiz={record.quiz || { 
                      id: quizId, 
                      passingScore: 70,
                      timeLimit: null 
                    }}
                    userAnswers={convertAnswersToUserAnswers(record)}
                    isSubmitted={true}
                    result={convertAttemptToResult(record)}
                    attemptId={record.id}
                    onAnswerChange={() => {}}
                    onSubmit={async () => {}}
                    onRetry={() => {
                      setExpandedAttemptId(null)
                    }}
                    isReviewMode={true}
                    isLoadingSubmit={false}
                  />
                </div>
              )
            },
            expandIcon: () => null, // Ẩn icon expand mặc định
          }}
        />
      </Card>
    </div>
  )
}