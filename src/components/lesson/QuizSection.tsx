// src/app/courses/[id]/lessons/components/QuizSection.tsx
'use client'

import { useState, useEffect } from 'react'
import { Collapse, Spin, Empty } from 'antd'
import { FileTextOutlined } from '@ant-design/icons'
import QuizCard from './QuizCard'
import { QuizType } from '@/app/courses/[id]/lessons/types'

const { Panel } = Collapse

interface QuizSectionProps {
  quizzes: QuizType[]
  isLoading: boolean
  userId: number
  expandedQuizzes: Set<number>
  quizAnswers: Record<number, Record<number, any>>
  quizSubmissions: Record<number, boolean>
  quizResults: Record<number, any>
  activeAttemptIds: Record<number, number>
  onToggleQuiz: (quizId: number) => void
  onStartQuiz: (quizId: number) => Promise<void>
  onViewReview: (quizId: number) => Promise<void>
  onAnswerChange: (quizId: number, questionId: number, value: any) => void
  onSubmitQuiz: (quizId: number, questions: any[]) => Promise<void>
  onRetryQuiz: (quizId: number) => Promise<void>
  onRestoreAttempt: (quizId: number, attemptId: number) => void
  isLoadingStart: boolean
  isLoadingSubmit: boolean
  isReviewMode?: boolean
}

export default function QuizSection({
  quizzes,
  isLoading,
  userId,
  expandedQuizzes,
  quizAnswers,
  quizSubmissions,
  quizResults,
  activeAttemptIds,
  onToggleQuiz,
  onStartQuiz,
  onViewReview,
  onAnswerChange,
  onSubmitQuiz,
  onRetryQuiz,
  onRestoreAttempt,
  isLoadingStart,
  isLoadingSubmit,
  isReviewMode = false,
}: QuizSectionProps) {
  const [activeQuizTab, setActiveQuizTab] = useState<string | null>(null)
  const [refetchInterval, setRefetchInterval] = useState<number | false>(false)

  // Kích hoạt polling khi có quiz đang mở rộng
  useEffect(() => {
    if (expandedQuizzes.size > 0) {
      setRefetchInterval(10000)
    } else {
      setRefetchInterval(false)
    }
  }, [expandedQuizzes])

  const handleQuizTabChange = (key: string | string[]) => {
    setActiveQuizTab(Array.isArray(key) ? key[0] : key)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spin size="large" />
      </div>
    )
  }

  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="py-8">
        <Empty
          description="Bài học này chưa có bài kiểm tra"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    )
  }

  return (
    <Collapse
      defaultActiveKey={['quizzes']}
      activeKey={activeQuizTab || 'quizzes'}
      onChange={handleQuizTabChange}
      className="mb-6"
    >
      <Panel
        header={`Bài kiểm tra (${quizzes.length})`}
        key="quizzes"
        extra={<FileTextOutlined />}
      >
        <div className="space-y-4">
          {quizzes.map((quiz: QuizType) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              userId={userId}
              isExpanded={expandedQuizzes.has(quiz.id)}
              quizAnswers={quizAnswers[quiz.id] || {}}
              isSubmitted={quizSubmissions[quiz.id] || false}
              result={quizResults[quiz.id]}
              activeAttemptId={activeAttemptIds[quiz.id]}
              refetchInterval={refetchInterval}
              onToggleQuiz={onToggleQuiz}
              onStartQuiz={onStartQuiz}
              onViewReview={onViewReview}
              onAnswerChange={onAnswerChange}
              onSubmitQuiz={onSubmitQuiz}
              onRetryQuiz={onRetryQuiz}
              onRestoreAttempt={onRestoreAttempt}
              isLoadingSubmit={isLoadingSubmit}
            />
          ))}
        </div>
      </Panel>
    </Collapse>
  )
}