// src/app/admin/course/[id]/lessons/page.tsx
'use client'

import { useParams } from 'next/navigation'
import { Suspense } from 'react'
import LessonTable from '@/components/admin/lesson/LessonTable'

function CourseLessonsContent() {
  const params = useParams()
  const courseId = params.id as string


  if (!courseId) {
    return (
      <div className="p-6">
        <div className="text-center py-10">
          <h2 className="text-xl font-bold text-red-600">Không tìm thấy khóa học</h2>
          <p className="text-gray-600 mt-2">Vui lòng kiểm tra lại đường dẫn</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
     
      
      <LessonTable courseId={courseId} />
    </div>
  )
}

export default function CourseLessonsPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Đang tải...</div>
        </div>
      </div>
    }>
      <CourseLessonsContent />
    </Suspense>
  )
}