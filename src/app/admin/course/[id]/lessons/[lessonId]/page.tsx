// src/app/admin/course/[id]/lessons/[lessonId]/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { LessonDetail } from '@/components/admin/lesson/LessonDetail'
import { useState } from 'react'
import { Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useRouter } from 'next/navigation'

export default function LessonDetailPage() {
  const params = useParams()
  const router = useRouter()
  
  // Lấy lessonId từ params
  const lessonId = params.lessonId
  const courseId = params.id
  
  // Chuyển đổi sang number
  const numericLessonId = Array.isArray(lessonId) 
    ? parseInt(lessonId[0]) 
    : parseInt(lessonId || '0')
  
  const numericCourseId = Array.isArray(courseId)
    ? parseInt(courseId[0])
    : parseInt(courseId || '0')

  const handleBack = () => {
    // Quay lại trang danh sách lessons của course
    router.push(`/admin/course/${numericCourseId}/lessons`)
  }

  return (
    <div className="p-6">
      {/* Header với nút quay về */}
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleBack}
          className="mb-4"
        >
          Quay lại danh sách bài học
        </Button>
      </div>

      {/* Lesson Detail Component - TỰ QUẢN LÝ UPDATE */}
      <LessonDetail
        lessonId={numericLessonId}
        // Không cần truyền onEdit nữa vì LessonDetail tự quản lý
      />
    </div>
  )
}