// src/app/courses/[id]/lessons/components/QuizCard.tsx
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
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
  onAttemptsLoaded?: (quizId: number, attemptsData: any) => void
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
  onAttemptsLoaded,
}: QuizCardProps) {
  const [showHistory, setShowHistory] = useState(false)
  const passingScore = quiz.passingScore || 70
  const hasLocalAttempt = !!activeAttemptId
  const highestScore = result?.percentage || 0
  const hasUserAttempted = result || hasLocalAttempt || isSubmitted
  
  // Sử dụng ref để lưu giá trị cũ
  const prevAttemptsDataRef = useRef<any>(null)

  // Hooks
  const { 
    data: activeAttempt, 
    isLoading: isLoadingActive, 
    refetch: refetchActive 
  } = useActiveQuizAttempt(quiz.id, userId, {
    refetchInterval: refetchInterval && isExpanded ? 10000 : false,
    enabled: isExpanded || !!activeAttemptId,
  })

  const { 
    data: userAttemptsData, 
    isLoading: isLoadingHistory, 
    refetch: refetchHistory 
  } = useUserQuizAttempts(quiz.id, userId)

  const hasHistory = userAttemptsData?.attempts?.length > 0
  const hasActiveAttempt = !!activeAttempt
  const historyCount = userAttemptsData?.attempts?.length || 0

  // Callbacks
  const handleRestoreAttempt = useCallback((attemptId: number) => {
    onRestoreAttempt(quiz.id, attemptId)
  }, [quiz.id, onRestoreAttempt])

  const handleAnswerChange = useCallback((questionId: number, value: any) => {
    onAnswerChange(quiz.id, questionId, value)
  }, [quiz.id, onAnswerChange])

  const handleSubmitQuiz = useCallback((questions: any[]) => {
    return onSubmitQuiz(quiz.id, questions)
  }, [quiz.id, onSubmitQuiz])

  const handleRetryQuiz = useCallback(() => {
    return onRetryQuiz(quiz.id)
  }, [quiz.id, onRetryQuiz])

  const handleViewReviewClick = useCallback(async () => {
    await onViewReview(quiz.id)
    if (!isExpanded) {
      onToggleQuiz(quiz.id)
    }
  }, [quiz.id, isExpanded, onViewReview, onToggleQuiz])

  const handleStartOrContinueClick = useCallback(async () => {
    if (hasLocalAttempt && !isSubmitted) {
      if (!isExpanded) {
        onToggleQuiz(quiz.id)
      }
    } else if (result || isSubmitted) {
      await onRetryQuiz(quiz.id)
    } else {
      await onStartQuiz(quiz.id)
    }
  }, [
    hasLocalAttempt, 
    isSubmitted, 
    isExpanded, 
    result, 
    onToggleQuiz, 
    onRetryQuiz, 
    onStartQuiz, 
    quiz.id
  ])

  const toggleShowHistory = useCallback(() => {
    setShowHistory(prev => !prev)
  }, [])

  const handleToggleQuiz = useCallback(() => {
    onToggleQuiz(quiz.id)
  }, [quiz.id, onToggleQuiz])

  // Gửi attempts data lên parent khi có dữ liệu mới
  useEffect(() => {
    if (userAttemptsData && onAttemptsLoaded) {
      const isDataChanged = JSON.stringify(userAttemptsData) !== JSON.stringify(prevAttemptsDataRef.current)
      
      if (isDataChanged) {
        console.log(`📤 QuizCard ${quiz.id}: Sending attempts data to parent`)
        onAttemptsLoaded(quiz.id, userAttemptsData)
        prevAttemptsDataRef.current = userAttemptsData
      }
    }
  }, [userAttemptsData, quiz.id, onAttemptsLoaded])

  // Auto-restore attempt từ server
  useEffect(() => {
    if (activeAttempt?.id && activeAttemptId !== activeAttempt.id) {
      console.log(`Restoring active attempt ${activeAttempt.id} for quiz ${quiz.id}`)
      handleRestoreAttempt(activeAttempt.id)
    }
  }, [activeAttempt?.id, activeAttemptId, quiz.id, handleRestoreAttempt])

  // Polling
  useEffect(() => {
    if (refetchInterval && (hasActiveAttempt || isExpanded)) {
      const interval = setInterval(() => {
        refetchActive()
        refetchHistory()
      }, refetchInterval as number)
      
      return () => clearInterval(interval)
    }
  }, [
    refetchInterval, 
    hasActiveAttempt, 
    isExpanded, 
    refetchActive, 
    refetchHistory
  ])

  // Button config
  const getButtonConfig = useCallback(() => {
    if (isExpanded) {
      return {
        text: 'Đóng',
        icon: <CloseOutlined />,
        type: 'default' as const,
        onClick: handleToggleQuiz
      }
    }

    if (hasLocalAttempt && !isSubmitted) {
      return {
        text: 'Tiếp tục làm bài',
        icon: <SyncOutlined />,
        type: 'primary' as const,
        onClick: handleStartOrContinueClick
      }
    }

    if (hasActiveAttempt) {
      return {
        text: 'Tiếp tục làm bài',
        icon: <SyncOutlined />,
        type: 'primary' as const,
        onClick: handleStartOrContinueClick
      }
    }

    if (result || isSubmitted || hasHistory) {
      return {
        text: 'Làm bài mới',
        icon: <SyncOutlined />,
        type: 'default' as const,
        onClick: handleStartOrContinueClick
      }
    }

    return {
      text: 'Làm bài',
      icon: <ExclamationCircleOutlined />,
      type: 'primary' as const,
      onClick: handleStartOrContinueClick
    }
  }, [
    isExpanded, 
    hasLocalAttempt, 
    isSubmitted, 
    hasActiveAttempt, 
    result, 
    hasHistory, 
    handleToggleQuiz, 
    handleStartOrContinueClick
  ])

  const buttonConfig = getButtonConfig()

  // Render helper functions
  const renderStatusTags = () => (
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
  )

  const renderStatsInfo = () => {
    if (!isExpanded && hasUserAttempted) {
      if (result) {
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
            Kết quả gần nhất: <strong>{result.percentage}%</strong> • 
            Trạng thái: <strong>{result.passed ? 'Đã đạt' : 'Chưa đạt'}</strong>
            {result.submittedAt && result.submittedAt !== 'Invalid Date' && (
              <> • Thời gian: {new Date(result.submittedAt).toLocaleDateString('vi-VN')}</>
            )}
          </div>
        )
      }
      
      if (isSubmitted) {
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
            Bài kiểm tra đã được nộp • Đang chờ kết quả
          </div>
        )
      }
      
      if (hasLocalAttempt || hasActiveAttempt) {
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
            Đang làm bài • Chưa hoàn thành
          </div>
        )
      }
      
      if (hasHistory) {
        return (
          <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
            Đã làm {historyCount} lần • 
            Điểm cao nhất: <strong>{userAttemptsData?.stats?.highestScore || 0}%</strong>
            {userAttemptsData?.stats?.highestScore && (
              <> • Trạng thái: <strong>{userAttemptsData.stats.highestScore >= passingScore ? 'Đã đạt' : 'Chưa đạt'}</strong></>
            )}
          </div>
        )
      }
    }
    return null
  }

  return (
    <Card className={`mb-4 ${hasUserAttempted ? 
      (highestScore >= passingScore ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 
      ''}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Text strong className="text-lg">{quiz.title}</Text>
          {renderStatusTags()}
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
            onClick={toggleShowHistory}
            loading={isLoadingHistory}
          >
            {showHistory ? 'Ẩn lịch sử' : `Xem lịch sử (${historyCount})`}
          </Button>
        )}
      </div>

      {renderStatsInfo()}

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
            onClick={handleViewReviewClick}
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
            userAnswers={quizAnswers[quiz.id] || {}}
            isSubmitted={isSubmitted}
            result={result}
            attemptId={activeAttemptId}
            onAnswerChange={handleAnswerChange}
            onSubmit={handleSubmitQuiz}
            onRetry={handleRetryQuiz}
            isReviewMode={false}
            isLoadingSubmit={isLoadingSubmit}
          />
        </div>
      )}

      {showHistory && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <QuizHistory
            quizId={quiz.id}
            userId={userId}
            onClose={toggleShowHistory}
          />
        </div>
      )}
    </Card>
  )
}