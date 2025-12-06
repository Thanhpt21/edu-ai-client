// src/app/courses/[id]/lessons/components/QuizQuestions.tsx
'use client'

import { useEffect, useState } from 'react'
import { 
  Card, 
  Radio, 
  Space, 
  Typography, 
  Button, 
  Tag, 
  Alert, 
  Statistic,
  Spin,
  Empty,
  message,
  Modal,
  Row,
  Col,
  Progress
} from 'antd'
import { 
  SendOutlined, 
  ReloadOutlined, 
  ClockCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { useQuizQuestionsByQuiz } from '@/hooks/quiz-question/useQuizQuestionsByQuiz'
import { QuizQuestionType } from '@/app/courses/[id]/lessons/types'
import QuizStats from './QuizStats'


const { Text, Title } = Typography

interface QuizQuestionsProps {
  quizId: number
  userId: number
  quiz: any
  userAnswers: Record<number, any>
  isSubmitted: boolean
  result: any
  attemptId?: number
  onAnswerChange: (questionId: number, value: any) => void
  onSubmit: (questions: QuizQuestionType[]) => Promise<void>
  onRetry: () => void
  isReviewMode?: boolean
  isLoadingSubmit: boolean
}

export default function QuizQuestions({
  quizId,
  userId,
  quiz,
  userAnswers,
  isSubmitted,
  result,
  attemptId,
  onAnswerChange,
  onSubmit,
  onRetry,
  isReviewMode = false,
  isLoadingSubmit
}: QuizQuestionsProps) {
  const { 
    data: questions, 
    isLoading, 
    refetch 
  } = useQuizQuestionsByQuiz(quizId, true)

  const [initialAnswers, setInitialAnswers] = useState<Record<number, any>>({})
  const [showDetailedReview, setShowDetailedReview] = useState(false)
  
  // Load lại câu trả lời cũ khi xem lại
  useEffect(() => {
    if (isSubmitted && result?.details) {
      const answers: Record<number, any> = {}
      result.details.forEach((detail: any) => {
        answers[detail.questionId] = detail.userAnswer
      })
      setInitialAnswers(answers)
    }
  }, [isSubmitted, result])

  // Khi ở chế độ xem lại, tự động hiển thị chi tiết
  useEffect(() => {
    if (isReviewMode && (isSubmitted || result)) {
      setShowDetailedReview(true)
    }
  }, [isReviewMode, isSubmitted, result])

  const calculatePassStatus = (percentage: number) => {
    const passingScore = quiz?.passingScore || 70
    return percentage >= passingScore
  }

  // Tính số câu đúng
  const calculateCorrectAnswers = () => {
    if (result?.details) {
      return result.details.filter((detail: any) => detail.isCorrect).length
    }
    return 0
  }

  // Hiển thị câu hỏi trong chế độ xem lại chi tiết
  const renderDetailedReview = () => {
    if (!result || !result.details || !questions) return null

    const correctCount = calculateCorrectAnswers()
    const totalQuestions = questions.length
    
    return (
      <div className="space-y-6">
        {/* Header với thông tin tổng quan */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={8}>
              <div className="text-center">
                <Statistic
                  title="Điểm số"
                  value={result.percentage}
                  suffix="%"
                  valueStyle={{ 
                    color: calculatePassStatus(result.percentage) ? '#3f8600' : '#cf1322',
                    fontSize: '28px'
                  }}
                />
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center">
                <Title level={3} style={{ margin: 0 }}>
                  {correctCount}/{totalQuestions}
                </Title>
                <Text type="secondary">Câu đúng</Text>
              </div>
            </Col>
            <Col xs={24} sm={8}>
              <div className="text-center">
                <Tag 
                  color={calculatePassStatus(result.percentage) ? "green" : "red"}
                  style={{ fontSize: '16px', padding: '8px 16px' }}
                >
                  {calculatePassStatus(result.percentage) ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                </Tag>
                <div className="mt-2">
                  <Text type="secondary">Yêu cầu: {quiz?.passingScore || 70}%</Text>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-1">
              <Text>Tiến độ hoàn thành</Text>
              <Text strong>{result.percentage}%</Text>
            </div>
            <Progress 
              percent={result.percentage} 
              status={calculatePassStatus(result.percentage) ? "success" : "exception"}
              strokeColor={calculatePassStatus(result.percentage) ? "#52c41a" : "#ff4d4f"}
              strokeWidth={10}
            />
          </div>
        </Card>

        {/* Danh sách câu hỏi chi tiết */}
        <div className="space-y-4">
          <Title level={4} className="text-center">📋 Chi tiết từng câu hỏi</Title>
          
          {result.details.map((detail: any, index: number) => {
            const question = questions.find((q: QuizQuestionType) => q.id === detail.questionId)
            if (!question) return null
            
            return (
              <Card 
                key={detail.questionId} 
                className={`border-l-4 ${detail.isCorrect ? 'border-l-green-500' : 'border-l-red-500'} shadow-sm`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Text strong className="text-lg">Câu {index + 1}: {detail.question}</Text>
                      <Tag 
                        color={detail.isCorrect ? "green" : "red"}
                        icon={detail.isCorrect ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        className="text-sm"
                      >
                        {detail.isCorrect ? 'ĐÚNG' : 'SAI'}
                      </Tag>
                    </div>
                    
                    {detail.explanation && (
                      <Alert
                        message="Giải thích"
                        description={detail.explanation}
                        type="info"
                        showIcon
                        className="mt-3"
                      />
                    )}
                  </div>
                  
                
                </div>

                {/* Các lựa chọn */}
                <div className="space-y-2">
                  <Text strong className="block mb-2">Các lựa chọn:</Text>
                  {question.options.map((option: string, optionIndex: number) => {
                    const isCorrectOption = option === detail.correctAnswer
                    const isUserSelected = option === detail.userAnswer
                    
                    let className = "p-3 border rounded-lg "
                    let icon = null
                    
                    if (isCorrectOption) {
                      className += "bg-green-50 border-green-300"
                      icon = <CheckCircleOutlined className="text-green-600 ml-2" />
                    } else if (isUserSelected && !isCorrectOption) {
                      className += "bg-green-50 border-green-300"
                      icon = <CloseCircleOutlined className="text-red-600 ml-2" />
                    } else {
                      className += "bg-gray-50 border-gray-200"
                    }
                    
                    return (
                      <div key={optionIndex} className={className}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Radio 
                              checked={isUserSelected || isCorrectOption}
                              disabled
                              className={isCorrectOption ? 'radio-correct' : isUserSelected ? 'radio-wrong' : ''}
                            >
                              <Text className={isCorrectOption ? 'text-green-700 font-medium' : ''}>
                                {option}
                                {isUserSelected && !isCorrectOption && (
                                  <Tag color="green" className="ml-2">Bạn chọn</Tag>
                                )}
                                {isCorrectOption && (
                                  <Tag color="green" className="ml-2">Đáp án đúng</Tag>
                                )}
                              </Text>
                            </Radio>
                          </div>
                          {icon}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Kết luận */}
                <div className={`mt-4 p-3 rounded-lg ${detail.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2">
                    {detail.isCorrect ? (
                      <>
                        <CheckCircleOutlined className="text-green-600" />
                        <Text strong className="text-green-700">
                          Chúc mừng! Bạn đã chọn đúng đáp án.
                        </Text>
                      </>
                    ) : (
                      <>
                        <CloseCircleOutlined className="text-red-600" />
                        <Text strong className="text-red-700">
                          Đáp án của bạn chưa chính xác.
                        </Text>
                      </>
                    )}
                  </div>
                  {!detail.isCorrect && (
                    <div className="mt-2">
                      <Text type="secondary" className="block">Bạn đã chọn:</Text>
                      <Text strong className="text-red-600">{detail.userAnswer || 'Không trả lời'}</Text>
                    </div>
                  )}
                </div>
              </Card>
            )
          })}
        </div>

        {/* Nút điều khiển */}
        <div className="flex justify-between items-center pt-6 border-t">          
          <div className="space-x-2">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={onRetry}
            >
              Làm lại bài kiểm tra
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Hiển thị form làm bài bình thường
  const renderQuizForm = () => {
    if (!questions || questions.length === 0) {
      return (
        <Empty
          description="Chưa có câu hỏi nào cho bài kiểm tra này"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )
    }

    const handleSubmit = () => {
      if (Object.keys(userAnswers).length < questions.length) {
        message.warning('Vui lòng trả lời tất cả câu hỏi trước khi nộp bài')
        return
      }
      onSubmit(questions)
    }

    return (
      <>
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <Text strong className="block mb-1">📝 Bài kiểm tra ({questions.length} câu hỏi)</Text>
              <Text type="secondary">Hãy chọn đáp án đúng cho mỗi câu hỏi bên dưới</Text>
            </div>
            {quiz?.timeLimit && (
              <Tag color="blue" icon={<ClockCircleOutlined />}>
                {quiz.timeLimit} phút
              </Tag>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {questions.map((question: QuizQuestionType, index: number) => (
            <Card 
              key={question.id} 
              className="border-gray-200"
              title={`Câu ${index + 1}: ${question.question}`}
            >
              <Radio.Group
                value={userAnswers[question.id] || initialAnswers[question.id]}
                onChange={(e) => !isReviewMode && onAnswerChange(question.id, e.target.value)}
                className="w-full"
                disabled={isReviewMode}
              >
                <Space direction="vertical" className="w-full">
                  {question.options.map((option, optionIndex) => (
                    <Radio 
                      key={optionIndex} 
                      value={option}
                      className={`py-2 px-3 hover:bg-gray-50 rounded ${
                        isReviewMode ? 'cursor-not-allowed opacity-70' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Text>{option}</Text>
                      </div>
                    </Radio>
                  ))}
                </Space>
              </Radio.Group>
              
              <div className="mt-4 text-sm text-gray-500">
                Đã chọn: {userAnswers[question.id] ? '✓' : '✗'}
              </div>
            </Card>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            <Text type="secondary" className="block">
              Đã trả lời: {Object.keys(userAnswers).length}/{questions.length} câu
            </Text>
            
          </div>
          
          <div className="space-x-2">

            
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSubmit}
              disabled={Object.keys(userAnswers).length < questions.length}
              loading={isLoadingSubmit}
            >
              Nộp bài
            </Button>
          </div>
        </div>
      </>
    )
  }

  // Hiển thị kết quả đơn giản sau khi nộp
  const renderSimpleResult = () => {
    if (!result) return null

    return (
      <div className={`p-6 rounded-lg ${calculatePassStatus(result.percentage) ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <Text strong className={`text-xl ${calculatePassStatus(result.percentage) ? 'text-green-700' : 'text-red-700'}`}>
              {calculatePassStatus(result.percentage) ? '🎉 Chúc mừng! Bạn đã vượt qua bài kiểm tra' : '😔 Chưa đạt yêu cầu'}
            </Text>
            <div className="mt-2 space-y-1">
              <Text>Điểm số: <strong>{result.percentage}%</strong> ({result.score}/{result.totalQuestions} câu)</Text>
              {quiz && (
                <Text type="secondary" className="block">
                  Yêu cầu đạt: {quiz.passingScore || 70}%
                </Text>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <Statistic
              value={result.percentage}
              suffix="%"
              valueStyle={{ 
                color: calculatePassStatus(result.percentage) ? '#3f8600' : '#cf1322',
                fontSize: '32px'
              }}
            />
            <Button 
              type="primary" 
              icon={<EyeOutlined />}
              className="mt-4"
              onClick={() => setShowDetailedReview(true)}
            >
              Xem chi tiết câu đúng/sai
            </Button>
          </div>
        </div>
        
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Spin tip="Đang tải câu hỏi..." size="large" />
      </div>
    )
  }

  // Chế độ xem lại chi tiết
  if (showDetailedReview) {
    return renderDetailedReview()
  }

  // Đã nộp bài và có kết quả
  if (isSubmitted && result) {
    return (
      <div className="space-y-6">
        {renderSimpleResult()}
        {!showDetailedReview && <QuizStats quizId={quizId} userId={userId} />}
      </div>
    )
  }

  // Đang làm bài hoặc chưa nộp
  return renderQuizForm()
}