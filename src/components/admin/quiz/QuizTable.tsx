'use client'

import { Table, Tag, Space, Tooltip, Input, Button, Modal, message, Select, Badge, Image, Spin } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined, 
  QuestionCircleOutlined, 
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  BarChartOutlined,
  UnorderedListOutlined
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useQuizzes } from '@/hooks/quiz/useQuizzes'
import { useDeleteQuiz } from '@/hooks/quiz/useDeleteQuiz'
import { useUpdateQuiz } from '@/hooks/quiz/useUpdateQuiz'
import { QuizCreateModal } from './QuizCreateModal'
import { QuizUpdateModal } from './QuizUpdateModal'
import { QuizDetailModal } from './QuizDetailModal'
import { useAllCourses } from '@/hooks/course/useAllCourses'
import { useLessonsByCourseId } from '@/hooks/lesson/useLessonsByCourseId'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import { QuizWithRelations } from '@/types/quiz.type'
import { Course } from '@/types/course.type'
import { Lesson } from '@/types/lesson.type'
import { QuizQuestionManagerModal } from './QuizQuestionManagerModal'

dayjs.locale('vi')
dayjs.extend(relativeTime)

const { Option } = Select
const { Search } = Input

interface QuizTableProps {
  courseId?: number
  lessonId?: number
}

export default function QuizTable({ courseId, lessonId }: QuizTableProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [courseFilter, setCourseFilter] = useState<number | ''>(courseId || '')
  const [lessonFilter, setLessonFilter] = useState<number | ''>(lessonId || '')
  const [isPublishedFilter, setIsPublishedFilter] = useState<boolean | ''>('')
  const [openCreate, setOpenCreate] = useState(false)
  const [openUpdate, setOpenUpdate] = useState(false)
  const [openViewDetail, setOpenViewDetail] = useState(false)
  const [selectedQuiz, setSelectedQuiz] = useState<QuizWithRelations | null>(null)
  const [openQuestionManager, setOpenQuestionManager] = useState(false) // Thêm state cho modal quản lý câu hỏi

  // Fetch data
  const { data, isLoading, refetch } = useQuizzes({ 
    page, 
    limit: 10, 
    search,
    courseId: courseFilter || undefined,
    lessonId: lessonFilter || undefined,
    isPublished: isPublishedFilter !== '' ? isPublishedFilter : undefined
  })
  
  const { data: coursesData, isLoading: isLoadingCourses } = useAllCourses({ isPublished: true })
  
  const { 
    data: lessonsData, 
    isLoading: isLoadingLessons,
    refetch: refetchLessons 
  } = useLessonsByCourseId(courseFilter || 0)
  
  const { mutateAsync: deleteQuiz } = useDeleteQuiz()
  const { mutateAsync: updateQuiz } = useUpdateQuiz(selectedQuiz?.id || 0)

  const quizzes: QuizWithRelations[] = data?.data || []
  const total = data?.total || 0

  // Filter lessons based on selected course
  const filteredLessons = courseFilter ? (lessonsData || []) : []

  // Effect để refetch lessons khi courseFilter thay đổi
  useEffect(() => {
    if (courseFilter && refetchLessons) {
      refetchLessons()
    }
  }, [courseFilter, refetchLessons])

  const handleOpenQuestionManager = (quiz: QuizWithRelations) => {
    setSelectedQuiz(quiz)
    setOpenQuestionManager(true)
  }


  const columns: ColumnsType<QuizWithRelations> = [
    {
      title: 'STT',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_text, _record, index) => (page - 1) * 10 + index + 1,
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string, record: QuizWithRelations) => (
        <div className="flex flex-col">
          <span className="font-medium">{title}</span>
          {record.description && (
            <span className="text-xs text-gray-500 truncate">{record.description}</span>
          )}
        </div>
      ),
    },
    {
      title: 'Khóa học',
      dataIndex: 'course',
      key: 'course',
      width: 150,
      render: (course: QuizWithRelations['course']) => (
        <div>
          {course ? (
            <div className="flex items-center gap-2">
              <Tag color="blue">{course.title}</Tag>
            </div>
          ) : (
            <span className="text-gray-400">Không có</span>
          )}
        </div>
      ),
    },
    {
      title: 'Bài học',
      dataIndex: 'lesson',
      key: 'lesson',
      width: 150,
      render: (lesson: QuizWithRelations['lesson']) => (
        <div>
          {lesson ? (
            <Tag color="green">Bài {lesson.order}: {lesson.title}</Tag>
          ) : (
            <span className="text-gray-400">Không có</span>
          )}
        </div>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      render: (duration: number | null) => (
        <div className="flex items-center">
          <ClockCircleOutlined className="mr-1 text-gray-500" />
          <span>{duration ? `${duration} phút` : 'Không giới hạn'}</span>
        </div>
      ),
    },
    {
      title: 'Câu hỏi',
      dataIndex: 'stats',
      key: 'questions',
      width: 100,
      align: 'center',
      render: (stats: QuizWithRelations['stats']) => (
        <Badge 
          count={stats?.totalQuestions || 0}
          style={{ 
            backgroundColor: (stats?.totalQuestions || 0) > 0 ? '#1890ff' : '#d9d9d9' 
          }}
        />
      ),
    },
    {
      title: 'Lần làm',
      dataIndex: 'stats',
      key: 'attempts',
      width: 100,
      align: 'center',
      render: (stats: QuizWithRelations['stats']) => (
        <Badge 
          count={stats?.totalAttempts || 0}
          style={{ 
            backgroundColor: (stats?.totalAttempts || 0) > 0 ? '#52c41a' : '#d9d9d9' 
          }}
        />
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isPublished',
      key: 'status',
      width: 100,
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? 'green' : 'orange'} icon={isPublished ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {isPublished ? 'Đã công bố' : 'Bản nháp'}
        </Tag>
      ),
    },
    {
      title: 'Random',
      dataIndex: 'randomizeQuestions',
      key: 'randomize',
      width: 90,
      align: 'center',
      render: (randomize: boolean) => (
        <Tag color={randomize ? 'purple' : 'default'}>
          {randomize ? 'Có' : 'Không'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: any, record: QuizWithRelations) => (
        <Space size="small">
          {/* View details button */}
            <Tooltip title="Quản lý câu hỏi">
            <Button 
              type="link" 
              size="small"
              icon={<UnorderedListOutlined />}
              onClick={() => handleOpenQuestionManager(record)}
              className="!p-0 !h-auto !text-blue-600"
            />
          </Tooltip>

          <Tooltip title="Xem chi tiết">
            <Button 
              type="link" 
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedQuiz(record)
                setOpenViewDetail(true)
              }}
              className="!p-0 !h-auto"
            />
          </Tooltip>

          {/* Edit button */}
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="link" 
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedQuiz(record)
                setOpenUpdate(true)
              }}
              className="!p-0 !h-auto"
            />
          </Tooltip>

          {/* Delete button */}
          <Tooltip title="Xóa">
            <Button 
              type="link" 
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteQuiz(record)}
              className="!p-0 !h-auto"
            />
          </Tooltip>

          {/* Toggle publish status */}
          <Tooltip title={record.isPublished ? 'Ẩn quiz' : 'Công bố quiz'}>
            <Button 
              type="link" 
              size="small"
              onClick={() => handleTogglePublish(record)}
              className={`!p-0 !h-auto ${record.isPublished ? '!text-gray-600' : '!text-green-600'}`}
            >
              {record.isPublished ? 'Ẩn' : 'Công bố'}
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ]

  const handleTogglePublish = async (quiz: QuizWithRelations) => {
    try {
      await updateQuiz({ isPublished: !quiz.isPublished })
      message.success(`Quiz đã được ${!quiz.isPublished ? 'công bố' : 'ẩn'}`)
      refetch?.()
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thay đổi trạng thái thất bại')
    }
  }

  const handleDeleteQuiz = (record: QuizWithRelations) => {
    Modal.confirm({
      title: 'Xác nhận xóa quiz',
      content: (
        <div>
          <p>Bạn có chắc chắn muốn xóa quiz "{record.title}" không?</p>
          {record.stats?.totalAttempts && record.stats.totalAttempts > 0 && (
            <p className="text-red-500 mt-1">
              ⚠️ Có {record.stats.totalAttempts} lần làm quiz sẽ bị xóa!
            </p>
          )}
        </div>
      ),
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await deleteQuiz(record.id)
          message.success('Xóa quiz thành công')
          refetch?.()
        } catch (error: any) {
          message.error(error?.response?.data?.message || 'Xóa thất bại')
        }
      },
    })
  }

  const handleSearch = (value: string) => {
    setPage(1)
    setSearch(value)
  }

  const handleResetFilters = () => {
    setSearch('')
    setCourseFilter(courseId || '')
    setLessonFilter(lessonId || '')
    setIsPublishedFilter('')
    setPage(1)
  }

  const handleCourseChange = (courseId: number | '') => {
    setCourseFilter(courseId)
    setLessonFilter('')
    setPage(1)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Search
            placeholder="Tìm kiếm quiz..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={handleSearch}
            allowClear
            className="w-[250px]"
            prefix={<SearchOutlined className="text-gray-400" />}
          />

          {!courseId && (
            <Select
              placeholder="Chọn khóa học"
              value={courseFilter}
              onChange={handleCourseChange}
              allowClear
              showSearch
              optionFilterProp="children"
              className="w-[200px]"
              loading={isLoadingCourses}
            >
              {coursesData?.map((course: Course) => (
                <Option key={course.id} value={course.id}>
                  <div className="flex items-center gap-2">
                    <span>{course.title}</span>
                  </div>
                </Option>
              ))}
            </Select>
          )}

          {!lessonId && (
            <Select
              placeholder="Chọn bài học"
              value={lessonFilter}
              onChange={(value) => {
                setLessonFilter(value)
                setPage(1)
              }}
              allowClear
              showSearch
              optionFilterProp="children"
              className="w-[200px]"
              loading={isLoadingLessons}
              disabled={!courseFilter}
              notFoundContent={courseFilter ? (
                <div className="py-2 text-center">
                  {isLoadingLessons ? (
                    <Spin size="small" />
                  ) : (
                    <span className="text-gray-400">Không có bài học nào</span>
                  )}
                </div>
              ) : (
                <div className="py-2 text-center text-gray-400">
                  Vui lòng chọn khóa học trước
                </div>
              )}
            >
              {filteredLessons.map((lesson: Lesson) => (
                <Option key={lesson.id} value={lesson.id}>
                  Bài {lesson.order}: {lesson.title}
                </Option>
              ))}
            </Select>
          )}

          <Select
            placeholder="Trạng thái"
            value={isPublishedFilter}
            onChange={setIsPublishedFilter}
            allowClear
            className="w-[130px]"
          >
            <Option value={true}>Đã công bố</Option>
            <Option value={false}>Bản nháp</Option>
          </Select>

          <Button onClick={handleResetFilters}>
            Đặt lại
          </Button>
        </div>

        <div className="flex gap-2">
          <Button 
            type="default"
            icon={<BarChartOutlined />}
            onClick={() => {
              // Có thể thêm modal thống kê quiz
              message.info('Thống kê quiz đang phát triển')
            }}
          >
            Thống kê
          </Button>
          
          <Button 
            type="primary" 
            onClick={() => setOpenCreate(true)}
            icon={<PlusOutlined />}
          >
            Tạo quiz
          </Button>
        </div>
      </div>


      <Table
        columns={columns}
        dataSource={quizzes}
        rowKey="id"
        loading={isLoading}
        scroll={{ x: 1500 }}
        pagination={{
          total: total,
          current: page,
          pageSize: 10,
          onChange: (p) => setPage(p),
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} quiz`,
          showSizeChanger: false,
        }}
      />

       <QuizQuestionManagerModal
        open={openQuestionManager}
        onClose={() => {
          setOpenQuestionManager(false)
          setSelectedQuiz(null)
        }}
        quiz={selectedQuiz}
        refetchQuizzes={refetch} // Refetch lại danh sách quiz để cập nhật stats
      />

      <QuizCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        refetch={refetch}
        defaultCourseId={courseId}
        defaultLessonId={lessonId}
      /> 

      <QuizUpdateModal
        open={openUpdate}
        onClose={() => setOpenUpdate(false)}
        quiz={selectedQuiz}
        refetch={refetch}
      />

      <QuizDetailModal
        open={openViewDetail}
        onClose={() => {
          setOpenViewDetail(false)
          setSelectedQuiz(null)
        }}
        quiz={selectedQuiz}
      />
    </div>
  )
}