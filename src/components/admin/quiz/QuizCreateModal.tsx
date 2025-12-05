'use client'

import { Modal, Form, Input, Button, message, InputNumber, Select, Switch, Alert } from 'antd'
import { QuestionCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useCreateQuiz } from '@/hooks/quiz/useCreateQuiz'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import { useLessonsByCourseId } from '@/hooks/lesson/useLessonsByCourseId'
import { Course } from '@/types/course.type'
import { Lesson } from '@/types/lesson.type'

const { TextArea } = Input
const { Option } = Select

interface QuizCreateModalProps {
  open: boolean
  onClose: () => void
  refetch?: () => void
  defaultCourseId?: number
  defaultLessonId?: number
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

export const QuizCreateModal = ({ 
  open, 
  onClose, 
  refetch, 
  defaultCourseId, 
  defaultLessonId 
}: QuizCreateModalProps) => {
  const [form] = Form.useForm<FormValues>()
  const [selectedCourse, setSelectedCourse] = useState<number | null>(defaultCourseId || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { mutateAsync: createQuiz } = useCreateQuiz()
  const { data: coursesData, isLoading: isLoadingCourses } = useAllCourses({ isPublished: true })
  
  const { 
    data: lessonsData, 
    isLoading: isLoadingLessons,
    refetch: refetchLessons 
  } = useLessonsByCourseId(selectedCourse || 0)

  // Filter lessons based on selected course
  const filteredLessons = selectedCourse ? (lessonsData || []) : []

  // Refetch lessons when course changes
  useEffect(() => {
    if (selectedCourse && refetchLessons) {
      refetchLessons()
    }
  }, [selectedCourse, refetchLessons])

  const onFinish = async (values: FormValues) => {
    try {
      setIsSubmitting(true)

      await createQuiz({
        title: values.title,
        description: values.description,
        courseId: values.courseId,
        lessonId: values.lessonId,
        duration: values.duration,
        isPublished: values.isPublished,
        randomizeQuestions: values.randomizeQuestions,
      })
      
      message.success('Tạo quiz thành công')
      
      onClose()
      form.resetFields()
      setSelectedCourse(defaultCourseId || null)
      refetch?.()
      
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi tạo quiz')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        title: '',
        description: '',
        courseId: defaultCourseId || null,
        lessonId: defaultLessonId || null,
        duration: null,
        isPublished: false,
        randomizeQuestions: false,
      })
      
      setSelectedCourse(defaultCourseId || null)
    }
  }, [open, form, defaultCourseId, defaultLessonId])

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setSelectedCourse(defaultCourseId || null)
    }
  }, [open, form, defaultCourseId])

  const handleCourseChange = (courseId: number | null) => {
    setSelectedCourse(courseId)
    form.setFieldValue('lessonId', null)
  }

  return (
    <Modal 
      title={
        <div className="flex items-center gap-2">
          <QuestionCircleOutlined />
          <span>Tạo quiz mới</span>
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
      <Alert
        message="Thông tin"
        description="Quiz có thể được gán cho khóa học hoặc bài học cụ thể, hoặc không gán nếu là quiz chung."
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        className="mb-4"
      />

      <Form<FormValues> 
        form={form} 
        layout="vertical" 
        onFinish={onFinish}
        initialValues={{
          isPublished: false,
          randomizeQuestions: false,
        }}
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
              disabled={!!defaultCourseId}
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
              disabled={!selectedCourse || !!defaultLessonId}
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
            label="Công bố ngay"
            name="isPublished"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>

        <Form.Item className="mt-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isSubmitting} 
            block 
            size="large"
            icon={<QuestionCircleOutlined />}
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo quiz'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}