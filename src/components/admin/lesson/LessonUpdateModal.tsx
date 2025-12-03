// src/components/admin/lesson/LessonUpdateModal.tsx
'use client'

import { Modal, Form, Input, Button, message, InputNumber, Select, Upload, Progress, Divider } from 'antd'
import { useEffect, useState } from 'react'
import { useUpdateLesson } from '@/hooks/lesson/useUpdateLesson'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import { Lesson } from '@/types/lesson.type'
import DynamicRichTextEditor from '@/components/common/RichTextEditor'
import { UploadOutlined, VideoCameraOutlined, DeleteOutlined } from '@ant-design/icons'
import type { RcFile } from 'antd/es/upload/interface'
import { api } from '@/lib/axios'

const { TextArea } = Input
const { Option } = Select

interface LessonUpdateModalProps {
  open: boolean
  onClose: () => void
  lesson: Lesson | null
  refetch?: () => void
}

interface UploadProgress {
  percent: number
  status: 'active' | 'success' | 'exception'
  fileName?: string
}

export const LessonUpdateModal = ({ open, onClose, lesson, refetch }: LessonUpdateModalProps) => {
  const [form] = Form.useForm()
  const { mutateAsync, isPending } = useUpdateLesson()
  const { data: allCourses, isLoading: isLoadingCourses } = useAllCourses()
  const [content, setContent] = useState('')
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Khởi tạo form và preview khi mở modal
  useEffect(() => {
    if (lesson && open) {
      form.setFieldsValue({
        title: lesson.title,
        content: lesson.content || '',
        videoUrl: lesson.videoUrl || '',
        order: lesson.order,
        courseId: lesson.courseId,
        durationMin: lesson.durationMin,
      })
      setContent(lesson.content || '')
      setCurrentVideoUrl(lesson.videoUrl || null)
      
      // Reset video file state
      setVideoFile(null)
      setVideoPreview(null)
      setUploadProgress(null)
    }
  }, [lesson, open, form])

  // Reset khi đóng modal
  useEffect(() => {
    if (!open) {
      form.resetFields()
      setContent('')
      setVideoFile(null)
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
        setVideoPreview(null)
      }
      setCurrentVideoUrl(null)
      setUploadProgress(null)
    }
  }, [open, form])

  // Xử lý chọn video file mới
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
    
    // Clear video URL input khi chọn file
    form.setFieldValue('videoUrl', '')
    
    return false // Ngăn upload tự động
  }

  // Xóa video file đã chọn
  const handleRemoveVideo = () => {
    setVideoFile(null)
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
      setVideoPreview(null)
    }
    setUploadProgress(null)
  }

  // Xử lý submit form
  const onFinish = async (values: any) => {
    if (!lesson) return

    try {
      // Nếu có file video mới, upload qua FormData
      if (videoFile) {
        await updateLessonWithVideoFile(lesson.id, values)
      } else {
        // Nếu không có file mới, gửi JSON bình thường
        await updateLessonWithVideoUrl(lesson.id, values)
      }
      if (refetch) {
        refetch(); // Đây sẽ là handleUpdateSuccess từ LessonDetail
      }
    } catch (err: any) {
      message.error(err?.response?.data?.message || 'Lỗi cập nhật bài học')
    }
  }

  // Update lesson với video file (sử dụng FormData)
  const updateLessonWithVideoFile = async (lessonId: number, values: any) => {
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
      await api.put(`/lessons/${lessonId}`, formData, {
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
      onClose()
      refetch?.()

    } catch (error: any) {
      console.error('Update lesson error:', error)
      setUploadProgress({ percent: 0, status: 'exception', fileName: videoFile?.name })
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  // Update lesson với video URL (sử dụng JSON)
  const updateLessonWithVideoUrl = async (lessonId: number, values: any) => {
    const payload = {
      title: values.title,
      content: content,
      videoUrl: values.videoUrl || '',
      order: Number(values.order) || 0,
      courseId: Number(values.courseId),
      durationMin: values.durationMin ? Number(values.durationMin) : undefined,
    }

    await mutateAsync({ id: lessonId, data: payload })
    onClose()
    refetch?.()
  }

  // Hiển thị video hiện tại
  const renderCurrentVideo = () => {
    if (!currentVideoUrl) return null

    const isYoutubeVideo = currentVideoUrl.includes('youtube.com') || currentVideoUrl.includes('youtu.be')
    const isSupabaseVideo = currentVideoUrl.includes('supabase.co')

    return (
      <div className="mb-4 border rounded-lg p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">Video hiện tại:</span>
          <span className="text-xs text-gray-500">
            {isYoutubeVideo ? 'YouTube' : isSupabaseVideo ? 'Uploaded Video' : 'External Video'}
          </span>
        </div>
        
        {isYoutubeVideo ? (
          <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
            <div className="text-center">
              <VideoCameraOutlined className="text-2xl text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 truncate px-4">
                {currentVideoUrl}
              </p>
            </div>
          </div>
        ) : (
          <div className="aspect-video">
            <video
              src={currentVideoUrl}
              controls
              className="w-full rounded"
              style={{ maxHeight: '180px' }}
            />
          </div>
        )}
        
        {isSupabaseVideo && (
          <div className="mt-2 text-xs text-gray-500">
            ⚠️ Nếu upload video mới, video cũ sẽ bị xóa
          </div>
        )}
      </div>
    )
  }

  return (
    <Modal 
      title="Cập nhật bài học" 
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

        {/* Video Section */}
        <Form.Item
          label="Video bài học"
        >
          <div className="space-y-4">
            {/* Hiển thị video hiện tại */}
            {renderCurrentVideo()}

            {/* Nút chọn file mới */}
            {!videoFile && (
              <div className="mb-3">
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
                    size="middle"
                  >
                    Upload video mới
                  </Button>
                </Upload>
              </div>
            )}

            {/* Hiển thị video mới đã chọn */}
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

            {/* Hoặc cập nhật URL */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc cập nhật URL</span>
              </div>
            </div>

            {/* Input URL */}
            <Form.Item
              name="videoUrl"
              noStyle
            >
              <Input 
                placeholder="Nhập URL video mới (YouTube, Vimeo, hoặc URL trực tiếp)" 
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
            {isPending || isUploading ? 'Đang xử lý...' : 'Cập nhật bài học'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}