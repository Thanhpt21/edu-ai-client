'use client'

import { Modal, Button, Tag, List, Card, Statistic, Row, Col } from 'antd'
import { 
  QuestionCircleOutlined, 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  CloseCircleOutlined,
  UserOutlined,
  BarChartOutlined,
  EyeOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'
import { QuizWithRelations } from '@/types/quiz.type'

interface QuizDetailModalProps {
  open: boolean
  onClose: () => void
  quiz: QuizWithRelations | null
}

export function QuizDetailModal({ open, onClose, quiz }: QuizDetailModalProps) {
  if (!quiz) return null

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          <QuestionCircleOutlined />
          <span>Chi tiết Quiz: {quiz.title}</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      width={700}
    >
      <div className="mt-4 space-y-6">
        {/* Thông tin cơ bản */}
        <Card title="Thông tin cơ bản" size="small">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <strong>Mô tả:</strong>
              <p className="mt-1 text-gray-700">{quiz.description || 'Không có mô tả'}</p>
            </Col>
            <Col span={12}>
              <strong>Thời gian làm bài:</strong>
              <p className="mt-1 text-gray-700 flex items-center">
                <ClockCircleOutlined className="mr-2" />
                {quiz.duration ? `${quiz.duration} phút` : 'Không giới hạn'}
              </p>
            </Col>
            <Col span={12}>
              <strong>Trạng thái:</strong>
              <div className="mt-1">
                <Tag color={quiz.isPublished ? 'green' : 'orange'} icon={quiz.isPublished ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                  {quiz.isPublished ? 'Đã công bố' : 'Bản nháp'}
                </Tag>
              </div>
            </Col>
            <Col span={12}>
              <strong>Random câu hỏi:</strong>
              <div className="mt-1">
                <Tag color={quiz.randomizeQuestions ? 'purple' : 'default'}>
                  {quiz.randomizeQuestions ? 'Có' : 'Không'}
                </Tag>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Thống kê */}
        <Card title="Thống kê" size="small">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic 
                title="Số câu hỏi" 
                value={quiz.stats?.totalQuestions || 0} 
                prefix={<QuestionCircleOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="Lần làm quiz" 
                value={quiz.stats?.totalAttempts || 0} 
                prefix={<UserOutlined />}
              />
            </Col>
            <Col span={8}>
              <Statistic 
                title="Điểm trung bình" 
                value={quiz.stats?.averageScore || 0} 
                suffix="/100"
                prefix={<BarChartOutlined />}
                precision={1}
              />
            </Col>
          </Row>
        </Card>

        {/* Thông tin liên quan */}
        <Card title="Thông tin liên quan" size="small">
          <Row gutter={[16, 16]}>
            {quiz.course && (
              <Col span={24}>
                <strong>Khóa học:</strong>
                <div className="mt-1 p-2 bg-gray-50 rounded">
                  <Tag color="blue">{quiz.course.title}</Tag>
                  <span className="ml-2 text-sm text-gray-500">Level: {quiz.course.level}</span>
                </div>
              </Col>
            )}
            {quiz.lesson && (
              <Col span={24}>
                <strong>Bài học:</strong>
                <div className="mt-1 p-2 bg-gray-50 rounded">
                  <Tag color="green">Bài {quiz.lesson.order}: {quiz.lesson.title}</Tag>
                </div>
              </Col>
            )}
          </Row>
        </Card>

        {/* Thời gian */}
        <Card title="Thời gian" size="small">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <strong>Ngày tạo:</strong>
              <p className="mt-1 text-gray-700">
                {dayjs(quiz.createdAt).format('DD/MM/YYYY HH:mm')}
              </p>
            </Col>
            <Col span={12}>
              <strong>Ngày cập nhật:</strong>
              <p className="mt-1 text-gray-700">
                {dayjs(quiz.updatedAt).format('DD/MM/YYYY HH:mm')}
              </p>
            </Col>
          </Row>
        </Card>
      </div>
    </Modal>
  )
}