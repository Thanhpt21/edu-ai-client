// src/components/admin/assignment/AssignmentDetailModal.tsx
'use client'

import { Modal, Button, Tag } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Assignment } from '@/types/assignment.type'
import { getAssignmentStatusColor, getAssignmentStatusLabel } from '@/enums/assignment-status.enum'

interface AssignmentDetailModalProps {
  open: boolean
  onClose: () => void
  assignment: Assignment | null
}

export function AssignmentDetailModal({ open, onClose, assignment }: AssignmentDetailModalProps) {
  if (!assignment) return null

  return (
    <Modal
      title={`Bài nộp: ${assignment.title}`}
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={600}
    >
      <div className="mt-4 space-y-3">
        <div>
          <strong>Mô tả:</strong>
          <p className="mt-1 text-gray-700">{assignment.description || 'Không có mô tả'}</p>
        </div>

        <div>
          <strong>Hạn nộp:</strong>
          <p className="mt-1 text-gray-700">
            {assignment.dueDate ? dayjs(assignment.dueDate).format('DD/MM/YYYY HH:mm') : 'Không có'}
          </p>
        </div>

        <div>
          <strong>Điểm tối đa:</strong>
          <p className="mt-1 text-gray-700">{assignment.maxScore}</p>
        </div>

        <div>
          <strong>Trạng thái:</strong>
          <div className="mt-1">
            <Tag color={getAssignmentStatusColor(assignment.status)}>
              {getAssignmentStatusLabel(assignment.status)}
            </Tag>
          </div>
        </div>

        <div>
          <strong>Tổng bài nộp:</strong>
          <p className="mt-1 text-gray-700">{assignment.stats?.totalSubmissions || 0}</p>
        </div>

        {assignment.stats && assignment.stats.gradedSubmissions > 0 && (
          <div>
            <strong>Đã chấm:</strong>
            <p className="mt-1 text-gray-700">
              {assignment.stats.gradedSubmissions} / {assignment.stats.totalSubmissions} bài
            </p>
          </div>
        )}

        {assignment.stats && assignment.stats.averageScore > 0 && (
          <div>
            <strong>Điểm trung bình:</strong>
            <p className="mt-1 text-green-600 font-medium">
              {assignment.stats.averageScore.toFixed(1)} / {assignment.maxScore}
            </p>
          </div>
        )}

        {assignment.fileUrl && (
          <div className="mt-4 pt-4 border-t">
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              href={assignment.fileUrl}
              target="_blank"
              block
            >
              Tải file bài tập
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}