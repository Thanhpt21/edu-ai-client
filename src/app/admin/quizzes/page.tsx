'use client'

import QuizTable from '@/components/admin/quiz/QuizTable'
import { Typography } from 'antd'

const { Title } = Typography

export default function AdminQuizPage() {
  return (
    <div className="p-4">
      <Title level={4} className="!mb-4">Quản lý Quiz</Title>
      <QuizTable />
    </div>
  )
}