// src/components/admin/assignment/AssignmentCreateModal.tsx
'use client'

import { Modal, Form, Input, Button, Upload, message, InputNumber, Select, DatePicker, Alert } from 'antd'
import { UploadOutlined, FileOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useCreateAssignment } from '@/hooks/assignment/useCreateAssignment'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import { useLessonsByCourseId } from '@/hooks/lesson/useLessonsByCourseId'
import { 
  AssignmentStatus, 
  getAssignmentStatusLabel
} from '@/enums/assignment-status.enum'
import { Course } from '@/types/course.type'
import { Lesson } from '@/types/lesson.type'
import dayjs, { Dayjs } from 'dayjs'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input
const { Option } = Select

// Constants for file validation
const MAX_ASSIGNMENT_FILE_SIZE = 10 * 1024 * 1024 // 10MB

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed'
]

const isAcceptedFileType = (fileType: string): boolean => {
  return ACCEPTED_FILE_TYPES.includes(fileType)
}

interface AssignmentCreateModalProps {
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
  dueDate?: Dayjs
  maxScore: number
  status: AssignmentStatus
}

export const AssignmentCreateModal = ({ 
  open, 
  onClose, 
  refetch, 
  defaultCourseId, 
  defaultLessonId 
}: AssignmentCreateModalProps) => {
  const [form] = Form.useForm<FormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [selectedCourse, setSelectedCourse] = useState<number | null>(defaultCourseId || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { mutateAsync: createAssignment } = useCreateAssignment()
  const { data: coursesData, isLoading: isLoadingCourses } = useAllCourses({ isPublished: true })
  
  // Use useLessonsByCourseId instead of useAllLessons
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
      
      // Validate file
      const file = fileList?.[0]?.originFileObj as RcFile | undefined
      if (file) {
        if (file.size > MAX_ASSIGNMENT_FILE_SIZE) {
          message.error(`File quá lớn. Tối đa ${MAX_ASSIGNMENT_FILE_SIZE / 1024 / 1024}MB`)
          setIsSubmitting(false)
          return
        }
        
        if (!isAcceptedFileType(file.type)) {
          message.error('Loại file không được hỗ trợ')
          setIsSubmitting(false)
          return
        }
      }

      // Prepare form data
      const formData = new FormData()
      
      // Append all form values
      formData.append('title', values.title)
      if (values.description) {
        formData.append('description', values.description)
      }
      if (values.courseId) {
        formData.append('courseId', values.courseId.toString())
      }
      if (values.lessonId) {
        formData.append('lessonId', values.lessonId.toString())
      }
      if (values.dueDate && dayjs(values.dueDate).isValid()) {
        formData.append('dueDate', values.dueDate.toISOString())
      }
      formData.append('maxScore', values.maxScore.toString())
      formData.append('status', values.status)

      // Append file if exists
      if (file) {
        formData.append('file', file)
      }

      await createAssignment(formData)
      message.success('Tạo bài tập thành công')
      
      onClose()
      form.resetFields()
      setFileList([])
      setSelectedCourse(defaultCourseId || null)
      refetch?.()
      
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi tạo bài tập')
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
        dueDate: undefined,
        maxScore: 100,
        status: AssignmentStatus.DRAFT
      })
      
      setSelectedCourse(defaultCourseId || null)
      setFileList([])
    }
  }, [open, form, defaultCourseId, defaultLessonId])

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setFileList([])
      setSelectedCourse(defaultCourseId || null)
    }
  }, [open, form, defaultCourseId])

  const handleCourseChange = (courseId: number | null) => {
    setSelectedCourse(courseId)
    form.setFieldValue('lessonId', null) // Reset lesson when course changes
  }

  const beforeUpload = (file: RcFile) => {
    const isValidType = isAcceptedFileType(file.type)
    if (!isValidType) {
      message.error(`Loại file không được hỗ trợ. Chỉ chấp nhận: PDF, Word, Excel, PowerPoint, Images, Zip`)
      return false
    }

    const isValidSize = file.size <= MAX_ASSIGNMENT_FILE_SIZE
    if (!isValidSize) {
      message.error(`File quá lớn. Tối đa ${MAX_ASSIGNMENT_FILE_SIZE / 1024 / 1024}MB`)
      return false
    }

    // Add to fileList manually
    setFileList([{
      uid: file.uid || '-1',
      name: file.name,
      status: 'done',
      size: file.size,
      type: file.type,
      originFileObj: file,
    }])

    return false // Prevent auto upload
  }

  const handleRemoveFile = () => {
    setFileList([])
  }

  const getFileSizeMB = (size: number): string => {
    return (size / 1024 / 1024).toFixed(2)
  }

  return (
    <Modal 
      title="Tạo bài tập mới" 
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
        description="Bài tập có thể được gán cho khóa học hoặc bài học cụ thể, hoặc không gán nếu là bài tập chung."
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
          maxScore: 100,
          status: AssignmentStatus.DRAFT
        }}
      >
        <Form.Item
          label="Tiêu đề bài tập"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề bài tập' },
            { min: 5, message: 'Tiêu đề phải có ít nhất 5 ký tự' },
            { max: 200, message: 'Tiêu đề không quá 200 ký tự' },
          ]}
        >
          <Input 
            placeholder="Nhập tiêu đề bài tập" 
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
            placeholder="Mô tả chi tiết về bài tập, yêu cầu, hướng dẫn..." 
            showCount 
            maxLength={1000}
          />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Khóa học"
            name="courseId"
            tooltip="Chọn khóa học nếu bài tập thuộc về khóa học cụ thể"
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
            tooltip="Chọn bài học nếu bài tập thuộc về bài học cụ thể"
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
            label="Hạn nộp"
            name="dueDate"
            tooltip="Thời hạn nộp bài, để trống nếu không có hạn"
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              className="w-full"
              placeholder="Chọn hạn nộp (không bắt buộc)"
              disabledDate={(current) => {
                if (!current) return false
                const today = dayjs().startOf('day')
                return dayjs(current.toDate()).isBefore(today)
              }}
            />
          </Form.Item>

          <Form.Item
            label="Điểm tối đa"
            name="maxScore"
            rules={[
              { required: true, message: 'Vui lòng nhập điểm tối đa' },
              { type: 'number', min: 1, max: 1000, message: 'Điểm phải từ 1 đến 1000' },
            ]}
            initialValue={100}
          >
            <InputNumber
              min={1}
              max={1000}
              placeholder="100"
              className="w-full"
            />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue={AssignmentStatus.DRAFT}
          >
            <Select>
              <Option value={AssignmentStatus.DRAFT}>{getAssignmentStatusLabel(AssignmentStatus.DRAFT)}</Option>
              <Option value={AssignmentStatus.PUBLISHED}>{getAssignmentStatusLabel(AssignmentStatus.PUBLISHED)}</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="File bài tập" 
            tooltip={`Chấp nhận: PDF, Word, Excel, PowerPoint, Images, Zip. Tối đa ${MAX_ASSIGNMENT_FILE_SIZE / 1024 / 1024}MB`}
          >
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveFile}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
            
            {fileList.length > 0 && (
              <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                <FileOutlined className="mr-2" />
                <span>{fileList[0].name}</span>
                <span className="ml-2 text-gray-500">
                  ({getFileSizeMB(fileList[0].size || 0)} MB)
                </span>
              </div>
            )}
          </Form.Item>
        </div>

        <Form.Item className="mt-6">
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isSubmitting} 
            block 
            size="large"
          >
            {isSubmitting ? 'Đang tạo...' : 'Tạo bài tập'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}