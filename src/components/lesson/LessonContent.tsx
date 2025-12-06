// src/app/courses/[id]/lessons/components/LessonContent.tsx
import { useState } from 'react'
import { Button, Typography } from 'antd'
import { BookOutlined } from '@ant-design/icons'
import DOMPurify from 'dompurify'

const { Text } = Typography

interface LessonContentProps {
  content?: string
}

export default function LessonContent({ content }: LessonContentProps) {
  const [showContent, setShowContent] = useState(true)

  const formatLessonContent = (content: string) => {
    const cleanHTML = DOMPurify.sanitize(content || '', {
      ALLOWED_TAGS: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'em', 'ul', 'ol', 'li', 'code', 'pre', 'br', 'span', 'div'],
      ALLOWED_ATTR: ['class']
    })
    return { __html: cleanHTML }
  }

  if (!content) return null

  return (
    <div className="mt-6">
      <div className="mb-4">
        <Button
          type="text"
          icon={<BookOutlined />}
          onClick={() => setShowContent(!showContent)}
          className="flex items-center gap-2"
        >
          {showContent ? 'Ẩn nội dung' : 'Hiển thị nội dung'}
        </Button>
      </div>
      
      {showContent && (
        <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
          <div 
            dangerouslySetInnerHTML={formatLessonContent(content)}
            className="lesson-content"
          />
        </div>
      )}
    </div>
  )
}