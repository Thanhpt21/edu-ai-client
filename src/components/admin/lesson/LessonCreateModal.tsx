// src/components/admin/lesson/LessonCreateModal.tsx
'use client'

import { Modal, Form, Input, Button, message, InputNumber, Select, Upload, Progress, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useCreateLesson } from '@/hooks/lesson/useCreateLesson'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import DynamicRichTextEditor from '@/components/common/RichTextEditor'
import { UploadOutlined, VideoCameraOutlined, DeleteOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface'
import { api } from '@/lib/axios'

const { TextArea } = Input
const { Option } = Select

interface LessonCreateModalProps {
  open: boolean
  onClose: () => void
  refetch?: () => void
  defaultCourseId?: string
}

interface UploadProgress {
  percent: number
  status: 'active' | 'success' | 'exception'
  fileName?: string
}

export const LessonCreateModal = ({ 
  open, 
  onClose, 
  refetch, 
  defaultCourseId 
}: LessonCreateModalProps) => {
  const [form] = Form.useForm()
  const { mutateAsync, isPending } = useCreateLesson()
  const { data: allCourses, isLoading: isLoadingCourses } = useAllCourses()
  const [content, setContent] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Effect để set default courseId
  useEffect(() => {
    if (open && defaultCourseId) {
      form.setFieldValue('courseId', parseInt(defaultCourseId))
    }
  }, [open, defaultCourseId, form])

  // Reset form khi đóng modal
  useEffect(() => {
    if (!open) {
      form.resetFields()
      setContent('')
      setVideoFile(null)
      setVideoPreview(null)
      setUploadProgress(null)
    }
  }, [open, form])

  // Xử lý chọn video file
  const handleVideoSelect = (file: RcFile) => {
    // Kiểm tra kích thước file (max 500MB)
    const maxSize = 500 * 1024 * 1024
    if (file.size > maxSize) {
      message.error('File video quá lớn (tối đa 500MB)')
      return false
    }

    // Kiểm tra định dạng file
    const allowedTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-msvideo',
      'video/x-matroska'
    ]
    if (!allowedTypes.includes(file.type)) {
      message.error('Chỉ hỗ trợ file video (MP4, WebM, OGG, AVI, MKV, MOV)')
      return false
    }

    setVideoFile(file)
    
    // Tạo preview URL
    const previewUrl = URL.createObjectURL(file)
    setVideoPreview(previewUrl)
    
    return false // Ngăn upload tự động
  }

  // Xóa video đã chọn
  const handleRemoveVideo = () => {
    setVideoFile(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview(null)
    }
    setUploadProgress(null)
    form.setFieldValue('videoUrl', '')
  }

  // Xử lý submit form
  const onFinish = async (values: any) => {
    try {
      // Tạo FormData nếu có video file
      if (videoFile) {
        await createLessonWithVideoFile(values)
      } else {
        // Nếu không có file, gửi JSON bình thường
        await createLessonWithVideoUrl(values)
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi tạo bài học')
    }
  }

  // Tạo lesson với video file (sử dụng FormData)
  const createLessonWithVideoFile = async (values: any) => {
    setIsUploading(true)
    setUploadProgress({ percent: 0, status: 'active', fileName: videoFile?.name })

    try {
      const formData = new FormData()
      
      // Thêm text fields
      formData.append('title', values.title)
      if (values.content) formData.append('content', values.content)
      formData.append('order', String(values.order || 0))
      formData.append('courseId', String(values.courseId))
      if (values.durationMin) formData.append('durationMin', String(values.durationMin))
      
      // Thêm video file
      if (videoFile) {
        formData.append('videoFile', videoFile)
      }

      // Gọi API với FormData
      const response = await api.post('/lessons', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && videoFile) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setUploadProgress({
              percent,
              status: 'active',
              fileName: videoFile.name
            })
          }
        },
      })

      setUploadProgress({ percent: 100, status: 'success', fileName: videoFile?.name })
      
      message.success('Tạo bài học thành công')
      onClose()
      refetch?.()

    } catch (error: any) {
      console.error('Create lesson error:', error)
      setUploadProgress({ percent: 0, status: 'exception', fileName: videoFile?.name })
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Tạo lesson với video URL (sử dụng JSON)
  const createLessonWithVideoUrl = async (values: any) => {
    const payload = {
      title: values.title,
      content: values.content || content,
      videoUrl: values.videoUrl || '',
      order: Number(values.order) || 0,
      courseId: Number(values.courseId),
      durationMin: values.durationMin ? Number(values.durationMin) : undefined,
    }

    await mutateAsync(payload)
    message.success('Tạo bài học thành công')
    onClose()
    refetch?.()
  }

  return (
    <Modal 
      title="Tạo bài học mới" 
      open={open} 
      onCancel={onClose} 
      footer={null} 
      destroyOnClose
      width={800}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Khóa học"
          name="courseId"
          rules={[{ required: true, message: 'Vui lòng chọn khóa học' }]}
        >
          <Select 
            placeholder={isLoadingCourses ? "Đang tải khóa học..." : "Chọn khóa học"}
            loading={isLoadingCourses}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) => {
              if (!option?.children) return false
              const childrenText = Array.isArray(option.children) 
                ? option.children.join(' ') 
                : String(option.children)
              return childrenText.toLowerCase().includes(input.toLowerCase())
            }}
            disabled={!!defaultCourseId}
          >
            {allCourses?.map((course: any) => (
              <Option key={course.id} value={course.id}>
                {course.title} ({course.level})
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Tiêu đề bài học"
          name="title"
          rules={[
            { required: true, message: 'Vui lòng nhập tiêu đề bài học' },
            { min: 3, message: 'Tiêu đề phải có ít nhất 3 ký tự' },
          ]}
        >
          <Input placeholder="Nhập tiêu đề bài học" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Thứ tự"
            name="order"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
          >
            <InputNumber
              placeholder="0"
              min={0}
              className="w-full"
            />
          </Form.Item>

          <Form.Item
            label="Thời lượng (phút)"
            name="durationMin"
          >
            <InputNumber
              placeholder="0"
              min={0}
              className="w-full"
            />
          </Form.Item>
        </div>

        {/* Upload Video Section */}
        <Form.Item
          label="Video bài học"
        >
          <div className="space-y-4">
            {/* Nút chọn file */}
            {!videoFile && (
              <Upload
                accept="video/*"
                beforeUpload={handleVideoSelect}
                showUploadList={false}
                maxCount={1}
              >
                <Button 
                  icon={<UploadOutlined />} 
                  type="dashed" 
                  block
                  size="large"
                >
                  Chọn video từ máy tính
                </Button>
              </Upload>
            )}

            {/* Hiển thị video đã chọn */}
            {videoFile && (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <VideoCameraOutlined className="text-blue-500" />
                    <span className="font-medium truncate">{videoFile.name}</span>
                    <span className="text-gray-500 text-sm">
                      ({(videoFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={handleRemoveVideo}
                    disabled={isUploading}
                  />
                </div>

                {/* Video preview */}
                {videoPreview && (
                  <div className="mb-4">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full rounded-lg"
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}

                {/* Upload progress */}
                {uploadProgress && (
                  <div className="mt-3">
                    <Progress
                      percent={uploadProgress.percent}
                      status={uploadProgress.status}
                      strokeColor={
                        uploadProgress.status === 'exception' ? '#ff4d4f' : 
                        uploadProgress.status === 'success' ? '#52c41a' : undefined
                      }
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {uploadProgress.status === 'active' && 'Đang upload...'}
                      {uploadProgress.status === 'success' && 'Upload thành công!'}
                      {uploadProgress.status === 'exception' && 'Upload thất bại!'}
                    </div>
                  </div>
                )}
              </div>
            )}
              <div className="text-xs text-gray-500">
              💡 Hỗ trợ: MP4, WebM, OGG, AVI, MKV, MOV (tối đa 500MB)
            </div>

            {/* Hoặc nhập URL */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* Input URL */}
            <Form.Item
              name="videoUrl"
              noStyle
            >
              <Input 
                placeholder="Nhập URL video (YouTube, Vimeo, hoặc URL trực tiếp)" 
                disabled={!!videoFile || isUploading}
              />
            </Form.Item>

          
          </div>
        </Form.Item>

        <Form.Item 
          label="Nội dung bài học"
        >
          <DynamicRichTextEditor
            value={content}
            onChange={(newContent) => {
              setContent(newContent)
              form.setFieldValue('content', newContent)
            }}
            height="300px"
          />
        
        </Form.Item>
        <Divider className="my-8" />

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={isPending || isUploading} 
            block 
            size="large"
          >
            {isPending || isUploading ? 'Đang xử lý...' : 'Tạo bài học'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}