// src/app/admin/assignments/page.tsx
'use client'

import AssignmentTable from '@/components/admin/assignment/AssignmentTable'
import { Typography } from 'antd'

const { Title } = Typography

export default function AdminAssignmentPage() {
  return (
    <div className="p-4">
      <Title level={4} className="!mb-4">Quản lý Bài tập</Title>
      <AssignmentTable />
    </div>
  )
}