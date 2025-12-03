// src/components/admin/assignment/AssignmentUpdateModal.tsx
'use client'

import { Modal, Form, Input, Button, Upload, message, InputNumber, Select, DatePicker, Space, Alert } from 'antd'
import { UploadOutlined, FileOutlined, DeleteOutlined, DownloadOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { useUpdateAssignment } from '@/hooks/assignment/useUpdateAssignment'
import { useDeleteAssignmentFile } from '@/hooks/assignment/useDeleteAssignmentFile'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import { useLessonsByCourseId } from '@/hooks/lesson/useLessonsByCourseId'
import { 
  Assignment, 
  UpdateAssignmentData 
} from '@/types/assignment.type'
import { 
  AssignmentStatus, 
  getAssignmentStatusLabel
} from '@/enums/assignment-status.enum'
import { AssignmentFileType, getFileTypeIcon } from '@/enums/assignment-file-type.enum'
import { Course } from '@/types/course.type'
import { Lesson } from '@/types/lesson.type'
import dayjs, { Dayjs } from 'dayjs'
import type { RcFile, UploadFile } from 'antd/es/upload/interface'

const { TextArea } = Input
const { Option } = Select

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

interface AssignmentUpdateModalProps {
  open: boolean
  onClose: () => void
  assignment: Assignment | null
  refetch?: () => void
}

interface FormValues {
  title: string
  description?: string
  courseId?: number | null
  lessonId?: number | null
  dueDate?: Dayjs | null
  maxScore: number
  status: AssignmentStatus
}

export const AssignmentUpdateModal = ({ 
  open, 
  onClose, 
  assignment, 
  refetch 
}: AssignmentUpdateModalProps) => {
  const [form] = Form.useForm<FormValues>()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  // 👇 THÊM STATE ĐỂ TRACK FILE MỚI
  const [newFileToUpload, setNewFileToUpload] = useState<RcFile | null>(null)
  const [fileWasRemoved, setFileWasRemoved] = useState(false)
  
  const { mutateAsync: updateAssignment } = useUpdateAssignment()
  const { mutateAsync: deleteFile } = useDeleteAssignmentFile()
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
    if (assignment && open) {
      setSelectedCourse(assignment.courseId || null)
      
      const initialValues: FormValues = {
        title: assignment.title,
        description: assignment.description || '',
        courseId: assignment.courseId || null,
        lessonId: assignment.lessonId || null,
        dueDate: assignment.dueDate ? dayjs(assignment.dueDate) : null,
        maxScore: assignment.maxScore,
        status: assignment.status,
      }

      form.setFieldsValue(initialValues)

      // Set file if exists
      if (assignment.fileUrl) {
        setFileList([
          {
            uid: '-1',
            name: assignment.fileUrl.split('/').pop() || 'assignment_file',
            status: 'done',
            url: assignment.fileUrl,
            size: 0,
          },
        ])
      } else {
        setFileList([])
      }
      
      // Reset states
      setHasChanges(false)
      setNewFileToUpload(null)
      setFileWasRemoved(false)
    }
  }, [assignment, open, form])

  const onFinish = async (values: FormValues) => {
    if (!assignment) return

    try {
      setIsSubmitting(true)

      console.log('📤 [Frontend] Submitting update:', {
        hasNewFile: !!newFileToUpload,
        fileWasRemoved,
        newFileName: newFileToUpload?.name,
        newFileSize: newFileToUpload?.size,
        newFileType: newFileToUpload?.type,
      })

      // Validate new file if exists
      if (newFileToUpload) {
        if (newFileToUpload.size > MAX_ASSIGNMENT_FILE_SIZE) {
          message.error(`File quá lớn. Tối đa ${MAX_ASSIGNMENT_FILE_SIZE / 1024 / 1024}MB`)
          setIsSubmitting(false)
          return
        }
        
        if (!isAcceptedFileType(newFileToUpload.type)) {
          message.error('Loại file không được hỗ trợ')
          setIsSubmitting(false)
          return
        }
      }

      // Prepare form data
      const formData = new FormData()
      
      // Append all form values
      formData.append('title', values.title)
      if (values.description !== undefined) {
        formData.append('description', values.description || '')
      }
      if (values.courseId !== undefined) {
        formData.append('courseId', values.courseId?.toString() || '')
      }
      if (values.lessonId !== undefined) {
        formData.append('lessonId', values.lessonId?.toString() || '')
      }
      if (values.dueDate !== undefined) {
        if (values.dueDate && dayjs(values.dueDate).isValid()) {
          formData.append('dueDate', values.dueDate.toISOString())
        } else {
          formData.append('dueDate', '')
        }
      }
      if (values.maxScore !== undefined) {
        formData.append('maxScore', values.maxScore.toString())
      }
      if (values.status !== undefined) {
        formData.append('status', values.status)
      }

      // 👇 XỬ LÝ FILE ĐÚNG CÁCH
      // Handle file removal
      if (fileWasRemoved) {
        console.log('🗑️ [Frontend] File was removed, sending empty fileUrl')
        formData.append('fileUrl', '') // Empty string to delete file
      }
      
      // Handle new file upload
      if (newFileToUpload) {
        console.log('📤 [Frontend] Appending new file:', {
          name: newFileToUpload.name,
          size: newFileToUpload.size,
          type: newFileToUpload.type,
        })
        formData.append('file', newFileToUpload)
      }

      // Debug: Log FormData contents
      console.log('📤 [Frontend] FormData contents:')
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`  ${key}: File(${value.name}, ${value.size} bytes, ${value.type})`)
        } else {
          console.log(`  ${key}: ${value}`)
        }
      }

      await updateAssignment({ id: assignment.id, formData })
      message.success('Cập nhật bài tập thành công')
      
      onClose()
      refetch?.()
      
    } catch (err: any) {
      console.error('❌ [Frontend] Update error:', err)
      message.error(err?.response?.data?.message || 'Lỗi cập nhật bài tập')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    if (!open) {
      form.resetFields()
      setFileList([])
      setSelectedCourse(null)
      setHasChanges(false)
      setNewFileToUpload(null)
      setFileWasRemoved(false)
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

    console.log('📁 [Frontend] New file selected:', {
      name: file.name,
      size: file.size,
      type: file.type,
    })

    // 👇 LƯU FILE VÀO STATE
    setNewFileToUpload(file)
    setFileWasRemoved(false)

    // Update UI
    setFileList([{
      uid: file.uid || '-1',
      name: file.name,
      status: 'done', // Set done để hiển thị trong UI
      size: file.size,
      type: file.type,
      originFileObj: file, // Giữ reference
    }])

    setHasChanges(true)
    return false // Prevent auto upload
  }

  const handleRemoveFile = () => {
    if (assignment?.fileUrl) {
      Modal.confirm({
        title: 'Xóa file bài tập',
        content: 'Bạn có chắc chắn muốn xóa file này không?',
        onOk: async () => {
          console.log('🗑️ [Frontend] Removing existing file')
          setFileList([])
          setNewFileToUpload(null)
          setFileWasRemoved(true)
          setHasChanges(true)
          message.success('File sẽ được xóa khi bạn lưu thay đổi')
        },
      })
    } else {
      console.log('🗑️ [Frontend] Removing new file')
      setFileList([])
      setNewFileToUpload(null)
      setFileWasRemoved(false)
      setHasChanges(true)
    }
  }

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return '📎'
    
    const typeMap: Record<string, AssignmentFileType> = {
      'application/pdf': AssignmentFileType.PDF,
      'application/msword': AssignmentFileType.DOC,
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': AssignmentFileType.DOCX,
      'application/vnd.ms-excel': AssignmentFileType.XLS,
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': AssignmentFileType.XLSX,
      'application/vnd.ms-powerpoint': AssignmentFileType.PPT,
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': AssignmentFileType.PPTX,
      'text/plain': AssignmentFileType.TXT,
      'image/jpeg': AssignmentFileType.JPEG,
      'image/png': AssignmentFileType.PNG,
      'image/gif': AssignmentFileType.GIF,
      'application/zip': AssignmentFileType.ZIP,
      'application/x-rar-compressed': AssignmentFileType.RAR,
      'application/x-7z-compressed': AssignmentFileType.SEVENZ,
    }
    
    return getFileTypeIcon(typeMap[fileType] || AssignmentFileType.PDF)
  }

  return (
    <Modal 
      title="Cập nhật bài tập" 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      destroyOnClose
      width={700}
      style={{ top: 20 }}
      maskClosable={false}
    >
      {assignment && (
        <Alert
          message="Thông tin bài tập"
          description={`ID: ${assignment.id} | Ngày tạo: ${dayjs(assignment.createdAt).format('DD/MM/YYYY')}`}
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
            label="Hạn nộp"
            name="dueDate"
            tooltip="Thời hạn nộp bài, để trống nếu không có hạn"
          >
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              className="w-full"
              placeholder="Chọn hạn nộp (không bắt buộc)"
              allowClear
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
          >
            <Select>
              <Option value={AssignmentStatus.DRAFT}>{getAssignmentStatusLabel(AssignmentStatus.DRAFT)}</Option>
              <Option value={AssignmentStatus.PUBLISHED}>{getAssignmentStatusLabel(AssignmentStatus.PUBLISHED)}</Option>
              <Option value={AssignmentStatus.CLOSED}>{getAssignmentStatusLabel(AssignmentStatus.CLOSED)}</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            label="File bài tập" 
            tooltip={`Chấp nhận: PDF, Word, Excel, PowerPoint, Images, Zip. Tối đa ${MAX_ASSIGNMENT_FILE_SIZE / 1024 / 1024}MB`}
          >
            <div className="mb-2">
              {fileList.length > 0 && (
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded mb-2">
                  <div className="flex items-center">
                    <span className="text-lg mr-2">{getFileIcon(fileList[0].type)}</span>
                    <div>
                      {assignment?.fileUrl && !newFileToUpload ? (
                        <a 
                          href={assignment.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500 flex items-center"
                        >
                          {fileList[0].name}
                          <DownloadOutlined className="ml-1" />
                        </a>
                      ) : (
                        <span className="text-gray-700">{fileList[0].name}</span>
                      )}
                      {newFileToUpload && (
                        <span className="ml-2 text-xs text-green-600">(File mới)</span>
                      )}
                    </div>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={handleRemoveFile}
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
            
            <Upload
              fileList={[]}
              beforeUpload={beforeUpload}
              maxCount={1}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>
                {fileList.length > 0 ? 'Chọn file khác' : 'Chọn file'}
              </Button>
            </Upload>
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
            
            {newFileToUpload && (
              <Alert
                message={`File mới sẽ được upload: ${newFileToUpload.name}`}
                type="info"
                showIcon
                className="mb-2"
              />
            )}
            
            {fileWasRemoved && (
              <Alert
                message="File hiện tại sẽ được xóa khi bạn lưu"
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
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật bài tập'}
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