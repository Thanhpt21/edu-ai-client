// src/app/courses/[id]/lessons/page.tsx (main component - đã cập nhật đầy đủ)
'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  Layout,
  Button,
  Typography,
  Divider,
  Spin,
  Empty,
  Alert,
  Tag,
  message,
  Modal 
} from 'antd'
import {
  ArrowLeftOutlined,
  UserOutlined,
  CheckCircleOutlined,
  LockOutlined,
  RobotOutlined,
  VideoCameraOutlined
} from '@ant-design/icons'
import { useLessonsByCourseId } from '@/hooks/lesson/useLessonsByCourseId'
import { useCourseOne } from '@/hooks/course/useCourseOne'
import { useLessonQuizzes } from '@/hooks/quiz/useLessonQuizzes'
import { useStartQuizAttempt } from '@/hooks/quiz-attempt/useStartQuizAttempt'
import { useSubmitQuizAttempt } from '@/hooks/quiz-attempt/useSubmitQuizAttempt'
import { useAuth } from '@/context/AuthContext'

// Import components
import VideoLessonPlayer from '@/components/lesson/VideoLessonPlayer'
import QuizLockBanner from '@/components/lesson/QuizLockBanner'
import LessonContent from '@/components/lesson/LessonContent'
import LessonSidebar from '@/components/lesson/LessonSidebar'
import type { QuizType, QuizQuestionType } from './types'
import QuizSection from '@/components/lesson/QuizSection'

const { Title, Text } = Typography
const { Content } = Layout

export default function LessonsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = parseInt(params.id as string)
  
  // Auth
  const { currentUser, isLoading: isLoadingAuth } = useAuth()
  const userId = currentUser?.id
  
  // State
  const [quizHighestScores, setQuizHighestScores] = useState<Record<number, number>>({})
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>('')
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set())
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<number>>(new Set())
  const [quizAnswers, setQuizAnswers] = useState<Record<number, Record<number, any>>>({})
  const [quizSubmissions, setQuizSubmissions] = useState<Record<number, any>>({})
  const [quizResults, setQuizResults] = useState<Record<number, any>>({})
  const [activeAttemptIds, setActiveAttemptIds] = useState<Record<number, number>>({})
  const [passedQuizzes, setPassedQuizzes] = useState<Set<number>>(new Set())
  const [isReviewMode, setIsReviewMode] = useState(false)

  // Data fetching
  const { data: courseResponse, isLoading: isLoadingCourse, error: courseError } = useCourseOne(courseId)
  const { data: lessons, isLoading: isLoadingLessons, error: lessonsError } = useLessonsByCourseId(courseId)
  const course = courseResponse?.data || courseResponse
  
  const shouldFetchQuizzes = !!selectedLessonId && selectedLessonId !== 0
  const { 
    data: lessonQuizzes, 
    isLoading: isLoadingQuizzes,
    refetch: refetchQuizzes,
    error: quizzesError
  } = useLessonQuizzes(shouldFetchQuizzes ? selectedLessonId : 0)

  // Mutations
  const startQuizAttemptMutation = useStartQuizAttempt()
  const submitQuizAttemptMutation = useSubmitQuizAttempt()

  // Sorted lessons
  const sortedLessons = Array.isArray(lessons) ? [...lessons].sort((a, b) => a.order - b.order) : []
  
  // Effects
  useEffect(() => {
    if (sortedLessons.length > 0 && !selectedLessonId) {
      setSelectedLessonId(sortedLessons[0].id)
    }
  }, [sortedLessons, selectedLessonId])
  
  const currentLesson = sortedLessons.find(lesson => lesson.id === selectedLessonId) || sortedLessons[0]
  
  useEffect(() => {
    if (currentLesson) {
      const heygenVideo = currentLesson.heygenVideos?.[0]
      if (heygenVideo?.videoUrl) {
        setCurrentVideoUrl(heygenVideo.videoUrl)
      } else if (currentLesson.videoUrl) {
        setCurrentVideoUrl(currentLesson.videoUrl)
      } else {
        setCurrentVideoUrl('')
      }
    }
  }, [currentLesson])

  useEffect(() => {
    if (selectedLessonId) {
      refetchQuizzes()
      setExpandedQuizzes(new Set())
      setQuizAnswers({})
      setQuizSubmissions({})
      setActiveAttemptIds({})
      setQuizHighestScores({})
    }
  }, [selectedLessonId, refetchQuizzes])

  const handleQuizAttemptsLoaded = (quizId: number, attemptsData: any) => {
    if (attemptsData?.stats?.highestScore !== undefined) {
      setQuizHighestScores(prev => ({
        ...prev,
        [quizId]: attemptsData.stats.highestScore
      }))
    }
  }

  // Helper functions
  const handleLessonSelect = (lessonId: number) => {
    setSelectedLessonId(lessonId)
  }
  
  const handleMarkComplete = (lessonId: number) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev)
      if (newSet.has(lessonId)) {
        newSet.delete(lessonId)
      } else {
        newSet.add(lessonId)
      }
      return newSet
    })
  }
  
  const getVideoSourceName = () => {
    if (currentLesson?.heygenVideos?.[0]) {
      return (
        <Tag icon={<RobotOutlined />} color="purple">
          AI Video
        </Tag>
      )
    } else if (currentLesson?.videoUrl?.includes('youtube')) {
      return (
        <Tag icon={<VideoCameraOutlined />} color="red">
          YouTube
        </Tag>
      )
    }
    return null
  }

  // Quiz functions
  const toggleQuizExpansion = (quizId: number) => {
    setExpandedQuizzes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(quizId)) {
        newSet.delete(quizId)
      } else {
        newSet.add(quizId)
      }
      return newSet
    })
    
    if (!expandedQuizzes.has(quizId)) {
      setQuizAnswers(prev => ({
        ...prev,
        [quizId]: {}
      }))
    }
  }

  const handleStartQuizAttempt = async (quizId: number) => {
    try {
      console.log(`🎯 Starting quiz attempt for quiz ${quizId}, user ${userId}`)
      
      const result = await startQuizAttemptMutation.mutateAsync({
        quizId,
        studentId: userId!,
        answers: []
      })
      
      console.log('✅ Quiz attempt created:', result)
      
      setActiveAttemptIds(prev => ({
        ...prev,
        [quizId]: result.id
      }))
      
      toggleQuizExpansion(quizId)
      message.success('Đã bắt đầu bài kiểm tra!')
      
    } catch (error: any) {
      console.error('❌ Start quiz attempt error:', error)
      message.error(`Không thể bắt đầu bài kiểm tra: ${error.response?.data?.message || error.message}`)
    }
  }

  const handleAnswerChange = (quizId: number, questionId: number, value: any) => {
    setQuizAnswers(prev => ({
      ...prev,
      [quizId]: {
        ...prev[quizId],
        [questionId]: value
      }
    }))
  }

  // Hàm kiểm tra quiz đã pass chưa (chỉ dựa vào state local)
const checkIfQuizPassed = (quizId: number) => {
  // 1. Ưu tiên kết quả vừa làm trong phiên hiện tại (local)
  const localResult = quizResults[quizId]
  if (localResult?.percentage !== undefined) {
    const quiz = lessonQuizzes?.find((q: any) => q.id === quizId)
    const passingScore = quiz?.passingScore || 70
    return localResult.percentage >= passingScore
  }

  // 2. Nếu không có local → dùng điểm cao nhất từ server (đã được QuizCard gửi lên)
  const serverScore = quizHighestScores[quizId]
  if (serverScore !== undefined) {
    const quiz = lessonQuizzes?.find((q: any) => q.id === quizId)
    const passingScore = quiz?.passingScore || 70
    return serverScore >= passingScore
  }

  return false
}

  // Hàm kiểm tra có thể học bài tiếp theo không
  const canGoToNextLesson = () => {
    if (!currentLesson) return false
    
    const currentLessonQuizzes = lessonQuizzes?.filter((q: any) => q.lessonId === currentLesson.id) || []
    
    if (currentLessonQuizzes.length === 0) return true
    
    const allQuizzesPassed = currentLessonQuizzes.every((quiz: any) => 
      checkIfQuizPassed(quiz.id) || passedQuizzes.has(quiz.id)
    )
    
    return allQuizzesPassed
  }

  // Hàm submit quiz
  const handleSubmitQuiz = async (quizId: number, questions: QuizQuestionType[]) => {
    const userAnswers = quizAnswers[quizId] || {}
    let score = 0
    
    const formattedAnswers = questions.map((question) => {
      const userAnswer = userAnswers[question.id]
      const isCorrect = userAnswer === question.correct
      
      if (isCorrect) score++
      
      return {
        questionId: question.id,
        selectedOption: userAnswer,
        isCorrect,
        timeSpent: 30
      }
    })

    const totalQuestions = questions.length
    const percentage = Math.round((score / totalQuestions) * 100)
    const quiz = lessonQuizzes?.find((q: QuizType) => q.id === quizId)
    const passingScore = quiz?.passingScore || 70
    const passed = percentage >= passingScore
    const attemptId = activeAttemptIds[quizId]

    if (!attemptId) {
      message.error('Không tìm thấy ID bài làm. Vui lòng bắt đầu lại bài kiểm tra.')
      return
    }

    try {
      await submitQuizAttemptMutation.mutateAsync({
        attemptId,
        answers: formattedAnswers,
        score: percentage
      }, {
        onSuccess: async (data) => {
          console.log('✅ Quiz submitted successfully:', data)
          
          const submittedAt = data.submittedAt || new Date().toISOString()
          
          setQuizSubmissions(prev => ({
            ...prev,
            [quizId]: true
          }))

          setQuizResults(prev => ({
            ...prev,
            [quizId]: {
              score,
              totalQuestions,
              percentage,
              passed,
              passingScore,
              details: questions.map((question, index) => ({
                questionId: question.id,
                question: question.question,
                userAnswer: userAnswers[question.id],
                correctAnswer: question.correct,
                isCorrect: userAnswers[question.id] === question.correct,
                explanation: question.explanation,
                options: question.options
              })),
              submitted: true,
              submittedAt: submittedAt,
              attemptId: data.id,
              hasHistory: true,
              latestAttempt: data
            }
          }))

          setActiveAttemptIds(prev => {
            const newState = { ...prev }
            delete newState[quizId]
            return newState
          })

          if (passed) {
            setPassedQuizzes(prev => new Set(prev).add(quizId))
            message.success(`🎉 Chúc mừng! Bạn đã vượt qua bài kiểm tra với ${percentage}%!`)
          } else {
            message.warning(`Bạn đã hoàn thành bài kiểm tra với ${percentage}%. Cần ${passingScore}% để qua.`)
          }
        },
        onError: (error: any) => {
          console.error('❌ Submit quiz error:', error)
          message.error(`Lỗi khi nộp bài: ${error.response?.data?.message || error.message}`)
        }
      })

    } catch (error) {
      console.error('❌ Submit quiz error:', error)
      message.error('Đã xảy ra lỗi khi nộp bài')
    }
  }

  const handleRetryQuiz = async (quizId: number) => {
    setQuizAnswers(prev => ({
      ...prev,
      [quizId]: {}
    }))
    setQuizSubmissions(prev => ({
      ...prev,
      [quizId]: false
    }))
    setQuizResults(prev => {
      const newResults = { ...prev }
      delete newResults[quizId]
      return newResults
    })
    
    await handleStartQuizAttempt(quizId)
  }

  // Xử lý chuyển bài tiếp theo
  const handleNextLesson = () => {
    if (!canGoToNextLesson()) {
      message.warning('Bạn cần hoàn thành bài kiểm tra hiện tại với điểm số ≥ 70% để tiếp tục!')
      return
    }
    
    const currentIndex = sortedLessons.findIndex(l => l.id === selectedLessonId)
    if (currentIndex < sortedLessons.length - 1) {
      setSelectedLessonId(sortedLessons[currentIndex + 1].id)
    }
  }

  // Hàm lấy trạng thái bài học cho sidebar
  const getLessonStatus = (lesson: any) => {
    const lessonQuizzesList = lessonQuizzes?.filter((q: any) => q.lessonId === lesson.id) || []
    
    if (lessonQuizzesList.length === 0) {
      return null // Không có quiz
    }
    
    const allPassed = lessonQuizzesList.every((quiz: any) => 
      checkIfQuizPassed(quiz.id) || passedQuizzes.has(quiz.id)
    )
    
    if (allPassed) {
      return <Tag color="green">Đã hoàn thành</Tag>
    } else {
      return <Tag color="orange">Chưa hoàn thành</Tag>
    }
  }

  // Hàm lấy điểm cao nhất của quiz hiện tại
const getCurrentLessonHighestScore = () => {
  if (!currentLesson) return 0

  const currentLessonQuizzes = lessonQuizzes?.filter((q: any) => q.lessonId === currentLesson.id) || []
  let highestScore = 0

  currentLessonQuizzes.forEach((quiz: any) => {
    // Ưu tiên local result (nếu vừa làm xong)
    const local = quizResults[quiz.id]?.percentage
    if (local !== undefined && local > highestScore) {
      highestScore = local
    }

    // Dùng server highest nếu cao hơn
    const server = quizHighestScores[quiz.id]
    if (server !== undefined && server > highestScore) {
      highestScore = server
    }
  })

  return highestScore
}
  // Hàm xem lại đáp án
  const handleViewReview = async (quizId: number) => {
    try {
      // Đặt chế độ xem lại
      setIsReviewMode(true)
      
      // Mở rộng quiz để xem
      toggleQuizExpansion(quizId)

    } catch (error) {
      console.error('❌ Error viewing review:', error)
      message.error('Không thể mở chế độ xem lại')
    }
  }

  // Hàm toggle quiz expansion với kiểm tra review mode
  const toggleQuizExpansionWithReviewCheck = (quizId: number) => {
    // Nếu đang trong chế độ xem lại và đóng quiz, tắt chế độ xem lại
    if (expandedQuizzes.has(quizId) && isReviewMode) {
      setIsReviewMode(false)
    }
    
    toggleQuizExpansion(quizId)
  }

  // Hàm xử lý bắt đầu hoặc tiếp tục quiz
  const handleStartOrContinueQuiz = async (quizId: number) => {
    const hasAttempt = activeAttemptIds[quizId]
    const result = quizResults[quizId]
    const quiz = lessonQuizzes?.find((q: any) => q.id === quizId)
    
    // Kiểm tra xem có đang làm dở không
    if (hasAttempt && !result?.submitted) {
      // Tiếp tục làm bài đang làm dở
      toggleQuizExpansion(quizId)
      return
    }
    
    // Nếu đã có kết quả, hiển thị modal lựa chọn
    if (result) {
      Modal.confirm({
        title: 'Lựa chọn làm bài',
        content: (
          <div>
            <p>Bạn đã hoàn thành bài kiểm tra này với kết quả <strong>{result.percentage}%</strong>.</p>
            <p>Bạn muốn:</p>
            <ul className="list-disc pl-4 mt-2">
              <li><strong>Làm lại từ đầu</strong> - Tạo lượt làm bài mới</li>
              <li><strong>Xem lại kết quả</strong> - Xem đáp án và giải thích</li>
            </ul>
          </div>
        ),
        okText: 'Làm lại từ đầu',
        cancelText: 'Xem lại kết quả',
        okButtonProps: { type: 'primary' },
        cancelButtonProps: { type: 'default' },
        onOk: async () => {
          // Reset kết quả hiện tại
          setQuizResults(prev => {
            const newResults = { ...prev }
            delete newResults[quizId]
            return newResults
          })
          
          setQuizSubmissions(prev => ({
            ...prev,
            [quizId]: false
          }))
          
          // Tắt chế độ xem lại nếu có
          setIsReviewMode(false)
          
          // Tạo attempt mới
          await handleStartQuizAttempt(quizId)
        },
        onCancel: () => {
          // Vào chế độ xem lại
          handleViewReview(quizId)
        }
      })
    } else {
      // Chưa có kết quả, bắt đầu làm bài mới
      await handleStartQuizAttempt(quizId)
    }
  }

  // Hàm khôi phục attempt từ server
  const handleRestoreAttempt = (quizId: number, attemptId: number) => {
    console.log(`🔄 Restoring attempt ${attemptId} for quiz ${quizId}`)
    
    setActiveAttemptIds(prev => ({
      ...prev,
      [quizId]: attemptId
    }))
  }
  

  // Loading & error states
  if (isLoadingAuth || isLoadingCourse || isLoadingLessons) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" tip="Đang tải thông tin..." />
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Alert
          message="Chưa đăng nhập"
          description="Vui lòng đăng nhập để xem nội dung bài học và làm bài kiểm tra"
          type="warning"
          showIcon
          className="mb-4"
        />
        <Button type="primary" onClick={() => router.push('/login')}>
          Đăng nhập
        </Button>
      </div>
    )
  }
  
  if (courseError || lessonsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Alert
          message="Lỗi tải dữ liệu"
          description={courseError?.message || lessonsError?.message || "Không thể tải dữ liệu"}
          type="error"
          showIcon
          className="mb-4"
        />
        <Button type="primary" onClick={() => router.push('/courses')}>
          Quay lại danh sách khóa học
        </Button>
      </div>
    )
  }
  
  if (!course) {
    return (
      <Empty
        description={
          <div>
            <div className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy khóa học
            </div>
            <p className="text-gray-600 mb-4">
              Khóa học không tồn tại hoặc đã bị xóa
            </p>
          </div>
        }
        className="flex flex-col items-center justify-center min-h-screen"
      >
        <Button type="primary" onClick={() => router.push('/courses')}>
          Quay lại danh sách khóa học
        </Button>
      </Empty>
    )
  }

  if (sortedLessons.length === 0) {
    return (
      <Layout className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                Quay lại khóa học
              </Button>
              <div>
                <Title level={4} className="!mb-1">
                  {course.title || `Khóa học #${courseId}`}
                </Title>
                <Text type="secondary">
                  <UserOutlined className="mr-1" />
                  {course.instructor?.name || 'Giảng viên'}
                </Text>
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Empty
            description={
              <div className="text-center">
                <div className="text-lg font-medium text-gray-900 mb-2">
                  Chưa có bài học nào
                </div>
                <p className="text-gray-600 mb-4">
                  Hãy quay lại sau khi giảng viên thêm bài học
                </p>
              </div>
            }
            className="py-12"
          />
        </div>
      </Layout>
    )
  }

  // Kiểm tra xem bài học hiện tại có bị khóa không
  const currentLessonQuizzes = lessonQuizzes?.filter((q: any) => q.lessonId === currentLesson?.id) || []
  const isLessonLocked = currentLessonQuizzes.length > 0 && !canGoToNextLesson()

  return (
    <Layout className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => router.push(`/courses/${courseId}`)}
              >
                Quay lại
              </Button>
              
              <div>
                <div className="flex items-center gap-2">
                  <Title level={4} className="!mb-1">
                    {course.title}
                  </Title>
                  <Tag color="blue">{course.level}</Tag>
                </div>
                <Text type="secondary" className="flex items-center gap-2">
                  <UserOutlined />
                  {course.instructor?.name || 'Giảng viên'}
                </Text>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Button
                type={completedLessons.has(currentLesson?.id || 0) ? "default" : "primary"}
                icon={<CheckCircleOutlined />}
                onClick={() => handleMarkComplete(currentLesson?.id || sortedLessons[0]?.id || 0)}
              >
                {completedLessons.has(currentLesson?.id || 0) 
                  ? 'Đã hoàn thành' 
                  : 'Hoàn thành'
                }
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Layout className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="lg:w-2/3 space-y-6">
            <VideoLessonPlayer
              currentVideoUrl={currentVideoUrl}
              currentLesson={currentLesson}
              getVideoSourceName={getVideoSourceName}
            />
            
            <Divider />
            
            {/* Banner cảnh báo nếu bài học bị khóa */}
            {isLessonLocked && (
              <QuizLockBanner
                isLocked={isLessonLocked}
                currentScore={getCurrentLessonHighestScore()}
                requiredScore={70}
                onRetry={() => {
                  // Mở quiz đầu tiên của bài học
                  const firstQuiz = currentLessonQuizzes[0]
                  if (firstQuiz) {
                    toggleQuizExpansion(firstQuiz.id)
                  }
                }}
              />
            )}
            
            <QuizSection
              quizzes={lessonQuizzes || []}
              isLoading={isLoadingQuizzes}
              userId={userId!}
              expandedQuizzes={expandedQuizzes}
              quizAnswers={quizAnswers}
              quizSubmissions={quizSubmissions}
              quizResults={quizResults}
              activeAttemptIds={activeAttemptIds}
              onToggleQuiz={toggleQuizExpansionWithReviewCheck}
              onStartQuiz={handleStartOrContinueQuiz}
              onViewReview={handleViewReview}
              onAnswerChange={handleAnswerChange}
              onSubmitQuiz={handleSubmitQuiz}
              onRetryQuiz={handleRetryQuiz}
              onRestoreAttempt={handleRestoreAttempt}
              isLoadingStart={startQuizAttemptMutation.isPending}
              isLoadingSubmit={submitQuizAttemptMutation.isPending}
              isReviewMode={isReviewMode}
              onQuizAttemptsLoaded={handleQuizAttemptsLoaded}
            />
            
            {currentLesson?.content && (
              <LessonContent content={currentLesson.content} />
            )}
            
            {/* Navigation buttons */}
            <div className="flex justify-between">
              <Button
                onClick={() => {
                  const currentIndex = sortedLessons.findIndex(l => l.id === selectedLessonId)
                  if (currentIndex > 0) {
                    setSelectedLessonId(sortedLessons[currentIndex - 1].id)
                  }
                }}
                disabled={sortedLessons.findIndex(l => l.id === selectedLessonId) === 0}
              >
                Bài trước
              </Button>
              
              <Button
                type="primary"
                onClick={handleNextLesson}
                disabled={sortedLessons.findIndex(l => l.id === selectedLessonId) === sortedLessons.length - 1}
                icon={isLessonLocked ? <LockOutlined /> : undefined}
              >
                {isLessonLocked ? 'Đang khóa' : 'Bài tiếp'}
              </Button>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-1/3">
            <LessonSidebar
              lessons={sortedLessons}
              selectedLessonId={selectedLessonId}
              completedLessons={completedLessons}
              onLessonSelect={handleLessonSelect}
              getLessonStatus={getLessonStatus}
            />
          </div>
        </div>
      </Layout>
      
      <style jsx global>{`
        .lesson-content {
          line-height: 1.8;
        }
        .lesson-content h1, .lesson-content h2, .lesson-content h3 {
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          color: #1f2937;
        }
        .lesson-content p {
          margin-bottom: 1em;
        }
        .lesson-content ul, .lesson-content ol {
          margin-bottom: 1em;
          padding-left: 1.5em;
        }
        .lesson-content code {
          background: #f3f4f6;
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }
        .lesson-content pre {
          background: #1f2937;
          color: #e5e7eb;
          padding: 1em;
          border-radius: 6px;
          overflow-x: auto;
          margin-bottom: 1em;
        }
      `}</style>
    </Layout>
  )
}