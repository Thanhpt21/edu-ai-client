// src/app/courses/[id]/lessons/components/QuizCard.tsx
'use client'

import { useState, useEffect } from 'react'
import { Card, Tag, Typography, Button } from 'antd'
import { 
  CloseOutlined, 
  ClockCircleOutlined, 
  ExclamationCircleOutlined, 
  EyeOutlined, 
  HistoryOutlined, 
  SyncOutlined 
} from '@ant-design/icons'
import QuizQuestions from './QuizQuestions'
import QuizHistory from './QuizHistory'
import { QuizType } from '@/app/courses/[id]/lessons/types'
import { useActiveQuizAttempt } from '@/hooks/quiz-attempt/useActiveQuizAttempt'
import { useUserQuizAttempts } from '@/hooks/quiz-attempt/useUserQuizAttempts'

const { Text } = Typography

interface QuizCardProps {
  quiz: QuizType
  userId: number
  isExpanded: boolean
  quizAnswers: Record<number, any>
  isSubmitted: boolean
  result: any
  activeAttemptId?: number
  refetchInterval: number | false
  onToggleQuiz: (quizId: number) => void
  onStartQuiz: (quizId: number) => Promise<void>
  onViewReview: (quizId: number) => Promise<void>
  onAnswerChange: (quizId: number, questionId: number, value: any) => void
  onSubmitQuiz: (quizId: number, questions: any[]) => Promise<void>
  onRetryQuiz: (quizId: number) => Promise<void>
  onRestoreAttempt: (quizId: number, attemptId: number) => void
  isLoadingSubmit: boolean
}

export default function QuizCard({
  quiz,
  userId,
  isExpanded,
  quizAnswers,
  isSubmitted,
  result,
  activeAttemptId,
  refetchInterval,
  onToggleQuiz,
  onStartQuiz,
  onViewReview,
  onAnswerChange,
  onSubmitQuiz,
  onRetryQuiz,
  onRestoreAttempt,
  isLoadingSubmit,
}: QuizCardProps) {
  const [showHistory, setShowHistory] = useState(false)
  const passingScore = quiz.passingScore || 70
  const hasLocalAttempt = !!activeAttemptId
  const highestScore = result?.percentage || 0
  const hasUserAttempted = result || hasLocalAttempt || isSubmitted

  // Hooks luôn được gọi - không có điều kiện
  const { 
    data: activeAttempt, 
    isLoading: isLoadingActive, 
    refetch: refetchActive 
  } = useActiveQuizAttempt(quiz.id, userId, {
    refetchInterval: refetchInterval && isExpanded ? 10000 : false,
    enabled: isExpanded || !!activeAttemptId
  })

  const { 
    data: userAttemptsData, 
    isLoading: isLoadingHistory, 
    refetch: refetchHistory 
  } = useUserQuizAttempts(quiz.id, userId)

  const hasHistory = userAttemptsData?.attempts?.length > 0
  const hasActiveAttempt = !!activeAttempt
  const historyCount = userAttemptsData?.attempts?.length || 0

  // Auto-restore attempt từ server
  useEffect(() => {
    if (activeAttempt?.id && !hasLocalAttempt) {
      onRestoreAttempt(quiz.id, activeAttempt.id)
    }
  }, [activeAttempt, quiz.id, hasLocalAttempt, onRestoreAttempt])

  // Polling cho real-time updates
  useEffect(() => {
    if (refetchInterval) {
      const interval = setInterval(() => {
        if (hasActiveAttempt || isExpanded) {
          refetchActive()
          refetchHistory()
        }
      }, refetchInterval as number)
      return () => clearInterval(interval)
    }
  }, [refetchInterval, hasActiveAttempt, isExpanded, refetchActive, refetchHistory])

  const handleStartOrContinue = async () => {
    if (hasLocalAttempt && !isSubmitted) {
      if (!isExpanded) {
        onToggleQuiz(quiz.id)
      }
    } else if (result || isSubmitted) {
      await onRetryQuiz(quiz.id)
    } else {
      await onStartQuiz(quiz.id)
    }
  }

  const handleViewReview = async () => {
    await onViewReview(quiz.id)
    if (!isExpanded) {
      onToggleQuiz(quiz.id)
    }
  }

  const getButtonConfig = () => {
    if (isExpanded) {
      return {
        text: 'Đóng',
        icon: <CloseOutlined />,
        type: 'default' as const,
        onClick: () => onToggleQuiz(quiz.id)
      }
    }

    if (hasLocalAttempt && !isSubmitted) {
      return {
        text: 'Tiếp tục làm bài',
        icon: <SyncOutlined />,
        type: 'primary' as const,
        onClick: handleStartOrContinue
      }
    }

    if (hasActiveAttempt) {
      return {
        text: 'Tiếp tục làm bài',
        icon: <SyncOutlined />,
        type: 'primary' as const,
        onClick: handleStartOrContinue
      }
    }

    if (result || isSubmitted || hasHistory) {
      return {
        text: 'Làm bài mới',
        icon: <SyncOutlined />,
        type: 'default' as const,
        onClick: handleStartOrContinue
      }
    }

    return {
      text: 'Làm bài',
      icon: <ExclamationCircleOutlined />,
      type: 'primary' as const,
      onClick: handleStartOrContinue
    }
  }

  const buttonConfig = getButtonConfig()

  return (
    <Card
      className={`mb-4 ${hasUserAttempted ? (highestScore >= passingScore ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Text strong className="text-lg">{quiz.title}</Text>
          <div className="mt-2 space-x-2">
            {quiz.isPublished ? (
              <Tag color="green">Công khai</Tag>
            ) : (
              <Tag color="default">Bản nháp</Tag>
            )}
            {hasUserAttempted && (
              <Tag color={highestScore >= passingScore ? "green" : "red"}>
                {highestScore >= passingScore ? 'Đã đạt' : 'Chưa đạt'}
              </Tag>
            )}
            {(hasLocalAttempt || hasActiveAttempt) && !isSubmitted && (
              <Tag color="blue">Đang làm</Tag>
            )}
            {isSubmitted && !result && (
              <Tag color="orange">Đã nộp</Tag>
            )}
          </div>
          {quiz.description && (
            <Text type="secondary" className="block mt-2">{quiz.description}</Text>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <ExclamationCircleOutlined className="mr-1" />
          <span>{quiz.stats?.totalQuestions || quiz.totalQuestions || '?'} câu</span>
        </div>
        {quiz.timeLimit && (
          <div className="flex items-center">
            <ClockCircleOutlined className="mr-1" />
            <span>{quiz.timeLimit} phút</span>
          </div>
        )}
        <div className="flex items-center">
          <span>Đạt {passingScore}%</span>
        </div>
        {hasHistory && (
          <Button
            type="link"
            size="small"
            icon={<HistoryOutlined />}
            onClick={() => setShowHistory(!showHistory)}
            loading={isLoadingHistory}
          >
            {showHistory ? 'Ẩn lịch sử' : `Xem lịch sử (${historyCount})`}
          </Button>
        )}
      </div>

      {!isExpanded && hasUserAttempted && (
        <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
          {result ? (
            <>
              Kết quả gần nhất: <strong>{result.percentage}%</strong> • 
              Trạng thái: <strong>{result.passed ? 'Đã đạt' : 'Chưa đạt'}</strong>
              {result.submittedAt && result.submittedAt !== 'Invalid Date' && (
                <> • Thời gian: {new Date(result.submittedAt).toLocaleDateString('vi-VN')}</>
              )}
            </>
          ) : isSubmitted ? (
            <>Bài kiểm tra đã được nộp • Đang chờ kết quả</>
          ) : (hasLocalAttempt || hasActiveAttempt) ? (
            <>Đang làm bài • Chưa hoàn thành</>
          ) : hasHistory ? (
            <>Đã làm {historyCount} lần • Điểm cao nhất: {userAttemptsData?.stats?.highestScore || 0}%</>
          ) : null}
        </div>
      )}

      {hasUserAttempted && highestScore > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 bg-blue-50 rounded">
          <div>
            <div className={`text-2xl font-bold ${highestScore >= passingScore ? 'text-green-600' : 'text-red-600'}`}>
              {highestScore}%
            </div>
            <div className="text-sm text-gray-600">
              {result ? 'Điểm lần gần nhất' : 'Điểm cao nhất'}
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            Yêu cầu: {passingScore}%
          </div>
        </div>
      )}

      <div className="flex space-x-2">
        <Button
          type={buttonConfig.type}
          icon={buttonConfig.icon}
          onClick={buttonConfig.onClick}
          block
        >
          {buttonConfig.text}
        </Button>
        {result && !hasLocalAttempt && !hasActiveAttempt && !isExpanded && (
          <Button
            type="default"
            icon={<EyeOutlined />}
            onClick={handleViewReview}
          >
            Xem lại đáp án
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className="mt-4">
          <QuizQuestions
            quizId={quiz.id}
            userId={userId}
            quiz={quiz}
            userAnswers={quizAnswers}
            isSubmitted={isSubmitted}
            result={result}
            attemptId={activeAttemptId}
            onAnswerChange={(questionId, value) => onAnswerChange(quiz.id, questionId, value)}
            onSubmit={(questions) => onSubmitQuiz(quiz.id, questions)}
            onRetry={() => onRetryQuiz(quiz.id)}
            isReviewMode={false}
            isLoadingSubmit={isLoadingSubmit}
          />
        </div>
      )}

      {/* Hiển thị lịch sử bên dưới khi được toggle */}
      {showHistory && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <QuizHistory
            quizId={quiz.id}
            userId={userId}
            onClose={() => setShowHistory(false)}
          />
        </div>
      )}
    </Card>
  )
}