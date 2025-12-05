'use client'

import { Modal, Form, Input, Button, message, InputNumber, Select, Switch, Space, Alert } from 'antd'
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useUpdateQuiz } from '@/hooks/quiz/useUpdateQuiz'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import { useLessonsByCourseId } from '@/hooks/lesson/useLessonsByCourseId'
import { QuizWithRelations } from '@/types/quiz.type'
import { Course } from '@/types/course.type'
import { Lesson } from '@/types/lesson.type'

const { TextArea } = Input
const { Option } = Select

interface QuizUpdateModalProps {
  open: boolean
  onClose: () => void
  quiz: QuizWithRelations | null
  refetch?: () => void
}

interface FormValues {
  title: string
  description?: string
  courseId?: number | null
  lessonId?: number | null
  duration?: number | null
  isPublished: boolean
  randomizeQuestions: boolean
}

export const QuizUpdateModal = ({ 
  open, 
  onClose, 
  quiz, 
  refetch 
}: QuizUpdateModalProps) => {
  const [form] = Form.useForm<FormValues>()
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const { mutateAsync: updateQuiz } = useUpdateQuiz(quiz?.id || 0)
  const { data: coursesData, isLoading: isLoadingCourses } = useAllCourses({ isPublished: true })
  
  const { 
    data: lessonsData, 
    isLoading: isLoadingLessons,
    refetch: refetchLessons 
  } = useLessonsByCourseId(selectedCourse || 0)

  const filteredLessons = selectedCourse ? (lessonsData || []) : []

  useEffect(() => {
    if (selectedCourse && refetchLessons) {
      refetchLessons()
    }
  }, [selectedCourse, refetchLessons])

  useEffect(() => {
    if (quiz && open) {
      setSelectedCourse(quiz.courseId || null)
      
      const initialValues: FormValues = {
        title: quiz.title,
        description: quiz.description || '',
        courseId: quiz.courseId || null,
        lessonId: quiz.lessonId || null,
        duration: quiz.duration,
        isPublished: quiz.isPublished,
        randomizeQuestions: quiz.randomizeQuestions,
      }

      form.setFieldsValue(initialValues)
      setHasChanges(false)
    }
  }, [quiz, open, form])

  const onFinish = async (values: FormValues) => {
    if (!quiz) return

    try {
      setIsSubmitting(true)

      await updateQuiz({
        title: values.title,
        description: values.description,
        courseId: values.courseId,
        lessonId: values.lessonId,
        duration: values.duration,
        isPublished: values.isPublished,
        randomizeQuestions: values.randomizeQuestions,
      })
      
      message.success('Cập nhật quiz thành công')
      
      onClose()
      refetch?.()
      
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi cập nhật quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setSelectedCourse(null)
      setHasChanges(false)
    }
  }, [open, form])

  const handleCourseChange = (courseId: number | null) => {
    setSelectedCourse(courseId)
    form.setFieldValue('lessonId', null)
    setHasChanges(true)
  }

  const handleFormChange = () => {
    setHasChanges(true)
  }

  return (
    <Modal 
      title={
        <div className="flex items-center gap-2">
          <QuestionCircleOutlined />
          <span>Cập nhật quiz</span>
        </div>
      } 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      destroyOnClose
      width={700}
      style={{ top: 20 }}
      maskClosable={false}
    >
      {quiz && (
        <Alert
          message="Thông tin quiz"
          description={`ID: ${quiz.id} | Ngày tạo: ${new Date(quiz.createdAt).toLocaleDateString()}`}
          type="info"
          showIcon
          icon={<InfoCircleOutlined />}
          className="mb-4"
        />
      )}

      <Form<FormValues> 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        onFieldsChange={handleFormChange}
      >
        <Form.Item
          label="Tiêu đề quiz"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề quiz' },
            { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
            { max: 200, message: 'Tiêu đề không quá 200 ký tự' },
          ]}
        >
          <Input 
            placeholder="Nhập tiêu đề quiz" 
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Form.Item 
          label="Mô tả" 
          name="description"
          rules={[{ max: 1000, message: 'Mô tả không quá 1000 ký tự' }]}
        >
          <TextArea 
            rows={3} 
            placeholder="Mô tả chi tiết về quiz..." 
            showCount 
            maxLength={1000}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Khóa học"
            name="courseId"
            tooltip="Chọn khóa học nếu quiz thuộc về khóa học cụ thể"
          >
            <Select 
              placeholder={isLoadingCourses ? "Đang tải khóa học..." : "Chọn khóa học (không bắt buộc)"}
              loading={isLoadingCourses}
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={handleCourseChange}
              value={selectedCourse}
            >
              {coursesData?.map((course: Course) => (
                <Option key={course.id} value={course.id}>
                  {course.title} ({course.level})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Bài học"
            name="lessonId"
            tooltip="Chọn bài học nếu quiz thuộc về bài học cụ thể"
          >
            <Select 
              placeholder={!selectedCourse ? "Chọn khóa học trước" : (isLoadingLessons ? "Đang tải..." : "Chọn bài học (không bắt buộc)")}
              loading={isLoadingLessons}
              disabled={!selectedCourse}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {filteredLessons.map((lesson: Lesson) => (
                <Option key={lesson.id} value={lesson.id}>
                  Bài {lesson.order}: {lesson.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Thời gian làm bài (phút)"
            name="duration"
            tooltip="Thời gian giới hạn làm quiz, để trống nếu không giới hạn"
          >
            <InputNumber
              min={1}
              max={300}
              placeholder="Không giới hạn"
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Random câu hỏi"
            name="randomizeQuestions"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Trạng thái"
            name="isPublished"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>

        <Form.Item className="mt-6">
          <Space className="w-full" direction="vertical">
            {hasChanges && (
              <Alert
                message="Bạn có thay đổi chưa lưu"
                type="warning"
                showIcon
                className="mb-2"
              />
            )}
            
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={isSubmitting} 
              block 
              size="large"
              disabled={!hasChanges}
            >
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật quiz'}
            </Button>
            
            <Button 
              onClick={onClose}
              block 
              size="large"
            >
              Hủy
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  )
}